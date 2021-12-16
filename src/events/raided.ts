import { Client } from "tmi.js";
import { getCurrentGame } from "../utils";
import shoutouts from "../config/shoutouts.json";

const autoShoutoutChannels = ["mackthevoid", "ramenbomber_", "jkirstyn"];

export default async (client: Client, channel: string, username: string, viewers: number) => {
    const channelName = channel.slice(1).toLowerCase();

    if (autoShoutoutChannels.includes(channelName)) {
        client.say(
            channel,
            `/me Incoming raid! Thank you @${username} for raiding the channel with ${viewers} viewer${
                viewers !== 1 ? "s" : ""
            }! Welcome raiders!`
        );

        const game = await getCurrentGame(username);
        //@ts-ignore
        let shoutout = shoutouts[channelName];
        shoutout = shoutout.replace(/<USER>/g, username).replace(/<GAME>/g, game);
        setTimeout(() => client.say(channel, `/me ${shoutout}`), 1000 * 5);
    }
};
