const { SlashCommandBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Lewati lagu yang sedang diputar (MioMusic)"),
    async execute(interaction) {
        const queue = useQueue(interaction.guildId);

        if (!queue || !queue.currentTrack) {
            return interaction.reply({ content: "❌ **MioMusic:** Tidak ada lagu yang bisa dilewati!", ephemeral: true });
        }

        queue.node.skip();
        return interaction.reply("⏭️ **MioMusic:** Lagu telah dilewati!");
    }
};

