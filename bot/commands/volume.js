const { SlashCommandBuilder } = require("discord.js");
const { useMainPlayer } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Atur volume musik")
        .addIntegerOption(option =>
            option.setName("level")
                .setDescription("Level volume (0-100)")
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(100)),
    async execute(interaction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guildId);

        if (!queue || !queue.node.isPlaying()) {
            return interaction.reply({
                content: "❌ **MioMusic:** Tidak ada musik yang sedang diputar!",
                flags: 64
            });
        }

        const volume = interaction.options.getInteger("level");
        queue.node.setVolume(volume);

        // Volume emoji based on level
        let emoji = "🔇";
        if (volume > 0 && volume <= 30) emoji = "🔈";
        else if (volume > 30 && volume <= 70) emoji = "🔉";
        else if (volume > 70) emoji = "🔊";

        await interaction.reply({
            content: `${emoji} **MioMusic:** Volume diatur ke **${volume}%**`
        });
    }
};
