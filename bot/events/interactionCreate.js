const { EmbedBuilder } = require("discord.js");
const { QueueRepeatMode } = require("discord-player");

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        const client = interaction.client;

        // Handle Slash Commands
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error("[MioMusic] Command Error:", error);
                const msg = { content: "❌ Terjadi kesalahan!", flags: 64 };
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(msg).catch(() => null);
                } else {
                    await interaction.reply(msg).catch(() => null);
                }
            }
            return;
        }

        // Handle Buttons
        if (interaction.isButton()) {
            const queue = client.player.nodes.get(interaction.guildId);

            // Voice channel check
            if (!interaction.member.voice.channel) {
                return interaction.reply({ content: "❌ Masuk voice channel dulu!", flags: 64 }).catch(() => null);
            }

            if (!queue) {
                return interaction.reply({ content: "❌ Tidak ada musik.", flags: 64 }).catch(() => null);
            }

            const buttonId = interaction.customId;

            try {
                // Queue button = PUBLIC, others = EPHEMERAL
                if (buttonId === "queue") {
                    await interaction.deferReply();
                } else {
                    await interaction.deferReply({ flags: 64 });
                }
            } catch (e) {
                return;
            }

            try {
                switch (buttonId) {
                    case "prev":
                        if (queue.history.tracks.size > 0) {
                            await queue.history.back();
                            await interaction.editReply("⏮️ Previous");
                        } else {
                            await interaction.editReply("❌ Tidak ada lagu sebelumnya");
                        }
                        break;

                    case "pause":
                        const isPaused = queue.node.isPaused();
                        queue.node.setPaused(!isPaused);
                        await interaction.editReply(isPaused ? "▶️ Play" : "⏸️ Paused");
                        break;

                    case "skip":
                        queue.node.skip();
                        await interaction.editReply("⏭️ Skipped");
                        break;

                    case "loop":
                        let newMode, text;
                        if (queue.repeatMode === QueueRepeatMode.OFF) {
                            newMode = QueueRepeatMode.TRACK;
                            text = "🔂 Loop: Track";
                        } else if (queue.repeatMode === QueueRepeatMode.TRACK) {
                            newMode = QueueRepeatMode.QUEUE;
                            text = "🔁 Loop: Queue";
                        } else {
                            newMode = QueueRepeatMode.OFF;
                            text = "➡️ Loop: Off";
                        }
                        queue.setRepeatMode(newMode);
                        await interaction.editReply(text);
                        break;

                    case "queue":
                        const tracks = queue.tracks.toArray();
                        const current = queue.currentTrack;

                        let desc = "";
                        if (tracks.length > 0) {
                            desc = tracks.slice(0, 10).map((t, i) => `${i + 1}. ${t.title}`).join("\n");
                            if (tracks.length > 10) desc += `\n... +${tracks.length - 10} more`;
                        } else {
                            desc = "*Queue kosong*";
                        }

                        const embed = new EmbedBuilder()
                            .setTitle("📋 Queue")
                            .setColor(client.config.color)
                            .addFields({
                                name: "🎵 Now Playing",
                                value: current ? current.title : "None"
                            })
                            .setDescription(`**Up Next:**\n${desc}`)
                            .setFooter({ text: `${tracks.length} lagu dalam queue` });

                        await interaction.editReply({ embeds: [embed] });
                        break;

                    default:
                        await interaction.editReply("❌ Unknown button");
                }
            } catch (err) {
                console.error("[MioMusic] Button Error:", err.message);
                await interaction.editReply("❌ Error").catch(() => null);
            }
        }
    }
};
