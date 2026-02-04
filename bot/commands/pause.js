const { SlashCommandBuilder } = require("discord.js");
const { useMainPlayer } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Jeda lagu yang sedang diputar"),
    async execute(interaction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guildId);

        if (!queue || !queue.node.isPlaying()) {
            return interaction.reply({
                content: "❌ **MioMusic:** Tidak ada musik yang sedang diputar!",
                flags: 64 // ephemeral
            });
        }

        if (queue.node.isPaused()) {
            return interaction.reply({
                content: "⏸️ **MioMusic:** Musik sudah dalam keadaan jeda.",
                flags: 64
            });
        }

        queue.node.setPaused(true);

        await interaction.reply({
            content: "⏸️ **MioMusic:** Musik dijeda. Gunakan `/resume` untuk melanjutkan."
        });
    }
};
