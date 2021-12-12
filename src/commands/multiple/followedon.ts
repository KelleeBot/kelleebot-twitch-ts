import { Command } from "../../interfaces";
import { log, replaceChars, errorMessage, setCooldown } from "../../utils";
import fetch from "node-fetch";

export default {
    name: "followedon",
    category: "Multple",
    cooldown: 15,
    channels: ["#jkirstyn", "#ramenbomber_", "#mackthevoid"],
    async execute({ client, channel, userstate }) {
        setCooldown(client, this, channel, userstate);
        const data = (
            await fetch(
                `https://beta.decapi.me/twitch/followed/${channel.slice(1)}/${
                    userstate.username
                }?tz=America/New_York&format=${encodeURIComponent("d/m/Y g:i:s A T")}`
            )
        )
            .then((r: Response) => r.text())
            .catch((e: Error) => log("ERROR", `${__filename}`, `An error has occurred: ${e}`));

        if (!data) return errorMessage(client, channel);

        if (replaceChars(data) === "a user cannot follow themself") {
            return client.say(channel, `/me ${data}`);
        }

        if (replaceChars(data).includes("does not follow")) {
            return client.say(channel, `/me ${data}.`);
        }

        return client.say(
            channel,
            `/me ${userstate["display-name"]} followed ${channel.slice(1)} on ${data}.`
        );
    }
} as Command;
