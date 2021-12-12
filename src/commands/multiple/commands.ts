import { Command } from "../../interfaces";
import { setCooldown, getChannelInfo } from "../../utils";

export default {
    name: "commands",
    aliases: ["cmd", "cmds"],
    category: "Multiple",
    cooldown: 15,
    hideCommand: true,
    canNotDisable: true,
    channels: ["#ramenbomber_", "#mackthevoid"],
    async execute({ client, channel, userstate }) {
        setCooldown(client, this, channel, userstate);
        const commands = new Set();
        const channelInfo = await getChannelInfo(client, channel);
        for (const [key, value] of client.commands.entries()) {
            if (Array.isArray(value.channels)) {
                if (value.channels.includes(channel)) {
                    if (
                        !value.isModOnly &&
                        !value.hideCommand &&
                        !value.devOnly &&
                        !client.channelInfoCache
                            .get(channel.slice(1))!
                            .disabledCommands.includes(key)
                    ) {
                        commands.add(`${channelInfo.prefix}${value.name}`);
                    }
                }
            }
        }
        return client.say(channel, `/me ${Array.from(commands).sort().join(", ")}`);
    }
} as Command;
