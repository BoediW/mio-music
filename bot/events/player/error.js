module.exports = {
    name: "error",
    playerEvent: true,
    async execute(queue, error) {
        console.error(`[MioMusic] General Error in ${queue.guild.name}:`, error.message);

        if (queue.metadata && queue.metadata.channel) {
            await queue.metadata.channel.send({
                content: `❌ **MioMusic:** Error: ${error.message}`
            }).catch(() => null);
        }
    }
};
