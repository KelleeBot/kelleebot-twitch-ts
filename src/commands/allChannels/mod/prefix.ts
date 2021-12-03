import { Command } from "../../../interfaces";
import { getChannelInfo, setCooldown } from "../../../utils";

export default {
    name: "prefix",
    aliases: ["setprefix"],
    category: "Configuration",
    isModOnly: true,
    channels: "all",
    cooldown: 15,
    arguments: [
        {
            type: "STRING",
            prompt: "Please enter the new prefix you want to set."
        }
    ],
    async execute({ client, channel, userstate, args }) {
        const channelInfo = await getChannelInfo(client, channel);

        if (args[0] === "/" || args[0] === ".") {
            return client.say(
                channel,
                `/me Cannot set command prefix to "${args[0]}" as this will conflict with Twitch commands.`
            );
        }

        if (channelInfo.prefix.toLowerCase() === args[0].toLowerCase()) {
            return client.say(
                channel,
                `/me My prefix is already "${args[0]}". Please try a new one.`
            );
        }

        setCooldown(client, this, channel, userstate);
        await client.DBChannel.findByIdAndUpdate(
            channel.slice(1),
            { $set: { prefix: args[0].toLowerCase() } },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }
        );

        channelInfo.prefix = args[0].toLowerCase();
        client.channelInfoCache.set(channel.slice(1), channelInfo);
        return client.say(
            channel,
            `/me The new prefix has been successfully set to "${channelInfo.prefix}"`
        );
    }
} as Command;
