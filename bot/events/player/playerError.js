module.exports = {
    name: "playerError",
    playerEvent: true,
    async execute(queue, error) {
        console.error(`[MioMusic] Player Error in ${queue.guild.name}:`, error.message);

        if (queue.metadata && queue.metadata.channel) {
            await queue.metadata.channel.send({
                content: `❌ **MioMusic:** Terjadi error saat memutar audio.\n\`\`\`${error.message}\`\`\``
            }).catch(() => null);
        }
    }
};
