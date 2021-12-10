import { Command } from "../../interfaces";
import { setCooldown } from "../../utils";

export default {
    name: "superdab",
    category: "ramenbomber_",
    channels: ["ramenbomber_"],
    cooldown: 60,
    execute({ client, channel, userstate }) {
        setCooldown(client, this, channel, userstate);
        return client.say(
            channel,
            `/me Rules for Super Hot VR Dab Challenge: 1) After killing every enemy, you must immediately dab. 2) The dab can be at any speed but must be completed before attacking the next enemy. 3) In order to complete the challenge, the whole game while dabbing after beating every enemy.`
        );
    }
} as Command;
