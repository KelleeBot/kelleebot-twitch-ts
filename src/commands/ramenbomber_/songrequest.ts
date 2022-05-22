import { Command } from "../../interfaces";
import { setCooldown } from "../../utils";

export default {
    name: "songrequest",
    aliases: ["sr"],
    category: "ramenbomber_",
    channels: ["#ramenbomber_"],
    cooldown: 15,
    execute({ client, channel, userstate }) {
        setCooldown(client, this, channel, userstate);
        return client.say(
            channel,
            "/me HOW TO REQUEST A SONG: Go to https://bsaber.com/ and search for a song. Click on the Twitch icon next to the song and copy and paste the code into chat. Your song will automatically be entered into the queue!"
        );
    }
} as Command;
