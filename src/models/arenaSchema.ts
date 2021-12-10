import { model, Schema } from "mongoose";

const reqString = {
    type: String,
    required: true
};

const arenaSchema = new Schema(
    {
        channelName: reqString,
        updatedBy: reqString,
        arenaID: reqString,
        arenaPass: reqString
    },
    {
        timestamps: true
    }
);

export default model("ramen-arena-command", arenaSchema, "ramen-arena-command");
