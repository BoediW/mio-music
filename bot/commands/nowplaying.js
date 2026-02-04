const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("Lihat lagu yang sedang diputar saat ini (MioMusic)"),
    async execute(interaction) {
        const queue = useQueue(interaction.guildId);

        if (!queue || !queue.currentTrack) {
            return interaction.reply({ content: "❌ **MioMusic:** Tidak ada lagu yang sedang diputar!", ephemeral: true });
        }

        const track = queue.currentTrack;
        const progress = queue.node.createProgressBar();

        const embed = new EmbedBuilder()
            .setAuthor({ name: "Sedang Diputar", iconURL: interaction.client.user.displayAvatarURL() })
            .setTitle(track.title)
            .setURL(track.url)
            .setThumbnail(track.thumbnail)
            .setColor(interaction.client.config.color)
            .addFields(
                { name: "Artis", value: track.author, inline: true },
                { name: "Durasi", value: track.duration, inline: true },
                { name: "Progres", value: `\`${progress}\`` }
            )
            .setFooter({ text: `Diminta oleh: ${track.requestedBy.username}` });

        return interaction.reply({ embeds: [embed] });
    }
};
