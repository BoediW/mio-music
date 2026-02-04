const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { QueryType, useMainPlayer } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("playlist")
        .setDescription("Cari dan putar playlist dari SoundCloud atau Spotify")
        .addStringOption(option =>
            option.setName("query")
                .setDescription("Nama playlist atau link playlist")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("source")
                .setDescription("Sumber musik")
                .setRequired(false)
                .addChoices(
                    { name: "🔊 SoundCloud", value: "soundcloud" },
                    { name: "🎵 Spotify", value: "spotify" },
                    { name: "🔄 Auto", value: "auto" }
                )),
    async execute(interaction) {
        const player = useMainPlayer();
        const channel = interaction.member.voice.channel;

        if (!channel) {
            return interaction.reply({
                content: "❌ **MioMusic:** Kamu harus berada di voice channel!",
                ephemeral: true
            });
        }

        const permissions = channel.permissionsFor(interaction.client.user);
        if (!permissions.has("Connect") || !permissions.has("Speak")) {
            return interaction.reply({
                content: "❌ **MioMusic:** Aku butuh izin `Connect` dan `Speak` di channel kamu!",
                ephemeral: true
            });
        }

        await interaction.deferReply();

        const query = interaction.options.getString("query");
        const source = interaction.options.getString("source") || "auto";

        console.log(`[MioMusic] Playlist search: ${query} (source: ${source})`);

        try {
            let searchEngine = QueryType.AUTO;

            if (source === "soundcloud") {
                searchEngine = QueryType.SOUNDCLOUD_PLAYLIST;
            } else if (source === "spotify") {
                searchEngine = QueryType.SPOTIFY_PLAYLIST;
            }

            let searchResult = await player.search(query, {
                requestedBy: interaction.user,
                searchEngine: searchEngine
            }).catch(err => {
                console.log(`[MioMusic] Playlist search failed: ${err.message}`);
                return null;
            });

            // Fallback to auto if specific source failed
            if ((!searchResult || !searchResult.tracks.length) && source !== "auto") {
                console.log(`[MioMusic] Falling back to AUTO search...`);
                searchResult = await player.search(query, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO
                }).catch(() => null);
            }

            if (!searchResult || !searchResult.tracks.length) {
                return interaction.editReply({
                    content: `❌ **MioMusic:** Tidak ditemukan playlist untuk \`${query}\`.\n\n*Tips: Gunakan link playlist langsung dari SoundCloud atau Spotify.*`
                });
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
            });

            if (!queue.connection) {
                try {
                    await queue.connect(channel);
                } catch (err) {
                    player.nodes.delete(interaction.guildId);
                    return interaction.editReply({ content: "❌ **MioMusic:** Gagal masuk ke voice channel!" });
                }
            }

            // Add all tracks from playlist
            queue.addTrack(searchResult.tracks);

            const embed = new EmbedBuilder()
                .setAuthor({ name: "MioMusic Premium - Playlist", iconURL: interaction.client.user.displayAvatarURL() })
                .setColor(interaction.client.config.color)
                .setTimestamp();

            if (searchResult.playlist) {
                embed.setTitle(`📋 ${searchResult.playlist.title}`);
                embed.setURL(searchResult.playlist.url);
                embed.setDescription(`✅ Menambahkan **${searchResult.tracks.length} lagu** ke antrean!`);
                embed.setThumbnail(searchResult.playlist.thumbnail || interaction.client.user.displayAvatarURL());

                // Show first 5 tracks
                const trackList = searchResult.tracks.slice(0, 5).map((t, i) => `${i + 1}. ${t.title}`).join('\n');
                embed.addFields({
                    name: "🎵 Preview",
                    value: trackList + (searchResult.tracks.length > 5 ? `\n... dan ${searchResult.tracks.length - 5} lagu lainnya` : "")
                });
            } else {
                embed.setDescription(`✅ Menambahkan **${searchResult.tracks.length} lagu** ke antrean.`);
            }

            // Autoplay
            if (!queue.node.isPlaying() && !queue.node.isPaused()) {
                await queue.node.play();
            }

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error(`[MioMusic] Playlist Error:`, error);
            await interaction.editReply({ content: "❌ **MioMusic:** Gagal memuat playlist." }).catch(() => null);
        }
    }
};
