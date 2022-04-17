import { Command } from "../../../interfaces";
import { log, getCurrentGame } from "../../../utils";
import shoutouts from "../../../config/shoutouts.json";

export default {
    name: "so",
    aliases: ["shoutout"],
    category: "Mod",
    channels: [
        "#ramenbomber_",
        "#7squish",
        "#mackthevoid",
        "#bearyclairey",
        "#jkirstyn",
        "#b0ss_99"
    ],
    isModOnly: true,
    arguments: [
        {
            type: "STRING",
            prompt: "Please specify someone to shout out."
        }
    ],
    async execute({ client, channel, args }) {
        const userToSO = args[0].startsWith("@") ? args[0].replace("@", "") : args[0];

        if (userToSO.toLowerCase() === `${process.env.BOT_USERNAME?.toLocaleUpperCase()}`) {
            return client.say(
                channel,
                `/me Don't shout me out please. I don't like the attention.`
            );
        }

        try {
            const game = (await getCurrentGame(userToSO).catch((e) =>
                log("ERROR", `${__filename}`, `An error has occurred: ${e}`)
            )) as string;
            if (!game || !game.length || typeof game === "undefined") {
                return client.say(
                    channel,
                    `/me ${userToSO} doesn't stream :( but you should go give them a follow anyways! https://www.twitch.tv/${userToSO}`
                );
            }

            if (
                game.toLowerCase().includes("no user") ||
                game.toLowerCase().includes("not found")
            ) {
                return client.say(channel, `/me I couldn't find that user kellee1Cry`);
            }

            //@ts-ignore
            let shoutout = shoutouts[channel.slice(1).toLowerCase()];
            shoutout = shoutout.replace(/<USER>/g, userToSO).replace(/<GAME>/g, game);
            return client.say(channel, `/me ${shoutout}`);
        } catch (e) {
            log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
        }

        return;
    }
} as Command;
