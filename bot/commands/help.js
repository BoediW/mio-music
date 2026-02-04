const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Tampilkan daftar semua command MioMusic"),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: "MioMusic - Bantuan",
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setColor(interaction.client.config.color)
            .setDescription("Berikut adalah daftar semua command yang tersedia:")
            .addFields(
                {
                    name: "🎵 Musik",
                    value: [
                        "`/play <query>` - Putar lagu dari SoundCloud/Spotify",
                        "`/playlist <query>` - Putar playlist",
                        "`/pause` - Jeda lagu",
                        "`/resume` - Lanjutkan lagu",
                        "`/skip` - Lewati lagu",
                        "`/previous` - Lagu sebelumnya",
                        "`/stop` - Hentikan & keluar",
                    ].join("\n"),
                    inline: false
                },
                {
                    name: "📋 Antrean",
                    value: [
                        "`/queue` - Lihat antrean",
                        "`/clear` - Hapus antrean",
                        "`/shuffle` - Acak antrean",
                        "`/loop <mode>` - Atur mode loop",
                    ].join("\n"),
                    inline: false
                },
                {
                    name: "🔊 Pengaturan",
                    value: [
                        "`/volume <0-100>` - Atur volume",
                        "`/nowplaying` - Info lagu saat ini",
                    ].join("\n"),
                    inline: false
                },
                {
                    name: "ℹ️ Lainnya",
                    value: [
                        "`/ping` - Cek latensi bot",
                        "`/help` - Tampilkan bantuan ini",
                    ].join("\n"),
                    inline: false
                }
            )
            .setFooter({ text: "🎹 SoundCloud & Spotify | MioMusic Premium" })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
