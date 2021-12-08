import { Command } from "../../interfaces";
import { setCooldown, log, errorMessage } from "../../utils";
import fetch from "node-fetch";

export default {
  name: "uptime",
  category: "Multiple",
  cooldown: 15,
  channels: ["ramenbomber_", "mackthevoid"],
  async execute({ client, channel, userstate }) {
    setCooldown(client, this, channel, userstate);
    const data = (
      await fetch(
        `https://beta.decapi.me/twitch/uptime/${encodeURIComponent(
          channel.slice(1)
        )}`
      )
    )
      .then((r: Response) => r.text())
      .catch((e: Error) => {
        log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
      });

    if (!data) return errorMessage(client, channel);

    if (data.toLowerCase().includes("offline"))
      return client.say(channel, `/me ${data}`);

    return client.say(
      channel,
      `/me ${channel.slice(1)} has been live for ${data}.`
    );
  }
} as Command;
