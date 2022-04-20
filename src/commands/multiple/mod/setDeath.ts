import { Command } from "../../../interfaces";
import { log, errorMessage, getChannelInfo, getCurrentGame } from "../../../utils";

export default {
    name: "setdeath",
    category: "Mod",
    channels: ["#ramenbomber_", "#redrawnegames", "#krisypaulinee"],
    isModOnly: true,
    // globalCooldown: true,
    // cooldown: 15,
    arguments: [
        {
            type: "NUMBER",
            prompt: "Please specify the amount of deaths to set.",
            min: 0,
            toInteger: true
        }
    ],
    async execute({ client, channel, args }) {
        try {
            const channelName = channel.slice(1);
            const deaths = args[0];

            if (isNaN(+deaths) || Number.isInteger(deaths))
                return client.say(channel, `/me Please specify a valid number.`);

            let channelInfo = await getChannelInfo(client, channel);
            const game = (await getCurrentGame(channelName).catch((e) =>
                log("ERROR", `${__filename}`, `An error has occurred: ${e}`)
            )) as String;
            if (!game)
                return client.say(channel, `/me There is no game category set for this channel.`);

            channelInfo = await client.DBChannel.findByIdAndUpdate(
                { _id: channelName },
                { $set: { [`deathCounter.${game}`]: +deaths } },
                { upsert: true, new: true }
            );

            client.channelInfoCache.set(channelName, channelInfo!);
            return client.say(
                channel,
                `/me The death counter for "${game}" has been set to ${args[0]}.`
            );
        } catch (e) {
            log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
            return errorMessage(client, channel);
        }
    }
} as Command;
