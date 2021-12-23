import { Command } from "../../interfaces";
import { setCooldown } from "../../utils";

export default {
    name: "carrd",
    aliases: ["kofi", "ko-fi", "tiktok", "youtube", "yt"],
    category: "ramenbomber_",
    channels: ["#ramenbomber_"],
    cooldown: 15,
    execute({ client, channel, userstate }) {
        setCooldown(client, this, channel, userstate);
        return client.say(
            channel,
            "/me Hello! I'm Ramen Bomber! I produce content across a variety of different platforms and love to help spread good vibes through my work. Check out all of my platforms and portfolio here ~ https://ramenbomber.carrd.co"
        );
    }
} as Command;
