const { SlashCommandBuilder } = require("discord.js");
const { useMainPlayer } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Hapus semua lagu dari antrean"),
    async execute(interaction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guildId);

        if (!queue) {
            return interaction.reply({
                content: "❌ **MioMusic:** Tidak ada antrean musik!",
                flags: 64
            });
        }

        const trackCount = queue.tracks.size;
        queue.tracks.clear();

        await interaction.reply({
            content: `🗑️ **MioMusic:** Berhasil menghapus **${trackCount}** lagu dari antrean.`
        });
    }
};
