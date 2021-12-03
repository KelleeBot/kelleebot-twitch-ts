import { Command } from "../../../interfaces";
import { setCooldown } from "../../../utils";

export default {
  name: "botcolor",
  category: "Configuration",
  isModOnly: true,
  channels: "all",
  arguments: [
    {
      type: "STRING",
      prompt: "Please enter the new colour you want me to be changed to."
    }
  ],
  async execute({ client, channel, args, userstate }) {
    const color = args[0];
    const data = await client.color(args[0]);
    if (!data) {
      return client.say(
        channel,
        "/me Color must be in hex (#000000) or one of the following: Blue, BlueViolet, CadetBlue, Chocolate, Coral, DodgerBlue, Firebrick, GoldenRod, Green, HotPink, OrangeRed, Red, SeaGreen, SpringGreen, YellowGreen."
      );
    }
    setCooldown(client, this, channel, userstate);
    return client.say(channel, `/me My color has been changed to ${color}`);
  }
} as Command;
