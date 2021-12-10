import { Userstate } from "tmi.js";
import { Client } from "../Client";
import { Command } from "../interfaces/Command";
import { Arguments } from "../types/Arguments";
import { Flags } from "../types/Flags";
import channelSchema from "../models/channelSchema";
import fetch from "node-fetch";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import advanced from "dayjs/plugin/advancedFormat";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);

const consoleColors = {
    SUCCESS: "\u001b[32m",
    WARNING: "\u001b[33m",
    INFO: "\u001b[33m",
    ERROR: "\u001b[31m"
};

const hasAmount = ["STRING", "NUMBER"];
const channels: string[] = [];

/**
 * Function that prints a message to the console.
 * @param {String} type Either "SUCCESS", "ERROR", "WARNING", or "INFO"
 * @param {String} path The file path
 * @param {String} text The text to show in the console
 */
export const log = (type: "SUCCESS" | "ERROR" | "WARNING" | "INFO", path: string, text: string) => {
    const timestamp = dayjs().tz("America/Denver").format("MM-DD-YYYY HH:mm:ss");
    console.log(
        `\u001b[36;1m<${timestamp}>\u001b[0m\u001b[34m [${path}]\u001b[0m - ${consoleColors[type]}${text}\u001b[0m`
    );
};

export const updateChannelsCache = (channel: string, join = true) => {
    if (join) channels.push(channel);
    else {
        const index = channels.indexOf(channel);
        if (index > -1) channels.splice(index, 1);
    }
};

export const getAllChannels = async () => {
    if (channels.length) return channels;
    const results = await channelSchema.find({});
    for (const result of results) {
        channels.push(result._id);
    }
    return channels;
};

export const getAllFamousLinks = async (client: Client) => {
    if (client.famousCache.length) return client.famousCache;
    const results = (await client.DBFamousLinks.find({})) as any;
    for (const result of results) {
        for (const famous of result.famous) {
            client.famousCache.push(famous);
        }
    }
    return client.famousCache;
};

/**
 * Helper function to check if correct arguments were passed in
 * @param {String} message The message to process
 * @param {String[]} msgArgs The arguments for the command
 * @param {Arguments} expectedArgs The expected arguments the command should have
 * @returns
 */
export const processArguments = (message: string, msgArgs: string[], expectedArgs: Arguments) => {
    let counter = 0;
    let amount, num;
    let flags: Flags = {};

    for (const argument of expectedArgs) {
        if (hasAmount.includes(argument.type)) {
            amount = argument.amount && argument.amount > 1 ? argument.amount : 1;
        } else {
            amount = 1;
        }

        for (let i = 0; i < amount; i++) {
            switch (argument.type) {
                case "STRING":
                    if (!msgArgs[counter]) {
                        return { invalid: true, prompt: argument.prompt };
                    }

                    if (
                        argument.words &&
                        !argument.words.includes(msgArgs[counter].toLowerCase())
                    ) {
                        return { invalid: true, prompt: argument.prompt };
                    }

                    if (argument.regexp && !argument.regexp.test(msgArgs[counter])) {
                        return { invalid: true, prompt: argument.prompt };
                    }

                    if (amount == 1) {
                        flags[argument.id] = msgArgs[counter];
                    } else if (flags[argument.id]) {
                        //@ts-ignore
                        flags[argument.id].push(msgArgs[counter]);
                    } else {
                        flags[argument.id] = [msgArgs[counter]];
                    }
                    break;

                case "NUMBER":
                    num = Number(msgArgs[counter]);
                    if (!msgArgs[counter] || isNaN(num)) {
                        return { invalid: true, prompt: argument.prompt };
                    }

                    if (argument.min && argument.min > num) {
                        return { invalid: true, prompt: argument.prompt };
                    }

                    if (argument.max && argument.max < num) {
                        return { invalid: true, prompt: argument.prompt };
                    }

                    if (argument.toInteger) {
                        //@ts-ignore
                        num = parseInt(num);
                    }

                    if (amount == 1) {
                        flags[argument.id] = num;
                    } else if (flags[argument.id]) {
                        //@ts-ignore
                        flags[argument.id].push(num);
                    } else {
                        flags[argument.id] = [num];
                    }
                    break;
                default:
                    console.warn(
                        //@ts-ignore
                        `processArguments: the argument type "${argument.type}" doesn't exist.`
                    );
            }
            counter++;
        }
    }
    return flags;
};

/**
 * Retrieves the channel info either from the cache or the database
 * @param {Client} client The client object
 * @param {String} channel The channel to get the information for
 * @returns The channel info
 */
