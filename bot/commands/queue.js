const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Lihat daftar antrean lagu saat ini (MioMusic)"),
    async execute(interaction) {
        const queue = useQueue(interaction.guildId);

        if (!queue || !queue.currentTrack) {
            return interaction.reply({
                content: "❌ **MioMusic:** Tidak ada lagu yang sedang diputar!",
                ephemeral: true
            });
        }

        const tracks = queue.tracks.toArray();
        const currentTrack = queue.currentTrack;

        const embed = new EmbedBuilder()
            .setTitle(`📋 Antrean Musik - ${interaction.guild.name}`)
            .setColor(interaction.client.config.color)
            .setThumbnail(currentTrack.thumbnail)
            .addFields(
                { name: "🎵 Sedang Diputar", value: `[${currentTrack.title}](${currentTrack.url})` }
            )
            .setDescription(tracks.length ? tracks.slice(0, 10).map((t, i) => `**${i + 1}.** [${t.title}](${t.url}) - \`${t.duration}\``).join("\n") : "*Antrean kosong lainnya.*")
            .setFooter({ text: `Total lagu dalam antrean: ${tracks.length}` });

        return interaction.reply({ embeds: [embed] });
    }
};

