import { Command } from "../../interfaces";
import { setCooldown } from "../../utils";

export default {
    name: "kofi",
    aliases: ["ko-fi"],
    category: "ramenbomber_",
    channels: ["ramenbomber_"],
    cooldown: 15,
    execute({ client, channel, userstate }) {
        setCooldown(client, this, channel, userstate);
        return client.say(
            channel,
            "/me Yo! If you want to support my work outside of Twitch, please check out my Ko-Fi! https://ko-fi.com/ramenbomber"
        );
    }
} as Command;
