import { Command } from "../../interfaces";
import { setCooldown } from "../../utils";

export default {
    name: "social",
    aliases: ["socials"],
    category: "mackthevoid",
    channels: ["mackthevoid"],
    cooldown: 15,
    execute({ client, channel, userstate }) {
        setCooldown(client, this, channel, userstate);
        return client.say(channel, `/me Twitter: https://twitter.com/voidmack`);
    }
} as Command;
