import { Command } from "../../../interfaces";
import { log, errorMessage, getChannelInfo, getCurrentGame } from "../../../utils";

export default {
    name: "d+",
    aliases: ["death"],
    category: "Mod",
    channels: ["#ramenbomber_", "#redrawnegames", "#krisypaulinee"],
    isModOnly: true,
    //globalCooldown: true,
    //cooldown: 15,
    async execute({ client, channel }) {
        try {
            const channelName = channel.slice(1);
            let channelInfo = await getChannelInfo(client, channel);
            const game = (await getCurrentGame(channelName).catch((e) =>
                log("ERROR", `${__filename}`, `An error has occurred: ${e}`)
            )) as String;
            if (!game)
                return client.say(channel, `/me There is no game category set for this channel.`);

            channelInfo = await client.DBChannel.findByIdAndUpdate(
                { _id: channelName },
                { $inc: { [`deathCounter.${game}`]: 1 } },
                { upsert: true, new: true }
            );

            client.channelInfoCache.set(channelName, channelInfo!);
            const deathCounter = channelInfo?.deathCounter?.[`${game}`];
            return client.say(
                channel,
                `/me Oh no, not another death in "${game}" BibleThump. They have now died a total of ${deathCounter} time${deathCounter !== 1 ? "s" : ""
                }.`
            );
        } catch (e) {
            log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
            return errorMessage(client, channel);
        }
    }
} as Command;
