import linkSchema from "../../models/linkSchema";
import { log } from "..";
import { Userstate } from "tmi.js";

const linkCache = {} as { [key: string]: { link: string } };

export const getLink = async (channelName: string) => {
    const cachedValue = linkCache[`${channelName}`];
    if (cachedValue) {
        console.log("FETCHING FROM CACHE");
        return cachedValue;
    }

    console.log("FETCHING FROM DB");
    try {
        const result = await linkSchema.findOne({
            _id: channelName
        });
        if (!result) {
            return;
        }

        const { link } = result;
        linkCache[`${channelName}`] = { link };
        return result;
    } catch (e) {
        log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
    }
};

export const setLink = async (
    channelName: string,
    userstate: Userstate,
    link: string
) => {
    try {
        const result = await linkSchema.findByIdAndUpdate(
            { _id: channelName },
            {
                $set: {
                    updatedBy: userstate.username,
                    link
                }
            },
            { upsert: true, new: true }
        );
        linkCache[`${channelName}`] = {
            link: result.link
        };
        return result;
    } catch (e) {
        log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
    }
};
