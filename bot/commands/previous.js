const { SlashCommandBuilder } = require("discord.js");
const { useMainPlayer } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("previous")
        .setDescription("Putar lagu sebelumnya"),
    async execute(interaction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guildId);

        if (!queue || !queue.node.isPlaying()) {
            return interaction.reply({
                content: "❌ **MioMusic:** Tidak ada musik yang sedang diputar!",
                flags: 64
            });
        }

        const history = queue.history;
        if (!history.tracks.size) {
            return interaction.reply({
                content: "❌ **MioMusic:** Tidak ada lagu sebelumnya dalam riwayat.",
                flags: 64
            });
        }

        await interaction.deferReply();

        try {
            await history.back();
            await interaction.editReply({
                content: "⏮️ **MioMusic:** Kembali ke lagu sebelumnya."
            });
        } catch (error) {
            await interaction.editReply({
                content: "❌ **MioMusic:** Gagal kembali ke lagu sebelumnya."
            });
        }
    }
};
