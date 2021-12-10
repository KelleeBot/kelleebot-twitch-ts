import { model, Schema } from "mongoose";

const reqString = {
    type: String,
    required: true
};

const linkSchema = new Schema(
    {
        _id: String, //channelName
        updatedBy: reqString,
        link: reqString
    },
    {
        timestamps: true
    }
);

export default model("link", linkSchema);
