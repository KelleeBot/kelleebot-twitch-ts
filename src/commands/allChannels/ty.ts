import { Command } from "../../interfaces";
import { COMPLIMENTS } from "../../config/compliments.json";
import { setCooldown } from "../../utils";

export default {
  name: "comp",
  category: "All",
  channels: "all",
  cooldown: 15,
  execute({ client, channel, args, userstate }) {
    setCooldown(client, this, channel, userstate);
    let compliments = COMPLIMENTS.random();
    if (!args.length)
      return client.say(
        channel,
        `/me ${compliments.replace(
          /<user>/g,
          userstate["display-name"]!
        )} KPOPheart`
      );

    const user = args[0].startsWith("@") ? args[0].replace("@", "") : args[0];
    if (user.toLowerCase() === `${process.env.BOT_USERNAME?.toLowerCase()}`) {
      return client.say(
        channel,
        `/me You better thank me. It's a lot of work being a bot on here.`
      );
    }
    return client.say(
      channel,
      `/me ${compliments.replace(/<user>/g, user)} KPOPheart`
    );
  }
} as Command;
