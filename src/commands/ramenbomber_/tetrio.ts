import { Command } from "../../interfaces";
import { getLink, log, setCooldown, errorMessage } from "../../utils";

export default {
    name: "tetrio",
    aliases: ["room", "code"],
    category: "ramenbomber_",
    channels: ["#ramenbomber_"],
    cooldown: 15,
    async execute({ client, channel, userstate }) {
        setCooldown(client, this, channel, userstate);
        try {
            const result = await getLink(channel.slice(1));
            if (!result) {
                return client.say(channel, `/me No room code has been set yet.`);
            }

            const { link } = result;
            return client.say(channel, `/me Room Code: ${link}`);
        } catch (e) {
            log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
            return errorMessage(client, channel);
        }
    }
} as Command;
