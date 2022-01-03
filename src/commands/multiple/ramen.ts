import { Command } from "../../interfaces";
import { setCooldown } from "../../utils";

export default {
    name: "ramen",
    category: "Multiple",
    cooldown: 15,
    channels: ["#ramenbomber_", "#krisypaulinee"],
    async execute({ client, channel, userstate }) {
        setCooldown(client, this, channel, userstate);
        return client.say(
            channel,
            "/me Ayo! Ramen has a new YouTube video! Let's check it out https://www.youtube.com/watch?v=nTYYK67jHeA"
        );
    }
} as Command;
