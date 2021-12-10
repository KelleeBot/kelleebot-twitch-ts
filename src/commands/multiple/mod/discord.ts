import { Command } from "../../../interfaces";
import discordInvites from "../../../config/discordInvites.json";

export default {
    name: "discord",
    category: "Mod",
    channels: ["ramenbomber_", "jkirstyn"],
    isModOnly: true,
    execute({ client, channel }) {
        const channelName = channel.slice(1).toLowerCase();
        //@ts-ignore
        const discord = discordInvites[channelName];
        return client.say(channel, `/me ${discord}`);
    }
} as Command;
