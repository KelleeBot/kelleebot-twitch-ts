export interface ChannelInfo {
    /** The channel name */
    _id: string;

    prefix: string;

    /** Array with all disabled command names */
    disabledCommands: string[];

    /** Contains all the custom command permissions for a command */
    commandPerms?: { [name: string]: string[] };

    /** Contains all custom role cooldowns for a command */
    commandCooldowns?: {
        [nameOfTheCommand: string]: { [id: string]: number };
    };

    commands?: string[];

    /** Contains all custom command aliases */
    commandAlias?: { [alias: string]: string };

    deathCounter?: { [game: string]: number };
}
