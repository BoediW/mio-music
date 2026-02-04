const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useMainPlayer, QueueRepeatMode } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Atur mode loop untuk lagu atau antrean")
        .addStringOption(option =>
            option.setName("mode")
                .setDescription("Mode loop")
                .setRequired(true)
                .addChoices(
                    { name: "🔂 Track - Ulang lagu ini", value: "track" },
                    { name: "🔁 Queue - Ulang semua antrean", value: "queue" },
                    { name: "➡️ Off - Matikan loop", value: "off" }
                )),
    async execute(interaction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guildId);

        if (!queue || !queue.node.isPlaying()) {
            return interaction.reply({
                content: "❌ **MioMusic:** Tidak ada musik yang sedang diputar!",
                ephemeral: true
            });
        }

        const mode = interaction.options.getString("mode");
        let repeatMode;
        let modeText;

        switch (mode) {
            case "track":
                repeatMode = QueueRepeatMode.TRACK;
                modeText = "🔂 **Loop Track** - Lagu ini akan diulang terus-menerus.";
                break;
            case "queue":
                repeatMode = QueueRepeatMode.QUEUE;
                modeText = "🔁 **Loop Queue** - Semua antrean akan diulang.";
                break;
            case "off":
            default:
                repeatMode = QueueRepeatMode.OFF;
                modeText = "➡️ **Loop Off** - Mode loop dimatikan.";
                break;
        }

        queue.setRepeatMode(repeatMode);

        const embed = new EmbedBuilder()
            .setAuthor({ name: "MioMusic", iconURL: interaction.client.user.displayAvatarURL() })
            .setDescription(modeText)
            .setColor(interaction.client.config.color);

        await interaction.reply({ embeds: [embed] });
    }
};
