import { Command } from "../../../interfaces";
import { getAllFamousLinks } from "../../../utils";

export default {
    name: "addfamous",
    aliases: ["famous"],
    category: "Bot Owner",
    devOnly: true,
    channels: "all",
    arguments: [
        {
            type: "STRING",
            prompt: "The famous bot link to add."
        }
    ],
    async execute({ client, channel, args }) {
        const text = args.join(" ");
        const famousLinks = await getAllFamousLinks(client);

        if (famousLinks.includes(text.toLowerCase()))
            return client.say(channel, `/me Looks like that's already in the database.`);

        await client.DBFamousLinks.findByIdAndUpdate(
            "famousLinks",
            { $push: { famous: text.toLowerCase() } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        client.famousCache.push(text.toLowerCase());
        return client.say(channel, `/me You have added "${text}" to the famous links database.`);
    }
} as Command;
