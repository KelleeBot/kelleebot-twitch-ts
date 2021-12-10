import { Client, Userstate } from "tmi.js";

export default async (
    client: Client,
    channel: string,
    username: string,
    streakMonths: number,
    recipient: string,
    methods: object,
    userstate: Userstate
) => {
    if (
        userstate["msg-param-recipient-display-name"].toLowerCase() ===
        `${process.env.BOT_USERNAME?.toLowerCase()}`
    ) {
        client.say(
            channel,
            `/me Thank you @${username} for gifting a sub to me. I really appreciate it. ${getChannelEmote(
                channel
            )} ${getChannelEmote(channel)}`
        );
        return;
    }
};

const getChannelEmote = (channel: string) => {
    let emote = "";
    switch (channel.slice(1).toLowerCase()) {
        case "krisypaulinee":
            emote = "krisypHeart";
            break;
        case "jkirstyn":
            emote = "jkirstLuv";
            break;
        case "mackthevoid":
            emote = "mackth2Love";
            break;
        case "ramenbomber_":
            emote = "ramenb2PichYOU";
            break;
        default:
            emote = "kellee1Love";
            break;
    }
    return emote;
};
