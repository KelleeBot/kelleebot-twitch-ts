import { Command } from "../../../interfaces";
import { log } from "../../../utils";
import shoutouts from "../../../config/shoutouts.json";
import fetch from "node-fetch";

export default {
    name: "so",
    aliases: ["shoutout"],
    category: "Mod",
    channels: ["#ramenbomber_", "#7squish", "#mackthevoid", "#bearyclairey", "#jkirstyn"],
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

        const game = (
            await fetch(
                `https://beta.decapi.me/twitch/game${encodeURIComponent(userToSO.toLowerCase())}`
            )
        )
            .then((r: Response) => r.text())
            .catch((e: Error) => log("ERROR", `${__filename}`, `An error has occurred: ${e}`));
        if (!game || typeof game === "undefined") {
            return client.say(
                channel,
                `/me ${userToSO} doesn't stream :( but you should go give them a follow anyways! https://www.twitch.tv/${userToSO}`
            );
        }

        if (game.toLowerCase().includes("no user") || game.toLowerCase() === "404 page not found") {
            return client.say(channel, `/me I couldn't find that user kellee1Cry`);
        }

        //@ts-ignore
        let shoutout = shoutouts[channel.slice(1).toLowerCase()];
        shoutout = shoutout.replace(/<USER>/g, userToSO).replace(/<GAME>/g, game);
        return client.say(channel, `/me ${shoutout}`);
    }
} as Command;
