import fetch from "node-fetch";
import { Command } from "../../interfaces";
import { setCooldown } from "../../utils";
import stringSimilarity from "string-similarity";

const villagers: string[] = [];

export default {
    name: "villager",
    category: "Animal Crossing",
    cooldown: 15,
    channels: ["#jkirstyn", "#krisypaulinee", "#bearyclairey"],
    arguments: [
        {
            type: "STRING",
            prompt: "Please provide a villager name."
        }
    ],
    async execute({ client, channel, userstate, args }) {
        let query = args.join(" ");
        if (query.includes(" ")) {
            query = query.replace(/ +g/, "_");
        }

        setCooldown(client, this, channel, userstate);
        const data = await fetchVillagerName(query);
        if (!data.length) {
            const matches = stringSimilarity.findBestMatch(query, await fetchAllVillagerNames());
            const options = matches.ratings
                .filter((v) => v.rating >= 0.3)
                .sort((a, b) => b.rating - a.rating)
                .slice(0, Math.min(5, matches.ratings.length));

            if (!options.length)
                return client.say(channel, `/me I couldn't find that villager kellee1Cry`);

            const { bestMatch } = matches;
            return client.say(
                channel,
                `/me I could not find a villager with that name. Maybe you meant ${bestMatch.target}?`
            );
        }

        const { name, personality, species, phrase, url } = data[0];
        return client.say(
            channel,
            `/me ${name} is a ${personality.toLowerCase()} ${species.toLowerCase()}, ${phrase}! More info: ${url}`
        );
    }
} as Command;

const fetchAllVillagerNames = async () => {
    if (villagers.length) return villagers;

    const resp = await fetch("https://api.nookipedia.com/villagers", {
        method: "GET",
        headers: {
            "X-API-KEY": `${process.env.NOOK_API_KEY}`,
            "Accept-Version": "2.0.0"
        }
    });
    const data = await resp.json();
    for (let i = 0; i < data.length; i++) {
        villagers.push(data[i].name);
    }
    return villagers;
};

const fetchVillagerName = async (name: string) => {
    const resp = await fetch(
        `https://api.nookipedia.com/villagers?name=${encodeURIComponent(
            name.toLowerCase()
        )}&nhdetails=true`,
        {
            method: "GET",
            headers: {
                "X-API-KEY": `${process.env.NOOK_API_KEY}`,
                "Accept-Version": "2.0.0"
            }
        }
    );
    return await resp.json();
};
