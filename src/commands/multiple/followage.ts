import { Command } from "../../interfaces";
import axios from "axios";
import { log, replaceChars, errorMessage, setCooldown } from "../../utils";

export default {
    name: "followage",
    category: "Multple",
    cooldown: 15,
    channels: ["#jkirstyn", "#ramenbomber_", "#mackthevoid"],
    async execute({ client, channel, userstate }) {
        setCooldown(client, this, channel, userstate);
        try {
            const resp = await axios.get(
                `https://beta.decapi.me/twitch/followage/${encodeURIComponent(
                    channel.slice(1)
                )}/${encodeURIComponent(userstate.username)}?precision=7`
            );
            const { data } = resp;

            if (!data) return errorMessage(client, channel);

            if (replaceChars(data) === "a user cannot follow themself")
                return client.say(channel, `/me ${data}`);

            if (replaceChars(data).includes("does not follow"))
                return client.say(channel, `/me ${data}`);

            return client.say(
                channel,
                `/me ${userstate["display-name"]} has been following ${channel.slice(
                    1
                )} for ${data}.`
            );
        } catch (e) {
            log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
            return errorMessage(client, channel);
        }
    }
} as Command;