export const getChannelInfo = async (client: Client, channel: string) => {
    const channelName = channel.slice(1);
    let channelInfo = client.channelInfoCache.get(channelName);
    if (!channelInfo) {
        channelInfo = await client.DBChannel.findByIdAndUpdate(
            channelName,
            {},
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        client.channelInfoCache.set(channelName, channelInfo);
    }
    return channelInfo;
};

export const getUserInfo = async (client: Client, userID: string) => {
    let userInfo = client.userInfoCache.get(userID);
    if (!userInfo) {
        userInfo = await client.DBUser.findByIdAndUpdate(
            userID,
            {},
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        client.userInfoCache.set(userID, userInfo);
    }
    return userInfo;
};

/**
 * Gets the cooldown for a command
 * @param {Command} command The command to get the cooldown for
 * @returns The command cooldown, in seconds or undefined if there is no cooldown
 */
export const getCooldown = async (client: Client, command: Command, channel: string) => {
    const channelInfo = await getChannelInfo(client, channel);
    let cd = command.cooldown;
    if (channelInfo.commandCooldowns && channelInfo.commandCooldowns[command.name]) {
        cd = channelInfo.commandCooldowns[command.name][channel.slice(1)] / 1000;
    }
    return cd;
};

/**
 * Sets the cooldown for a command
 * @param {Client} client The client object
 * @param {Command} command The command to set the cooldown for
 * @param {String} channel The channel the command belongs to
 * @param {Userstate} userstate The userstate object to set the cooldown for
 */
export const setCooldown = async (
    client: Client,
    command: Command,
    channel: string,
    userstate: Userstate
) => {
    const cd = await getCooldown(client, command, channel);
    if (!cd) return;

    let cooldowns;
    if (typeof command.globalCooldown === "undefined" || command.globalCooldown) {
        if (!client.globalCooldowns.has(command.name)) {
            client.globalCooldowns.set(command.name, new Map());
        }
        cooldowns = client.globalCooldowns;
    } else {
        if (!client.channelCooldowns.has(channel)) {
            client.channelCooldowns.set(channel, new Map());
        }
        cooldowns = client.channelCooldowns.get(channel);
        if (!client.channelCooldowns.has(channel)) {
            client.channelCooldowns.set(channel, new Map());
        }
        cooldowns = client.channelCooldowns.get(channel);
        if (!cooldowns!.has(command.name)) {
            cooldowns!.set(command.name, new Map());
        }
    }

    const now = Date.now();
    const timestamps = cooldowns!.get(command.name);
    const cooldownAmount = cd * 1000;

    timestamps!.set(userstate["user-id"]!, now);
    setTimeout(() => timestamps!.delete(userstate["user-id"]!), cooldownAmount);
};

/**
 * Checks to see if the user in chat is the broadcaster for the current channel
 * @param {Client} client The client object
 * @param {String} user The user in chat to check
 * @param {String} channel The channel to check
 * @returns True if the user in chat is the broadcaster; false otherwise
 */
export const isBroadcaster = async (client: Client, user: string, channel: string) => {
    const channelInfo = await getChannelInfo(client, channel);
    if (!channelInfo) return false;
    return (
        user.toLowerCase() == channelInfo._id &&
        user.toLowerCase() == channel.slice(1).toLowerCase()
    );
};

/**
 * Converts milliseconds to a human readable time string
 * @param {Number} ms The number to convert
 * @returns The time string
 */
export const msToTime = (ms: number) => {
    let time = "";

    let n = 0;
    if (ms >= 31536000000) {
        n = Math.floor(ms / 31536000000);
        time = `${n}y `;
        ms -= n * 31536000000;
    }

    if (ms >= 2592000000) {
        n = Math.floor(ms / 2592000000);
        time += `${n}mo `;
        ms -= n * 2592000000;
    }

    if (ms >= 604800000) {
        n = Math.floor(ms / 604800000);
        time += `${n}w `;
        ms -= n * 604800000;
    }

    if (ms >= 86400000) {
        n = Math.floor(ms / 86400000);
        time += `${n}d `;
        ms -= n * 86400000;
    }

    if (ms >= 3600000) {
        n = Math.floor(ms / 3600000);
        time += `${n}h `;
        ms -= n * 3600000;
    }

    if (ms >= 60000) {
        n = Math.floor(ms / 60000);
        time += `${n}m `;
        ms -= n * 60000;
    }

    n = Math.ceil(ms / 1000);
    time += n === 0 ? "" : `${n}s`;

    return time.trimEnd();
};

/**
 * Replaces any special characters a string might contain
 * @param {String} str The string to remove the special characters from
 * @returns The string with the special characters removed
 */
export const replaceChars = (str: string) => {
    return str
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_'""`~()]/g, "")
        .replace(/\s{2,}/g, " ");
};

/**
 * Sends a generic error message in chat
 * @param {Client} client The client object
 * @param {String} channel The channel to send the error message to
 */
export const errorMessage = (client: Client, channel: string) => {
    client.say(channel, "/me An error has occurred. Please try again.");
};

export const randomRange = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const isModOrVIP = async (client: Client, channel: string) => {
    const channelName = channel.slice(1).toLowerCase();

    const vips = await client.vips(channelName);
    const mods = await client.mods(channelName);

    return (
        vips.includes(`${process.env.BOT_USERNAME}`) || mods.includes(`${process.env.BOT_USERNAME}`)
    );
};

export const getCurrentGame = (channel: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const body = await fetch(`https://beta.decapi.me/twitch/game/${channel}`);
            const result = await body.text();
            if (result) {
                resolve(result);
            } else {
                reject("There was a problem retrieving game data.");
            }
        } catch (e) {
            log("ERROR", `${__filename}`, `An error has occurred : ${e}`);
        }
    });
};
