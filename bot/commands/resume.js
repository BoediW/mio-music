const { SlashCommandBuilder } = require("discord.js");
const { useMainPlayer } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Lanjutkan lagu yang dijeda"),
    async execute(interaction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guildId);

        if (!queue) {
            return interaction.reply({
                content: "❌ **MioMusic:** Tidak ada musik dalam antrean!",
                flags: 64
            });
        }

        if (!queue.node.isPaused()) {
            return interaction.reply({
                content: "▶️ **MioMusic:** Musik sudah diputar.",
                flags: 64
            });
        }

        queue.node.setPaused(false);

        await interaction.reply({
            content: "▶️ **MioMusic:** Melanjutkan pemutaran musik!"
        });
    }
};
