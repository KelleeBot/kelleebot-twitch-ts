import { Command } from "../../interfaces";
import { getArenaIDAndPass, log, setCooldown, errorMessage } from "../../utils";

export default {
    name: "arena",
    category: "ramenbomber_",
    channels: ["ramenbomber_"],
    cooldown: 15,
    async execute({ client, channel, userstate }) {
        setCooldown(client, this, channel, userstate);
        try {
            const result = await getArenaIDAndPass(channel.slice(1));
            if (!result) {
                return client.say(
                    channel,
                    `/me No Arena ID and Password have been set yet.`
                );
            }

            const { arenaID, arenaPass } = result;
            return client.say(channel, `/me ID: ${arenaID} PW: ${arenaPass}`);
        } catch (e) {
            log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
            return errorMessage(client, channel);
        }
        return;
    }
} as Command;
