import { Command } from "../../../interfaces";
import { log, getUserInfo, errorMessage } from "../../../utils";
import fetch from "node-fetch";

const headers = {
    "client-id": process.env.TWITCH_CLIENT_ID,
    Authorization: `Bearer ${process.env.TWITCH_BEARER_TOKEN}`
};

export default {
    name: "blacklist",
    category: "Bot Owner",
    devOnly: true,
    channels: "all",
    arguments: [
        {
            type: "STRING",
            prompt: "Please specify either add or remove.",
            words: ["add", "remove"]
        },
        {
            type: "STRING",
            prompt: "Please specify the Twitch user."
        }
    ],
    async execute({ client, channel, args, userstate }) {
        const user = args[1].startsWith("@") ? args[1].replace("@", "") : args[1];
        try {
            const blacklist = (await getUserID(user)) as any;
            const { id, login } = blacklist.data[0];
            let userInfo = await getUserInfo(client, id);

            switch (args[0].toLowerCase()) {
                case "add":
                    if (user.toLowerCase() === userstate.username.toLowerCase()) {
                        return client.say(channel, "/me You cannot blacklist yourself.");
                    }

                    if (userInfo.isBlacklisted) {
                        return client.say(
                            channel,
                            `/me Looks like ${login} is already blacklisted.`
                        );
                    }

                    userInfo.isBlacklisted = true;
                    await client.DBUser.findByIdAndUpdate(
                        id,
                        { $set: { isBlacklisted: true } },
                        { new: true, upsert: true, setDefaultsOnInsert: true }
                    );
                    return client.say(channel, `/me You have successfully blacklisted ${login}.`);
                case "remove":
                    if (!userInfo.isBlacklisted) {
                        return client.say(channel, `/me ${login} is currently not blacklisted.`);
                    }

                    userInfo.isBlacklisted = false;
                    await client.DBUser.findByIdAndUpdate(
                        id,
                        { $set: { isBlacklisted: false } },
                        { new: true, upsert: true, setDefaultsOnInsert: true }
                    );
                    return client.say(channel, `/me You have succesfully whitelisted ${login}.`);
            }
        } catch (e) {
            log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
            return errorMessage(client, channel);
        }
    }
} as Command;

const getUserID = (user: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const body = await fetch(
                `https://api.twitch.tv/helix/users?login=${encodeURIComponent(user)}`,
                { headers }
            );
            const result = await body.json();
            if (result) {
                resolve(result);
            } else {
                reject("There was a problem retrieving user info.");
            }
        } catch (e) {
            log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
        }
    });
};
