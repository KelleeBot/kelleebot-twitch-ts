import { Command } from "../../interfaces";
import { log, updateChannelsCache } from "../../utils";
import channelSchema from "../../models/channelSchema";

export default {
    name: "leave",
    category: "KelleeBot",
    channels: ["kelleebot"],
    async execute({ client, channel, userstate }) {
        const result = await channelSchema.findOneAndDelete({
            _id: userstate.username
        });
        if (!result) {
            return client.say(
                channel,
                `/me Hmmm... it seems like I haven't joined your channel yet, so I can't leave.`
            );
        }

        client
            .part(userstate.username)
            .then(() => {
                updateChannelsCache(userstate.username, false);
                return client.say(channel, "/me I have now left your channel.");
            })
            .catch((e) => {
                log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
                return client.say(
                    channel,
                    `/me An error occurred. Please try again.`
                );
            });
        return;
    }
} as Command;
