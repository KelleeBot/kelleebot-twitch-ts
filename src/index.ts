import mongoose from "mongoose";
import { Client } from "./Client";
import { log, getAllChannels, registerCommands, registerEvents } from "./utils";
import "./interfaces/Prototype";
import * as dotenv from "dotenv";
dotenv.config();

(async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_PATH}`);
        log("SUCCESS", `${__filename}`, "Successfully connected to the database.");
    } catch (e) {
        log("ERROR", `${__filename}`, `Error connecting to database: ${e}`);
        process.exit(1);
    }

    try {
        const channels = await getAllChannels();
        const opts = {
            options: {
                debug: true
            },
            connection: {
                reconnect: true,
                secure: true,
                timeout: 180000,
                reconnectDecay: 1.4,
                reconnectInterval: 1000
            },
            identity: {
                username: `${process.env.BOT_USERNAME}`,
                password: `${process.env.OAUTH_TOKEN}`
            },
            channels //: ["iaraaron"]
        };

        const client = new Client(opts);
        await client.connect();

        client.commands = new Map();
        client.categories = new Map();
        client.channelInfoCache = new Map();

        client.channelCooldowns = new Map();
        client.globalCooldowns = new Map();

        await registerEvents(client, "../events");
        await registerCommands(client, "../commands");

        await client.loadAllVillagerNames();
    } catch (e) {
        log("ERROR", `${__filename}`, `An error has occurred: ${e}.`);
    }
    log(
        "SUCCESS",
        `${__filename}`,
        "Successfully loaded all commands, events, schemas, and connected to MongoDB."
    );
})();
