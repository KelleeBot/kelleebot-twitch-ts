import { Command } from "../../interfaces";
import fetch from "node-fetch";
import { log, replaceChars, errorMessage } from "../../utils";

export default {
  name: "followage",
  category: "Multple",
  cooldown: 15,
  channels: ["jkirstyn", "ramenbomber_", "mackthevoid"],
  async execute({ client, channel, userstate }) {
    const data = (
      await fetch(
        `https://beta.decapi.me/twitch/followage/${encodeURIComponent(
          channel.slice(1)
        )}/${encodeURIComponent(userstate.username)}?precision=7`
      )
    )
      .then((r: Response) => r.text())
      .catch((e: Error) =>
        log("ERROR", `${__filename}`, `An error has occurred: ${e}`)
      );
    if (!data) {
      return errorMessage(client, channel);
    }

    if (replaceChars(data) === "a user cannot follow themself") {
      return client.say(channel, `/me ${data}`);
    }

    if (replaceChars(data).includes("does not follow")) {
      return client.say(channel, `/me ${data}`);
    }

    return client.say(
      channel,
      `/me ${userstate["display-name"]} has been following ${channel.slice(
        1
      )} for ${data}.`
    );
  }
} as Command;
