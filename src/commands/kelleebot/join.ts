import { Command } from "../../interfaces";
import { log, updateChannelsCache } from "../../utils";
import channelSchema from "../../models/channelSchema";
import { prefix } from "../../config/config.json";

export default {
  name: "join",
  category: "KelleeBot",
  channels: ["kelleebot"],
  async execute({ client, channel, userstate }) {
    try {
      await new channelSchema({
        _id: userstate.username
      }).save();

      client
        .join(userstate.username)
        .then(() => {
          updateChannelsCache(userstate.username, true);
          return client.say(
            channel,
            `/me I have now joined your channel! My default command prefix is "${prefix}", however, this can easily be changed by doing the command "${prefix}prefix <New Prefix>".`
          );
        })
        .catch((e) => {
          log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
          return client.say(
            channel,
            `/me An error has occurred. Please try again.`
          );
        });
    } catch (e) {
      log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
      return client.say(
        channel,
        "/me Looks like I am already in your channel. No need for me to join it again."
      );
    }
    return;
  }
} as Command;
