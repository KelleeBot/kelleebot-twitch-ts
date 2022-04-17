import { Command } from "../../interfaces";
import { log, replaceChars, errorMessage, setCooldown } from "../../utils";
import axios from "axios";

export default {
    name: "followedon",
    category: "Multple",
    cooldown: 15,
    channels: ["#jkirstyn", "#ramenbomber_", "#mackthevoid"],
    async execute({ client, channel, userstate }) {
        setCooldown(client, this, channel, userstate);
        try {
            const resp = await axios.get(
                `https://beta.decapi.me/twitch/followed/${channel.slice(1)}/${
                    userstate.username
                }?tz=America/New_York&format=${encodeURIComponent("d/m/Y g:i:s A T")}`
            );
            const { data } = resp;

            if (!data) return errorMessage(client, channel);

            if (replaceChars(data) === "a user cannot follow themself")
                return client.say(channel, `/me ${data}`);

            if (replaceChars(data).includes("does not follow"))
                return client.say(channel, `/me ${data}.`);

            return client.say(
                channel,
                `/me ${userstate["display-name"]} followed ${channel.slice(1)} on ${data}.`
            );
        } catch (e) {
            log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
            return errorMessage(client, channel);
        }
    }
} as Command;
