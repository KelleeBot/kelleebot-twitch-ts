import { Command } from "../../../interfaces";
import { setPB, log, getCurrentGame, errorMessage } from "../../../utils";

export default {
    name: "setpb",
    category: "Moderation/ramenbomber_",
    channels: ["#ramenbomber_"],
    isModOnly: true,
    arguments: [
        {
            type: "STRING",
            prompt: "Please specify a PB time."
        }
    ],
    async execute({ client, channel, args }) {
        const text = args.join(" ");
        try {
            const game = (await getCurrentGame(channel)) as string;
            await setPB(channel.slice(1), text, game);
            return client.say(channel, `/me Your PB for "${game}" has been updated.`);
        } catch (e) {
            log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
            return errorMessage(client, channel);
        }
    }
} as Command;
