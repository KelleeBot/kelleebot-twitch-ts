import {
    getAllChannels,
    getAllFamousLinks,
    getChannelInfo,
    getCooldown,
    isBroadcaster,
    log,
    msToTime,
    processArguments,
    getUserInfo
} from "../utils";
import { devs } from "../config/config.json";
import { Client } from "../Client";
import { Userstate } from "tmi.js";

const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default async (
    client: Client,
    channel: string,
    userstate: Userstate,
    message: string,
    self: boolean
) => {
    try {
        checkTwitchChat(client, userstate, message, channel);

        if (self || userstate.bot) return;

        let channelInfo = await getChannelInfo(client, channel);
        const userInfo = await getUserInfo(client, userstate.username);

        if (userInfo!.isBlacklisted) return;

        // if (message.toLowerCase() === `@${process.env.BOT_USERNAME}`) {
        //   return client.say(
        //     channel,
        //     `/me My prefix for this channel is "${channelInfo.prefix}".`
        //   );
        // }

        if (channelInfo!._id === "ramenbomber_") {
            if (!message.startsWith(channelInfo!.prefix) && message.toLowerCase().includes("uwu")) {
                return client.say(channel, "PrideUwu PrideUwu");
            }
        }

        const prefixRegex = new RegExp(
            `^(@${process.env.BOT_USERNAME}|${escapeRegex(channelInfo!.prefix)})`
        );

        if (!prefixRegex.test(message)) return;

        //@ts-ignore
        const [, matchedPrefix] = message.match(prefixRegex);
        let msgArgs = message.slice(matchedPrefix.length).trim().split(/ +/);
        let cmdName = msgArgs.shift()!.toLowerCase();

        const command =
            client.commands.get(cmdName) ||
            (channelInfo!.commandAlias
                ? client.commands.get(channelInfo!.commandAlias[cmdName])
                : false);
        if (!command) return;

        if (
            !userstate.mod &&
            !(await isBroadcaster(client, userstate.username, channel)) &&
            command.isModOnly &&
            !devs.includes(userstate.username)
        )
            return;

        if (command.devOnly && !devs.includes(userstate.username)) return;

        if (channelInfo!.disabledCommands.includes(command.name)) return;

        if (command.channels === "all" || typeof command.channels === "undefined") {
            command.channels = await getAllChannels();
        }

        if (typeof command.channels === "string") {
            command.channels = [command.channels];
        }

        if (!command.channels.includes(channel)) return;

        const cd = await getCooldown(client, command, channel);
        let cooldowns;
        if (cd) {
            if (typeof command.globalCooldown === "undefined" || command.globalCooldown) {
                if (!client.globalCooldowns.has(command.name)) {
                    client.globalCooldowns.set(command.name, new Map<string, number>());
                }
                cooldowns = client.globalCooldowns;
            } else {
                if (!client.channelCooldowns.has(channel)) {
                    client.channelCooldowns.set(channel, new Map<string, Map<string, number>>());
                }
                cooldowns = client.channelCooldowns.get(channel);
                if (!cooldowns!.has(command.name)) {
                    cooldowns!.set(command.name, new Map<string, number>());
                }
            }

            const now = Date.now();
            const timestamps = cooldowns!.get(command.name);
            const cooldownAmount = cd * 1000;
            if (timestamps?.has(`${userstate["user-id"]}-${channel}`)) {
                const expirationTime =
                    timestamps?.get(`${userstate["user-id"]}-${channel}`)! + cooldownAmount;
                if (now < expirationTime)
                    return console.log(
                        `Command on cooldown. Cooldown expires in ${msToTime(expirationTime - now)}`
                    );
            }
            timestamps?.set(`${userstate["user-id"]}-${channel}`, now);
            setTimeout(
                () => timestamps?.delete(`${userstate["user-id"]}-${channel}`),
                cooldownAmount
            );
        }

        let flags;
        if (command.arguments) {
            flags = processArguments(message, msgArgs, command.arguments);
        }
        if (flags && flags.invalid) {
            if (flags.prompt) {
                return client.say(channel, `/me ${flags.prompt}`);
            }
        }

        return command.execute({
            client,
            userstate,
            channel,
            message,
            args: msgArgs,
            //@ts-ignore
            flags
        });
    } catch (e) {
        console.log(e);
    }
};

/**
 *
 * @param client
 * @param userstate
 * @param message
 * @param channel
 * @returns
 */
const checkTwitchChat = async (
    client: Client,
    userstate: Userstate,
    message: string,
    channel: string
) => {
    if (userstate.mod || (await isBroadcaster(client, userstate.username, channel))) return;

    if (message.length > 450) {
        client
            .deletemessage(channel, userstate["id"]!)
            .then(() => {
                client.say(
                    channel,
                    `/me ${userstate["display-name"]}, the mods here don't like reading long messages. Please try to keep it short and sweet.`
                );
            })
            .catch((e) => {
                log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
            });
    }

    const result = await getAllFamousLinks(client);
    const famousChecker = (value: string) => result.some((element) => value.includes(element));

    if (famousChecker(message.toLowerCase())) {
        client
            .ban(channel, userstate.username, "Famous bot")
            .then(() => {
                client.say(channel, `/me No, I don't wanna become famous. Good bye!`);
            })
            .catch((e) => {
                log("ERROR", `${__filename}`, e);
            });
    }

    if (
        message ===
        "Hey. I want to offer you a boost on twitch, a stable number of viewers, there are chat bots. I will offer a price lower than any competitor. Auto-start when stream became online.Pay only for the time when the stream is online.Pay by the hour! I'll provide a free test.The client has access to the panel to launch, and can control the process himself!For tech problems, a full refund. Telegram @Twitch_viewers Discord Twitch#3227"
    ) {
        client
            .ban(channel, userstate.username)
            .then(() => {
                client.say(channel, `/me No, I don't want a boost on Twitch. Get outta here!`);
            })
            .catch((e) => {
                log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
            });
    }
};
