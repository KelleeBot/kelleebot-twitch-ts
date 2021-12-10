import arenaSchema from "../../models/arenaSchema";
import { log } from "..";
import { Userstate } from "tmi.js";

const arenaCache = {} as {
    [key: string]: { arenaID: string; arenaPass: string };
};

export const getArenaIDAndPass = async (channelName: string) => {
    const cachedValue = arenaCache[`${channelName}`];
    if (cachedValue) {
        console.log("FETCHING FROM CACHE");
        return cachedValue;
    }

    console.log("FETCHING FROM DB");
    try {
        const result = await arenaSchema.findOne({ channelName });
        if (!result) return;

        const { arenaID, arenaPass } = result;
        arenaCache[`${channelName}`] = { arenaID, arenaPass };
        return result;
    } catch (e) {
        log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
    }
};

export const setArenaIDAndPass = async (
    channelName: string,
    userstate: Userstate,
    arenaID: string,
    arenaPass: string
) => {
    try {
        const result = await arenaSchema.findOneAndUpdate(
            { channelName },
            {
                $set: {
                    updatedBy: userstate.username,
                    arenaID,
                    arenaPass
                }
            },
            { upsert: true, new: true }
        );
        arenaCache[`${channelName}`] = {
            arenaID: result.arenaID,
            arenaPass: result.arenaPass
        };
        return result;
    } catch (e) {
        log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
    }
};
