import { Command } from "../../interfaces";
import { setCooldown } from "../../utils";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import advanced from "dayjs/plugin/advancedFormat";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);

export default {
    name: "gamenight",
    category: "mackthevoid",
    channels: ["mackthevoid"],
    cooldown: 15,
    execute({ client, channel, userstate }) {
        setCooldown(client, this, channel, userstate);
        const timezone = dayjs().tz("America/Denver").format("z");
        return client.say(
            channel,
            `/me Game night every Saturday at 8 ${timezone}, featuring these lovely folks, give them a follow! J: https://www.twitch.tv/jkirstyn/ Krisy: https://www.twitch.tv/krisypaulinee/ Austin: https://www.twitch.tv/sanctionxv/ Claire: https://www.twitch.tv/bearyclairey`
        );
    }
} as Command;
