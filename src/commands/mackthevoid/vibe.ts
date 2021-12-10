import { Command } from "../../interfaces";
import { setCooldown } from "../../utils";

export default {
    name: "vibe",
    channels: ["mackthevoid"],
    cooldown: 15,
    execute({ client, channel, userstate }) {
        setCooldown(client, this, channel, userstate);
        return client.say(
            channel,
            `/me Sending hugs and positive vibes to everyone here - You are worth it!`
        );
    }
} as Command;
