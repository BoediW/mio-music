const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// Debug: Check if TOKEN is loaded
console.log("[MioMusic] Starting bot...");
console.log("[MioMusic] TOKEN exists:", !!process.env.TOKEN);
console.log("[MioMusic] CLIENT_ID:", process.env.CLIENT_ID || "NOT SET");
console.log("[MioMusic] GUILD_ID:", process.env.GUILD_ID || "NOT SET");

const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { Player } = require("discord-player");
const { DefaultExtractors } = require("@discord-player/extractor");
const fs = require("fs");
const logger = require("./utils/logger");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
    ]
});

// MioMusic Configuration
client.config = {
    name: "MioMusic",
    color: "#ff69b4", // Mio-chan theme color (Pink)
    premium: true,
    invite: `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=8&scope=bot%20applications.commands`
};

client.commands = new Collection();

// Create Player instance (SoundCloud & Spotify focused)
client.player = new Player(client, {
    skipFFmpeg: false
});

// Load extractors for SoundCloud & Spotify
client.player.extractors.loadMulti(DefaultExtractors);

// Handle unhandled promise rejections (prevents crash)
process.on('unhandledRejection', (error) => {
    console.error('[MioMusic] Unhandled Rejection:', error.message || error);
});

process.on('uncaughtException', (error) => {
    console.error('[MioMusic] Uncaught Exception:', error.message || error);
});

// Player events
client.player.events.on('error', (queue, error) => {
    console.error(`[MioMusic] Player Error: ${error.message}`);
    if (queue.metadata && queue.metadata.channel) {
        queue.metadata.channel.send(`❌ **Error:** ${error.message}`).catch(() => null);
    }
});

client.player.events.on('playerError', (queue, error) => {
    console.error(`[MioMusic] Playback Error: ${error.message}`);
    if (queue.metadata && queue.metadata.channel) {
        queue.metadata.channel.send(`❌ **Playback Error:** Gagal memutar track. Mencoba lagu berikutnya...`).catch(() => null);
    }
});

client.player.events.on('emptyQueue', (queue) => {
    if (queue.metadata && queue.metadata.channel) {
        queue.metadata.channel.send('✅ **MioMusic:** Antrean selesai! Terima kasih sudah mendengarkan 🎵').catch(() => null);
    }
});

// Load Commands
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
    }
}

// Load Events (Bot & Player)
const eventsPath = path.join(__dirname, "events");

const loadEvents = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.lstatSync(filePath);
        if (stat.isDirectory()) {
            loadEvents(filePath);
        } else if (file.endsWith(".js")) {
            const event = require(filePath);
            if (event.playerEvent) {
                client.player.events.on(event.name, (...args) => event.execute(...args));
            } else {
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args));
                } else {
                    client.on(event.name, (...args) => event.execute(...args));
                }
            }
        }
    }
};

loadEvents(eventsPath);

client.login(process.env.TOKEN);
