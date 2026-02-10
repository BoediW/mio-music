const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QueryType, useMainPlayer } = require("discord-player");
const play = require("play-dl");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("playlist")
        .setDescription("Putar playlist dari SoundCloud atau Spotify")
        .addStringOption(option =>
            option.setName("url")
                .setDescription("Link playlist")
                .setRequired(true)),
    async execute(interaction) {
        const player = useMainPlayer();
        const channel = interaction.member.voice.channel;

        if (!channel) {
            return interaction.reply({ content: "❌ Masuk voice channel dulu!", flags: 64 });
        }

        await interaction.deferReply();

        const url = interaction.options.getString("url");
        console.log(`[MioMusic] Playlist: ${url}`);

        try {
            const result = await player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            });

            if (!result || !result.tracks.length) {
                return interaction.editReply("❌ Playlist tidak ditemukan!");
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
                leaveOnEmptyCooldown: 30000,
                async onBeforeCreateStream(track, source, _queue) {
                    try {
                        if (source === "youtube") {
                            const stream = await play.stream(track.url);
                            return stream.stream;
                        }

                        // Bridge Spotify & SoundCloud to YouTube for full duration
                        if (source === "spotify" || source === "soundcloud") {
                            const searchResult = await play.search(`${track.title} ${track.author}`, {
                                limit: 1,
                                source: { youtube: "video" }
                            });

                            if (searchResult && searchResult.length > 0) {
                                const stream = await play.stream(searchResult[0].url);
                                return stream.stream;
                            }
                        }
                    } catch (error) {
                        console.error("[MioMusic] Stream Error:", error);
                        return null;
                    }

                    return null;
                }
            });

            if (!queue.connection) {
                await queue.connect(channel);
            }

            queue.addTrack(result.tracks);
            console.log(`[MioMusic] Added ${result.tracks.length} tracks. Queue: ${queue.tracks.size}`);

            if (!queue.node.isPlaying()) {
                await queue.node.play();
            }

            const embed = new EmbedBuilder()
                .setColor(interaction.client.config.color)
                .setAuthor({ name: "MioMusic", iconURL: interaction.client.user.displayAvatarURL() })
                .setDescription(`✅ Added **${result.tracks.length}** lagu ke queue!`)
                .setFooter({ text: `Queue: ${queue.tracks.size} lagu` });

            if (result.playlist) {
                embed.setTitle(result.playlist.title);
                embed.setThumbnail(result.playlist.thumbnail);
            }

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error("[MioMusic] Playlist Error:", error);
            await interaction.editReply("❌ Gagal memuat playlist!").catch(() => null);
        }
    }
};
