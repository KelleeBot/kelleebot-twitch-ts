import { Command } from "../../interfaces";
import { setCooldown } from "../../utils";

export default {
    name: "emotes",
    category: "mackthevoid",
    channels: ["mackthevoid"],
    cooldown: 15,
    execute({ client, channel, userstate }) {
        setCooldown(client, this, channel, userstate);
        return client.say(
            channel,
            `/me You like these emotes? mackth2Fngrgun mackth2PillowTime mackth2Love Those stellar sub badges? Look! It's bearyclairey at https://www.twitch.tv/bearyclairey!!! She is the amazing artist who made them so be sure to say thanks by showing your support!`
        );
    }
} as Command;
