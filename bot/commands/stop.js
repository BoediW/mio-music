const { SlashCommandBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Berhentikan musik dan keluar dari channel (MioMusic)"),
    async execute(interaction) {
        const queue = useQueue(interaction.guildId);

        if (!queue) {
            return interaction.reply({ content: "❌ **MioMusic:** Tidak ada musik yang sedang diputar!", ephemeral: true });
        }

        queue.delete();
        return interaction.reply("⏹️ **MioMusic:** Pemutaran dihentikan. Sampai jumpa!");
    }
};

