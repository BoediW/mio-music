const { REST, Routes } = require("discord.js");
const logger = require("../utils/logger");

module.exports = {
    name: "clientReady",
    once: true,
    async execute(client) {
        logger.log(`MioMusic is ready as ${client.user.tag}`);

        const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
        const commands = client.commands.map(cmd => cmd.data.toJSON());

        try {
            logger.log("Registering global commands...");
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands }
            );
            logger.log("Successfully registered global commands.");
        } catch (error) {
            logger.error(error);
        }
    }
};
