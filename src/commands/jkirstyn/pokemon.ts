import { Command } from "../../interfaces";
import { log, setCooldown, errorMessage } from "../../utils";
import pokemonSchema from "../../models/pokemonSchema";

export default {
    name: "pokemon",
    category: "jkirstyn",
    cooldown: 15,
    channels: ["#jkirstyn"],
    async execute({ client, channel, userstate }) {
        const obj = {
            channel: channel.slice(1),
            user: userstate.username.toLowerCase()
        };

        try {
            const result = await pokemonSchema.find(obj);
            if (!result.length) {
                return client.say(
                    channel,
                    `/me ${userstate["display-name"]}, you have not caught any Pokémon's yet.`
                );
            }

            const total = result[0].pokemons.name.length;
            const pokemons = result[0].pokemons.name
                .map((m: string) => m)
                .slice(0, 5)
                .join(", ");

            return client.say(
                channel,
                `/me ${userstate["display-name"]}, you have caught a total of ${total} Pokémon${
                    total !== 1 ? "s" : ""
                }! Here is your Pokédex: ${pokemons}.`
            );
        } catch (e) {
            log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
            return errorMessage(client, channel);
        }
    }
} as Command;
