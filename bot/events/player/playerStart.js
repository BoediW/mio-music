const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "playerStart",
    playerEvent: true,
    async execute(queue, track) {
        const client = queue.metadata.client;

        // Main control row - all controls together
        const controlRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("previous_btn").setEmoji("⏮️").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("pause_btn").setEmoji("⏯️").setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId("skip_btn").setEmoji("⏭️").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("stop_btn").setEmoji("⏹️").setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId("loop_btn").setEmoji("🔁").setStyle(ButtonStyle.Secondary)
        );

        // Volume and queue row
        const utilityRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("vol_down").setEmoji("🔉").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("vol_up").setEmoji("🔊").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("queue_btn").setEmoji("📋").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("shuffle_btn").setEmoji("🔀").setStyle(ButtonStyle.Secondary)
        );

        // Get loop mode text
        const loopModes = ["Off", "Track", "Queue"];
        const loopMode = loopModes[queue.repeatMode] || "Off";

        const embed = new EmbedBuilder()
            .setAuthor({
                name: "🎵 MioMusic - Now Playing",
                iconURL: client.user.displayAvatarURL(),
                url: client.config.invite
            })
            .setTitle(track.title)
            .setURL(track.url)
            .setThumbnail(track.thumbnail)
            .setColor(client.config.color)
            .addFields(
                { name: "👤 Artist", value: track.author || "Unknown", inline: true },
                { name: "⏱️ Duration", value: track.duration || "Live", inline: true },
                { name: "🔁 Loop", value: loopMode, inline: true },
                { name: "🎧 Requested By", value: `${queue.metadata.requestedBy}`, inline: true },
                { name: "🔊 Volume", value: `${queue.node.volume}%`, inline: true },
                { name: "📋 Queue", value: `${queue.tracks.size} tracks`, inline: true }
            )
            .setImage("https://media.tenor.com/7I6Dlyi_f_8AAAAd/mio-akiyama-k-on.gif")
            .setFooter({ text: "🎹 SoundCloud & Spotify | MioMusic Premium" });

        // Delete previous message if exists
        if (queue.metadata.lastMessage) {
            queue.metadata.lastMessage.delete().catch(() => null);
        }

        const message = await queue.metadata.channel.send({
            embeds: [embed],
            components: [controlRow, utilityRow]
        });

        queue.metadata.lastMessage = message;
    }
};
