import { Command } from "../../interfaces";
import { setCooldown } from "../../utils";

const raidMsg = {
    ramenbomber_: "ramenb2Pichumper The Ramen Rat Pack is here ramenb2Pichumper",
    mackthevoid:
        "mackth2PillowTime mackth2PillowTime mackth2PillowTime AHHH IT'S A RAID!!! mackth2Fngrgun mackth2Fngrgun mackth2Fngrgun STICK 'EM UP!!!mackth2PillowTime mackth2PillowTime mackth2PillowTime AHHH IT'S A RAID!!! mackth2Fngrgun mackth2Fngrgun mackth2Fngrgun STICK 'EM UP!!!"
} as { [key: string]: string };

export default {
    name: "raid",
    category: "Multiple",
    cooldown: 15,
    channels: ["#ramenbomber_", "#mackthevoid"],
    execute({ client, channel, userstate }) {
        setCooldown(client, this, channel, userstate);
        const channelName = channel.slice(1).toLowerCase();
        return client.say(channel, `/me ${raidMsg[channelName]}`);
    }
} as Command;
