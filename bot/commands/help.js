const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Menampilkan daftar perintah MioMusic"),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("🎹 MioMusic Command List")
            .setDescription("Gunakan perintah slash di bawah ini untuk mengontrol MioMusic.")
            .setColor(interaction.client.config.color)
            .addFields(
                { name: "🎵 Musik", value: "`/play`, `/skip`, `/stop`, `/queue`, `/nowplaying`", inline: false },
                { name: "🛠️ System", value: "`/ping`, `/help`", inline: false }
            )
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setFooter({ text: "Terinspirasi oleh Jockie Music, Disempurnakan oleh Mio Global" });

        return interaction.reply({ embeds: [embed] });
    }
};
