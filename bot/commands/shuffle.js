const { SlashCommandBuilder } = require("discord.js");
const { useMainPlayer } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Acak urutan antrean musik"),
    async execute(interaction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guildId);

        if (!queue || !queue.node.isPlaying()) {
            return interaction.reply({
                content: "❌ **MioMusic:** Tidak ada musik yang sedang diputar!",
                flags: 64
            });
        }

        if (queue.tracks.size < 2) {
            return interaction.reply({
                content: "❌ **MioMusic:** Tidak cukup lagu dalam antrean untuk diacak!",
                flags: 64
            });
        }

        queue.tracks.shuffle();

        await interaction.reply({
            content: `🔀 **MioMusic:** Antrean berhasil diacak! (${queue.tracks.size} lagu)`
        });
    }
};
