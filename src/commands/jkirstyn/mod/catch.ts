import { Command } from "../../../interfaces";
import pokemonSchema from "../../../models/pokemonSchema";
import { log } from "../../../utils";
import fetch from "node-fetch";

const pokeBalls = [
    "Master Ball",
    "Ultra Ball",
    "Great Ball",
    "Poke Ball",
    "Safari Ball",
    "Park Ball",
    "Sport Ball"
];

export default {
    name: "catch",
    aliases: ["redeempokemon"],
    category: "Moderation/jkirstyn",
    channels: ["jkirstyn"],
    cooldown: 15,
    isModOnly: true,
    arguments: [
        {
            type: "STRING",
            prompt: "Please specify a user."
        }
    ],
    async execute({ client, channel, args }) {
        const user = args[0].startsWith("@")
            ? args[0].replace("@", "").toLowerCase().trim()
            : args[0].toLowerCase().trim();
        const pokedexNum = Math.floor(Math.random() * 899);
        const pokeBall = pokeBalls.random();
        const pokemon = await getRandomPokemon(pokedexNum);

        const obj = {
            channel: channel.slice(1),
            user
        };

        await pokemonSchema.findOneAndUpdate(
            obj,
            {
                ...obj,
                $addToSet: {
                    pokemons: {
                        pokedexNum,
                        name: pokemon,
                        caughtWith: pokeBall,
                        caughtOn: new Date()
                    }
                }
            },
            { upsert: true }
        );

        const numPokemon = await pokemonSchema.findOne(obj);
        const { pokemons } = numPokemon;
        return client.say(
            channel,
            `/me ${user} has captured a ${pokemon} by using a ${pokeBall}! PridePog PridePog Hope you take good care of your Pokémon! 2020Rivalry You have now caught a total of ${
                pokemons.name.length
            } Pokémon${pokemons.name.length !== 1 ? "s" : ""}!`
        );
    }
} as Command;

const getRandomPokemon = async (pokedexNum: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            const body = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(
                    pokedexNum
                )}`
            );
            const result = await body.json();
            const pokemon = capFirstLetter(result.species.name);
            resolve(pokemon);
        } catch (e) {
            log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
            reject(e);
        }
    });
};
const capFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
