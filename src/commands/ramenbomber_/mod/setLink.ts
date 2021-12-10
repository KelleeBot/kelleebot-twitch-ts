import { Command } from "../../../interfaces";
import { setLink, log, errorMessage } from "../../../utils";

export default {
    name: "setlink",
    aliases: ["setcode", "setroom", "setroomcode"],
    category: "Moderation/ramenbomber_",
    channels: ["ramenbomber_"],
    isModOnly: true,
    arguments: [
        {
            type: "STRING",
            prompt: "Please specify a code."
        }
    ],
    async execute({ client, channel, args, userstate }) {
        const text = args.join(" ");
        try {
            await setLink(channel.slice(1), userstate, text);
            return client.say(channel, `/me The room code has been updated.`);
        } catch (e) {
            log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
            return errorMessage(client, channel);
        }
    }
} as Command;
