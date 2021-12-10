import { Command } from "../../interfaces";
import { getPB, log, setCooldown, errorMessage, getCurrentGame } from "../../utils";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import advanced from "dayjs/plugin/advancedFormat";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);

export default {
    name: "pb",
    category: "ramenbomber_",
    channels: ["#ramenbomber_"],
    cooldown: 15,
    async execute({ client, channel, userstate }) {
        setCooldown(client, this, channel, userstate);
        try {
            const currentGame = (await getCurrentGame(channel)) as string;
            const result = await getPB(channel.slice(1).toLowerCase(), currentGame);
            if (!result) {
                return client.say(channel, `/me No PB for "${currentGame}" has been set yet.`);
            }

            const { pb, game, updatedAt } = result;
            const time = dayjs().tz("America/New_York").format("EEE, MMM d, yyyy h:mm a zzz");
            const text = `Your PB for game "${game}" is ${pb} which was achieved on ${time}.`;
            return client.say(channel, `/me ${text}`);
        } catch (e) {
            log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
            return errorMessage(client, channel);
        }
    }
} as Command;
