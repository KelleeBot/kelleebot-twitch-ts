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
    name: "time",
    category: "mackthevoid",
    channels: ["#mackthevoid"],
    cooldown: 15,
    execute({ client, channel, userstate }) {
        setCooldown(client, this, channel, userstate);
        const time = dayjs().tz("America_Denver").format("DD/MM/YYYY h:mm:ss A z");
        return client.say(channel, `/me MacK's current time is ${time}.`);
    }
} as Command;
