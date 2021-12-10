import { Command } from "../../interfaces";
import { setCooldown, log, errorMessage } from "../../utils";
import fetch from "node-fetch";
import { Userstate } from "tmi.js";
import { formatDistance } from "date-fns";
import { utcToZonedTime, format } from "date-fns-tz";

const headers = {
    "client-id": process.env.TWITCH_CLIENT_ID,
    Authorization: `Bearer ${process.env.TWITCH_BEARER_TOKEN}`
};

export default {
    name: "accountage",
    category: "jkirstyn",
    channels: ["#jkirstyn"],
    cooldown: 15,
    async execute({ client, channel, userstate }) {
        setCooldown(client, this, channel, userstate);
        const account = (await getAccountAge(userstate).catch((e) => {
            log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
        })) as any;

        if (!account) return errorMessage(client, channel);
        if (!account.data.length) return;

        const { login, created_at } = account.data[0];
        const timeFormat = "EEE, MMM d, yyyy h:mm a zzz";
        const createdAtEasternDate = utcToZonedTime(created_at, "America/New_York");
        const msg = `${format(createdAtEasternDate, timeFormat, {
            timeZone: "America/New_York"
        })} (${formatDistance(new Date(created_at), new Date(), {
            addSuffix: true
        })})`;
        return client.say(channel, `/me ${login}, your account was created on ${msg}.`);
    }
} as Command;

const getAccountAge = (userstate: Userstate) => {
    return new Promise(async (resolve, reject) => {
        const url = `https://api.twitch.tv/helix/users?id=${userstate["user-id"]}`;
        try {
            const body = await fetch(url, { headers });
            const result = await body.json();
            resolve(result);
        } catch (e) {
            log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
            reject("An error occurred. Please try again in a few moments.");
        }
    });
};
