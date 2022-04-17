import axios from "axios";
import { Command } from "../../interfaces";
import { setCooldown } from "../../utils";
import stringSimilarity from "string-similarity";

let villagers: string[] = [];

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
        let query = args.join(" ").toLowerCase().trim();
        if (query.includes(" ")) {
            query = query.replace(/ +g/, "_");
        }

        const data = await fetchVillagerName(query);
        if (!data.length) {
            const matches = stringSimilarity.findBestMatch(query, client.villagers);
            const options = matches.ratings
                .filter((v) => v.rating >= 0.3)
                .sort((a, b) => b.rating - a.rating)
                .slice(0, Math.min(5, matches.ratings.length));

            if (!options.length)
                return client.say(channel, `/me I couldn't find that villager kellee1Cry`);

            const { bestMatch } = matches;
            return client.say(
                channel,
                `/me I could not find a villager with that name. Maybe you meant ${bestMatch.target.replace(
                    /\b(\w)/g,
                    (char) => char.toUpperCase()
                )}?`
            );
        }

        setCooldown(client, this, channel, userstate);
        const { name, personality, species, phrase, url } = data[0];
        return client.say(
            channel,
            `/me ${name} is a ${personality.toLowerCase()} ${species.toLowerCase()}, ${phrase}! More info: ${url}`
        );
    }
} as Command;

const fetchVillagerName = async (name: string) => {
    const resp = await axios.get(
        `https://api.nookipedia.com/villagers?name=${encodeURIComponent(
            name.toLowerCase()
        )}&nhdetails=true`,
        {
            headers: {
                "X-API-KEY": `${process.env.NOOK_API_KEY}`,
                "Accept-Version": "2.0.0"
            }
        }
    );
    return resp.data;
};
