import { Command } from "../../../interfaces";
import { setArenaIDAndPass, log, getChannelInfo, errorMessage } from "../../../utils";

export default {
    name: "setarena",
    category: "Moderation/ramenbomber_",
    channels: ["#ramenbomber_"],
    isModOnly: true,
    arguments: [
        {
            type: "STRING",
            prompt: "Please specify an arena ID."
        },
        {
            type: "STRING",
            prompt: "Please specify a password."
        }
    ],
    async execute({ client, channel, args, userstate }) {
        const channelInfo = await getChannelInfo(client, channel);

        if (args.length < 2) {
            return client.say(channel, `/me Usage: ${channelInfo.prefix}setarena <ID> <Password>`);
        }

        const arenaID = args[0];
        const arenaPass = args[1];
        try {
            await setArenaIDAndPass(channel.slice(1), userstate, arenaID, arenaPass);
            return client.say(channel, `/me The Arena ID and Password have been updated.`);
        } catch (e) {
            log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
            return errorMessage(client, channel);
        }
    }
} as Command;
