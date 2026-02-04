const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Lihat daftar antrean lagu saat ini"),
    async execute(interaction) {
        const queue = useQueue(interaction.guildId);

        if (!queue || !queue.currentTrack) {
            return interaction.reply({
                content: "❌ **MioMusic:** Tidak ada lagu yang sedang diputar!",
                flags: 64
            });
        }

        const tracks = queue.tracks.toArray();
        const currentTrack = queue.currentTrack;

        // Loop mode text
        const loopModes = ["Off", "🔂 Track", "🔁 Queue"];
        const loopText = loopModes[queue.repeatMode] || "Off";

        // Build queue description
        let description = "";

        if (tracks.length > 0) {
            description = tracks.slice(0, 15).map((t, i) =>
                `**${i + 1}.** [${t.title}](${t.url}) - \`${t.duration}\``
            ).join("\n");

            if (tracks.length > 15) {
                description += `\n\n... dan **${tracks.length - 15}** lagu lainnya`;
            }
        } else {
            description = "*Tidak ada lagu lain dalam antrean.*\nGunakan `/play` atau `/playlist` untuk menambahkan lagu!";
        }

        const embed = new EmbedBuilder()
            .setTitle(`📋 Antrean Musik`)
            .setColor(interaction.client.config.color)
            .setThumbnail(currentTrack.thumbnail)
            .addFields(
                {
                    name: "🎵 Sedang Diputar",
                    value: `[${currentTrack.title}](${currentTrack.url})\n👤 ${currentTrack.author || "Unknown"} • ⏱️ ${currentTrack.duration}`,
                    inline: false
                },
                {
                    name: "📊 Status",
                    value: `🔊 Volume: ${queue.node.volume}% • 🔁 Loop: ${loopText}`,
                    inline: false
                }
            )
            .setDescription(tracks.length > 0 ? `**Up Next (${tracks.length} lagu):**\n${description}` : description)
            .setFooter({ text: `Total dalam antrean: ${tracks.length} lagu • Requested by ${interaction.user.username}` })
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};
