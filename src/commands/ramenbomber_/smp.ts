import { Command } from "../../interfaces";
import { setCooldown } from "../../utils";

export default {
    name: "smp",
    category: "ramenbomber_",
    channels: ["ramenbomber_"],
    cooldown: 15,
    execute({ client, channel, userstate }) {
        setCooldown(client, this, channel, userstate);
        return client.say(
            channel,
            `/me SteaMPunk is a collaborative Minecraft Survival Multiplayer world featuring personalities and content creators from across Twitch and Tiktok. FEATURING: FweddyShow / DitzyFlama / evuhlunnn / jkirstyn / Keveloper / Krisypaulinee / Leaveit2Liz / RamenBomber / Salinios_  / Tsunderedragon / Zachdoesntfail / Zamsire`
        );
    }
} as Command;
