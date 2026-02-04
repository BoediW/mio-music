const { EmbedBuilder } = require("discord.js");
const { QueueRepeatMode } = require("discord-player");

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        const client = interaction.client;

        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                const msg = { content: `❌ **MioMusic:** Terjadi kesalahan saat menjalankan command ini!`, ephemeral: true };
                if (interaction.replied || interaction.deferred) await interaction.followUp(msg).catch(() => null);
                else await interaction.reply(msg).catch(() => null);
            }
        } else if (interaction.isButton()) {
            const queue = client.player.nodes.get(interaction.guildId);

            // Re-verify voice connection for buttons
            if (!interaction.member.voice.channel) {
                return interaction.reply({ content: "❌ Anda harus berada di voice channel!", ephemeral: true });
            }

            if (queue && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
                return interaction.reply({ content: "❌ Anda harus berada di voice channel yang sama dengan MioMusic!", ephemeral: true });
            }

            if (!queue) return interaction.reply({ content: "❌ Tidak ada musik yang sedang diputar.", ephemeral: true });

            await interaction.deferReply({ ephemeral: true }).catch(() => null);

            try {
                switch (interaction.customId) {
                    case "previous_btn":
                        const history = queue.history;
                        if (!history.tracks.size) {
                            return interaction.editReply("❌ **MioMusic:** Tidak ada lagu sebelumnya.");
                        }
                        await history.back();
                        await interaction.editReply("⏮️ **MioMusic:** Kembali ke lagu sebelumnya.");
                        break;

                    case "pause_btn":
                        const paused = queue.node.isPaused();
                        queue.node.setPaused(!paused);
                        await interaction.editReply(paused ? "▶️ **MioMusic:** Melanjutkan lagu." : "⏸️ **MioMusic:** Lagu dijeda.");
                        break;

                    case "skip_btn":
                        queue.node.skip();
                        await interaction.editReply("⏭️ **MioMusic:** Melewati lagu.");
                        break;

                    case "stop_btn":
                        queue.delete();
                        await interaction.editReply("⏹️ **MioMusic:** Berhenti dan keluar dari channel.");
                        break;

                    case "loop_btn":
                        // Cycle through loop modes: Off -> Track -> Queue -> Off
                        const currentMode = queue.repeatMode;
                        let newMode;
                        let modeText;

                        if (currentMode === QueueRepeatMode.OFF) {
                            newMode = QueueRepeatMode.TRACK;
                            modeText = "🔂 Loop Track (Lagu ini akan diulang)";
                        } else if (currentMode === QueueRepeatMode.TRACK) {
                            newMode = QueueRepeatMode.QUEUE;
                            modeText = "🔁 Loop Queue (Semua antrean akan diulang)";
                        } else {
                            newMode = QueueRepeatMode.OFF;
                            modeText = "➡️ Loop Off (Tidak ada pengulangan)";
                        }

                        queue.setRepeatMode(newMode);
                        await interaction.editReply(`**MioMusic:** ${modeText}`);
                        break;

                    case "shuffle_btn":
                        queue.tracks.shuffle();
                        await interaction.editReply("🔀 **MioMusic:** Antrean diacak!");
                        break;

                    case "queue_btn":
                        const tracks = queue.tracks.toArray();
                        const currentTrack = queue.currentTrack;
                        let qString = "";

                        if (currentTrack) {
                            qString += `**Now Playing:**\n🎵 ${currentTrack.title}\n\n`;
                        }

                        if (tracks.length > 0) {
                            qString += `**Up Next:**\n${tracks.slice(0, 10).map((t, i) => `**${i + 1}.** ${t.title}`).join('\n')}`;
                            if (tracks.length > 10) {
                                qString += `\n... dan ${tracks.length - 10} lagu lainnya`;
                            }
                        } else {
                            qString += "*Antrean kosong*";
                        }

                        const qEmbed = new EmbedBuilder()
                            .setTitle("📋 MioMusic Queue")
                            .setDescription(qString)
                            .setColor(client.config.color)
                            .setFooter({ text: `Total: ${tracks.length} lagu dalam antrean` });

                        await interaction.editReply({ embeds: [qEmbed] });
                        break;

                    case "vol_up":
                        const newVolUp = Math.min(queue.node.volume + 10, 100);
                        queue.node.setVolume(newVolUp);
                        await interaction.editReply(`🔊 **MioMusic:** Volume: ${newVolUp}%`);
                        break;

                    case "vol_down":
                        const newVolDown = Math.max(queue.node.volume - 10, 0);
                        queue.node.setVolume(newVolDown);
                        await interaction.editReply(`🔉 **MioMusic:** Volume: ${newVolDown}%`);
                        break;

                    default:
                        await interaction.editReply("❌ Tombol tidak dikenali.");
                }
            } catch (err) {
                console.error("[MioMusic] Button Error:", err);
                await interaction.editReply("❌ Gagal memproses aksi.").catch(() => null);
            }
        }
    }
};
