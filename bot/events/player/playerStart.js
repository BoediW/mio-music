const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "playerStart",
    playerEvent: true,
    async execute(queue, track) {
        const client = queue.metadata.client;

        // Simple control buttons - 1 row only
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("prev").setEmoji("⏮️").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("pause").setEmoji("⏯️").setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId("skip").setEmoji("⏭️").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("loop").setEmoji("🔁").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("queue").setEmoji("📋").setStyle(ButtonStyle.Secondary)
        );

        // Loop mode text
        const loopModes = ["Off", "Track", "Queue"];
        const loopMode = loopModes[queue.repeatMode] || "Off";

        const embed = new EmbedBuilder()
            .setAuthor({ name: "🎵 Now Playing", iconURL: client.user.displayAvatarURL() })
            .setTitle(track.title)
            .setURL(track.url)
            .setThumbnail(track.thumbnail)
            .setColor(client.config.color)
            .addFields(
                { name: "👤 Artist", value: track.author || "Unknown", inline: true },
                { name: "⏱️ Duration", value: track.duration || "Live", inline: true },
                { name: "🔁 Loop", value: loopMode, inline: true }
            )
            .setFooter({ text: `Requested by ${queue.metadata.requestedBy.username} • Queue: ${queue.tracks.size} lagu` });

        // Delete previous message if exists
        if (queue.metadata.lastMessage) {
            queue.metadata.lastMessage.delete().catch(() => null);
        }

        const message = await queue.metadata.channel.send({
            embeds: [embed],
            components: [row]
        }).catch(() => null);

        if (message) {
            queue.metadata.lastMessage = message;
        }
    }
};
