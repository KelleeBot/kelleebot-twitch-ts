import { Command } from "../../interfaces";
import { setCooldown } from "../../utils";

export default {
    name: "positive",
    category: "mackthevoid",
    channels: ["mackthevoid"],
    cooldown: 15,
    execute({ client, channel, userstate }) {
        setCooldown(client, this, channel, userstate);
        return client.say(
            channel,
            `/me Positive energy swirls through the air... A gentle voice begins to whisper... "You are amazing! You are worth it - YOU MATTER! I believe in you"`
        );
    }
} as Command;
