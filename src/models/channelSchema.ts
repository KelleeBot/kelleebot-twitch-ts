import { model, Schema } from "mongoose";

const channelSchema = new Schema({
    _id: String,
    prefix: {
        default: "!",
        type: String
    },
    disabledCommands: Array,
    commands: Array,
    commandPerms: {},
    commandCooldowns: {},
    commandAlias: {},
    deathCounter: {}
});

export default model("twitch-channels-schema", channelSchema, "twitch-channels-schema");
