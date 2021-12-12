import { Command } from "../../interfaces";
import { setCooldown } from "../../utils";

export default {
    name: "fc",
    aliases: ["friendcode"],
    category: "ramenbomber_",
    channels: ["#ramenbomber_"],
    cooldown: 15,
    execute({ client, channel, userstate }) {
        setCooldown(client, this, channel, userstate);
        return client.say(channel, `/me SW-7337-4574-0022`);
    }
} as Command;
