import { Command } from "../../interfaces";
import { setCooldown } from "../../utils";

export default {
    name: "yt",
    aliases: ["youtube"],
    category: "ramenbomber_",
    channels: ["ramenbomber_"],
    cooldown: 15,
    execute({ client, channel, userstate }) {
        setCooldown(client, this, channel, userstate);
        return client.say(
            channel,
            "/me Check out my YouTube channel! https://www.youtube.com/channel/UCvlfWdqmcPMcRwyPv4TEdHA"
        );
    }
} as Command;
