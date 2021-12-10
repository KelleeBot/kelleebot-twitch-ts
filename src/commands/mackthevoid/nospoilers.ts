import { Command } from "../../interfaces";
import { setCooldown } from "../../utils";

export default {
    name: "nospoilers",
    aliases: ["blind"],
    channels: ["mackthevoid"],
    cooldown: 15,
    execute({ client, channel, userstate }) {
        setCooldown(client, this, channel, userstate);
        return client.say(
            channel,
            `/me Hi, welcome in new friends! PridePog This is a blind playthrough, so please refrain from spoilers!! Thank you!! PrideRise`
        );
    }
} as Command;
