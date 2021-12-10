import { Command } from "../../interfaces";
import { setCooldown } from "../../utils";

export default {
    name: "tiktok",
    category: "ramenbomber_",
    channels: ["ramenbomber_"],
    cooldown: 15,
    execute({ client, channel, userstate }) {
        setCooldown(client, this, channel, userstate);
        return client.say(
            channel,
            `/me Heyo! Please follow me on Tik Tok https://vm.tiktok.com/ZM8MxjXos/`
        );
    }
} as Command;
