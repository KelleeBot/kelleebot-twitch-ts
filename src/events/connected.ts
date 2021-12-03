import { Client } from "tmi.js";
import { log } from "../utils";

export default async (_client: Client, address: string, port: string) => {
    log("SUCCESS", `${__filename}`, `Connected: ${address}:${port}`);
};
