import { Command } from "../../interfaces";
import { setCooldown, log, errorMessage } from "../../utils";
import axios from "axios";

export default {
    name: "uptime",
    category: "Multiple",
    cooldown: 15,
    channels: ["#ramenbomber_", "#mackthevoid"],
    async execute({ client, channel, userstate }) {
        setCooldown(client, this, channel, userstate);
        try {
            const resp = await axios.get(
                `https://beta.decapi.me/twitch/uptime/${encodeURIComponent(channel.slice(1))}`
            );
            const { data } = resp;

            if (!data) return errorMessage(client, channel);

            if (data.toLowerCase().includes("offline")) return client.say(channel, `/me ${data}`);
            return client.say(channel, `/me ${channel.slice(1)} has been live for ${data}.`);
        } catch (e) {
            log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
            return errorMessage(client, channel);
        }
    }
} as Command;
