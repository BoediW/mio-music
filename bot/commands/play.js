const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { QueryType, useMainPlayer } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Putar lagu dari SoundCloud atau Spotify (MioMusic Premium)")
        .addStringOption(option =>
            option.setName("query")
                .setDescription("Nama lagu atau link (SoundCloud, Spotify)")
                .setRequired(true)),
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

        let query = interaction.options.getString("query");
        console.log(`[MioMusic] Searching for: ${query}`);

        try {
            let searchResult = null;

            // Strategy 1: AUTO search (works for SoundCloud & Spotify)
            searchResult = await player.search(query, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            }).catch(err => {
                console.log(`[MioMusic] AUTO search failed: ${err.message}`);
                return null;
            });

            // Strategy 2: SoundCloud specific search
            if (!searchResult || !searchResult.tracks.length) {
                console.log(`[MioMusic] Trying SoundCloud...`);
                searchResult = await player.search(query, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.SOUNDCLOUD_SEARCH
                }).catch(() => null);
            }

            // Strategy 3: Spotify search
            if (!searchResult || !searchResult.tracks.length) {
                console.log(`[MioMusic] Trying Spotify...`);
                searchResult = await player.search(query, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.SPOTIFY_SEARCH
                }).catch(() => null);
            }

            if (!searchResult || !searchResult.tracks.length) {
                return interaction.editReply({
                    content: `❌ **MioMusic:** Tidak ditemukan hasil untuk \`${query}\`.\n\n*Tips: Coba gunakan link SoundCloud atau Spotify langsung.*`
                });
            }

            console.log(`[MioMusic] Found track: ${searchResult.tracks[0].title}`);

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
                bufferingTimeout: 3000,
            });

            if (!queue.connection) {
                try {
                    await queue.connect(channel);
                } catch (err) {
                    console.error(`[MioMusic] Voice connection error: ${err.message}`);
                    player.nodes.delete(interaction.guildId);
                    return interaction.editReply({ content: "❌ **MioMusic:** Gagal masuk ke voice channel!" });
                }
            }

            const embed = new EmbedBuilder()
                .setAuthor({ name: "MioMusic Premium", iconURL: interaction.client.user.displayAvatarURL() })
                .setColor(interaction.client.config.color)
                .setTimestamp();

            if (searchResult.playlist) {
                queue.addTrack(searchResult.tracks);
                embed.setDescription(`✅ Menambahkan playlist **[${searchResult.playlist.title}](${searchResult.playlist.url})** (${searchResult.tracks.length} lagu) ke antrean.`);
                embed.setThumbnail(searchResult.playlist.thumbnail || interaction.client.user.displayAvatarURL());
            } else {
                const track = searchResult.tracks[0];
                queue.addTrack(track);
                embed.setDescription(`✅ Menambahkan **[${track.title}](${track.url})** ke antrean.`);
                embed.setThumbnail(track.thumbnail);
            }

            // Autoplay fix
            if (!queue.node.isPlaying() && !queue.node.isPaused()) {
                try {
                    await queue.node.play();
                    console.log(`[MioMusic] Started playing.`);
                } catch (playErr) {
                    console.error(`[MioMusic] Play error:`, playErr.message);
                }
            }

            // Control buttons
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId("previous_btn").setEmoji("⏮️").setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId("pause_btn").setEmoji("⏯️").setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId("skip_btn").setEmoji("⏭️").setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId("loop_btn").setEmoji("🔁").setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId("stop_btn").setEmoji("⏹️").setStyle(ButtonStyle.Danger)
            );

            await interaction.editReply({ embeds: [embed], components: [row] });

        } catch (error) {
            console.error(`[MioMusic] Critical Error:`, error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: "❌ **MioMusic:** Terjadi kesalahan internal.", ephemeral: true }).catch(() => null);
            } else {
                await interaction.editReply({ content: "❌ **MioMusic:** Terjadi kesalahan internal." }).catch(() => null);
            }
        }
    }
};
