import TMI from "tmi.js";
import { ChannelInfo, Command, UserInfo } from "./interfaces";
import { Model } from "mongoose";

export declare class Client extends TMI.Client {
    public commands: Map<string, Command>;
    public categories: Map<string, string[]>;
    public channelInfoCache: Map<string, ChannelInfo>;
    public blacklistCache: Set<string>;
    public DBChannel: Model<ChannelInfo>;
    public DBUser: Model<UserInfo>;
    public DBBlacklist: Model<object>;
    public channelCooldowns: Map<string, Map<string, Map<string, number>>>;
    public globalCooldowns: Map<string, Map<string, number>>;
}
