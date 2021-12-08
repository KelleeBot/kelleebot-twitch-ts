import { Command } from "../../interfaces";
import { setCooldown } from "../../utils";

const hugMsg = {
  ramenbomber_: "<from> gives <to> a big hug! PrideRise",
  mackthevoid:
    "<from> hugs <to> from 6 feet away! I love you (⊃｡•́‿•̀｡)⊃ you are doing great.",
  b0ss_99: "<from> gives <to> a big hug! PrideRise"
} as { [key: string]: string };

export default {
  name: "hug",
  category: "Multiple",
  cooldown: 15,
  channels: ["ramenbomber_", "mackthevoid", "b0ss_99"],
  arguments: [
    {
      type: "STRING",
      prompt: "I don't know who to hug BibleThump"
    }
  ],
  execute({ client, userstate, channel, args }) {
    setCooldown(client, this, channel, userstate);
    const channelName = channel.slice(1).toLowerCase();
    const userToHug = args[0].startsWith("@")
      ? args[0].replace("@", "").trim()
      : args[0].trim();

    const hug = hugMsg[channelName]
      .replace(/<from>/g, userstate["display-name"]!)
      .replace(/<to>/g, userToHug);
    return client.say(channel, `/me ${hug}`);
  }
} as Command;
