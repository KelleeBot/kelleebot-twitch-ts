import { Command } from "../../interfaces";
import { setCooldown } from "../../utils";

export default {
    name: "pc",
    aliases: ["podcast"],
    category: "mackthevoid",
    channels: ["mackthevoid"],
    cooldown: 15,
    execute({ client, channel, userstate }) {
        setCooldown(client, this, channel, userstate);
        return client.say(
            channel,
            `/me Please check out my podcast with @jkirstyn https://rezplz.sounder.fm/ Spotify: https://open.spotify.com/show/5eEd2tPX4ejcrIuahx2ySk?si=_Hi_9u0tQcSpMNxK5M7Sgg Apple Podcast: https://podcasts.apple.com/us/podcast/rezplz/id1534510832`
        );
    }
} as Command;
