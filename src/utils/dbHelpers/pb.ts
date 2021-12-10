import pbSchema from "../../models/pbSchema";
import { log } from "..";

const pbCache = {} as {
    [key: string]: { pb: string; game: string; updatedAt: Date };
};

export const getPB = async (channelName: string, currentGame: string) => {
    const cachedValue = pbCache[`${channelName}-${currentGame}`];
    if (cachedValue) {
        console.log("FETCHING FROM CACHE");
        return cachedValue;
    }

    console.log("FETCHING FROM DB");
    try {
        const result = await pbSchema.findOne({
            channelName,
            game: currentGame
        });
        console.log(result);
        if (!result) {
            return;
        }

        const { pb, game, updatedAt } = result;
        pbCache[`${channelName}-${game}`] = { pb, game, updatedAt };
        return result;
    } catch (e) {
        log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
    }
};

export const setPB = async (channelName: string, pb: string, game: string) => {
    try {
        const result = await pbSchema.findOneAndUpdate(
            { channelName, game },
            {
                $set: {
                    pb,
                    game
                }
            },
            { upsert: true, new: true }
        );
        pbCache[`${channelName}-${game}`] = {
            pb: result.pb,
            game: result.game,
            updatedAt: result.updatedAt
        };
        return result;
    } catch (e) {
        log("ERROR", `${__filename}`, `An error has occurred: ${e}`);
    }
};
