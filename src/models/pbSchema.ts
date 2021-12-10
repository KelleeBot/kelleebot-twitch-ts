import { model, Schema } from "mongoose";

const reqString = {
    type: String,
    required: true
};

const pbSchema = new Schema(
    {
        channelName: reqString,
        game: reqString,
        pb: reqString
    },
    {
        timestamps: true
    }
);

export default model("pb", pbSchema);
