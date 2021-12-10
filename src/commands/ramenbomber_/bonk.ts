import { Command } from "../../interfaces";
import { setCooldown } from "../../utils";

const bonks = [
    "a shovel.",
    "a hammer.",
    "a bat.",
    "a pole.",
    "a trash can filled with empty Coca-Cola bottles Kappa",
    "a trash can.",
    "love kellee1Love"
];

export default {
    name: "bonk",
    category: "ramenbomber_",
    channels: ["#ramenbomber_"],
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

        if (userToBonk.toLowerCase() === "kellee") {
            return client.say(
                channel,
                `/me ${userstate["display-name"]} bonks Kellee with love kellee1Love`
            );
        }

        const bonk = bonks.random();
        return client.say(
            channel,
            `/me ${userstate["display-name"]} bonks ${userToBonk} with ${bonk}`
        );
    }
} as Command;
