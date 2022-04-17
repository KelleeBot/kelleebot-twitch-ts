import { Command } from "../../interfaces";
import { setCooldown } from "../../utils";

export default {
    name: "bonk",
    category: "Multiple",
    channels: ["#ramenbomber_", "#krisypaulinee"],
    cooldown: 15,
    arguments: [
        {
            type: "STRING",
            prompt: "Who should I bonk today?"
        }
    ],
    execute({ client, channel, userstate, args }) {
        setCooldown(client, this, channel, userstate);
        const userToBonk = args[0].startsWith("@")
            ? args[0].replace("@", "").trim()
            : args[0].trim();

        if (userToBonk.toLowerCase() === `${process.env.BOT_USERNAME?.toLowerCase()}`) {
            return client.say(
                channel,
                `/me Nuh uh uh, nice try, but you can't bonk me cause I'll bonk you instead BOP BOP BOP`
            );
        }

        if (channel.toLowerCase() === "ramenbomber_") {
            const ramenBonks = [
                "a shovel.",
                "a hammer.",
                "a bat.",
                "a pole.",
                "a trash can filled with empty Coca-Cola bottles Kappa",
                "a trash can.",
                "love kellee1Love"
            ];

            if (userToBonk.toLowerCase() === "kellee") {
                return client.say(
                    channel,
                    `/me ${userstate["display-name"]} bonks Kellee with love kellee1Love`
                );
            }

            const bonk = ramenBonks.random();
            return client.say(
                channel,
                `/me ${userstate["display-name"]} bonks ${userToBonk} with ${bonk}`
            );
        } else {
            //if (channel.toLowerCase() === "krisypaulinee") {
            const krisyBonks = ["a hammer", "a shovel", "a pokeball", "love"];
            const extra = ["super effective", "a critical hit", "missed"];

            const bonk = krisyBonks.random();
            const extraText = extra.random();
            const text = `${userstate["display-name"]} bonks ${userToBonk} with ${bonk}. It was ${extraText}!`;
            return client.say(channel, `/me ${text}`);
        }
    }
} as Command;
