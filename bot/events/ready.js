const { REST, Routes } = require("discord.js");
const logger = require("../utils/logger");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        logger.log(`MioMusic is ready as ${client.user.tag}`);

        const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
        const commands = client.commands.map(cmd => cmd.data.toJSON());

        try {
            // Clear global commands first (to prevent duplicates)
            logger.log("Clearing old global commands...");
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: [] }
            );

            // Register only as GUILD commands (instant, no duplicates)
            if (process.env.GUILD_ID) {
                logger.log(`Registering ${commands.length} commands...`);
                await rest.put(
                    Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID),
                    { body: commands }
                );
                logger.log(`✅ Registered ${commands.length} commands!`);
            } else {
                logger.error("GUILD_ID not set in .env!");
            }
        } catch (error) {
            logger.error("Failed to register commands:", error);
        }
    }
};
