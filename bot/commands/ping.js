const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Cek latensi MioMusic"),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(interaction.client.config.color)
            .setTitle("🏓 Pong!")
            .addFields(
                { name: "Bot Latency", value: `\`${Math.round(interaction.client.ws.ping)}ms\``, inline: true },
                { name: "API Latency", value: `\`${Date.now() - interaction.createdTimestamp}ms\``, inline: true }
            )
            .setFooter({ text: "MioMusic Premium Speed" });

        return interaction.reply({ embeds: [embed] });
    }
};
