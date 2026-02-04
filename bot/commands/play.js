const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { QueryType, useMainPlayer } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Putar lagu dari SoundCloud atau Spotify")
        .addStringOption(option =>
            option.setName("query")
                .setDescription("Nama lagu atau link")
                .setRequired(true)),
    async execute(interaction) {
        const player = useMainPlayer();
        const channel = interaction.member.voice.channel;

        if (!channel) {
            return interaction.reply({ content: "❌ Masuk voice channel dulu!", flags: 64 });
        }

        await interaction.deferReply();

        const query = interaction.options.getString("query");
        console.log(`[MioMusic] Playing: ${query}`);

        try {
            const result = await player.search(query, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            });

            if (!result || !result.tracks.length) {
                return interaction.editReply("❌ Tidak ditemukan!");
            }

            const queue = player.nodes.create(interaction.guild, {
                metadata: {
                    channel: interaction.channel,
                    client: interaction.client,
                    requestedBy: interaction.user
                },
                selfDeaf: true,
                volume: 80,
                leaveOnEnd: true,
                leaveOnEndCooldown: 60000,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 30000
            });

            if (!queue.connection) {
                await queue.connect(channel);
            }

            if (result.playlist) {
                queue.addTrack(result.tracks);
            } else {
                queue.addTrack(result.tracks[0]);
            }

            if (!queue.node.isPlaying()) {
                await queue.node.play();
            }

            const track = result.playlist ? null : result.tracks[0];
            const embed = new EmbedBuilder()
                .setColor(interaction.client.config.color)
                .setAuthor({ name: "MioMusic", iconURL: interaction.client.user.displayAvatarURL() });

            if (result.playlist) {
                embed.setDescription(`✅ Added **${result.tracks.length}** lagu dari playlist!`);
            } else {
                embed.setDescription(`✅ Added **${track.title}**`);
                embed.setThumbnail(track.thumbnail);
            }

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error("[MioMusic] Play Error:", error);
            await interaction.editReply("❌ Gagal memutar!").catch(() => null);
        }
    }
};
