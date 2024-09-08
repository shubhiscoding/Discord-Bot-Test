const express = require('express');
const bodyParser = require('body-parser');
const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
const crypto = require('crypto');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

client.once('ready', async () => {
  console.log('Bot is online!');

  const guild = client.guilds.cache.get('1282092238746419200');
  if (!guild) return console.error("Unable to find guild.");

  try {
    await guild.commands.create({
      name: 'verify',
      description: 'Start the wallet connection and verification process',
    });
    console.log('Slash command registered successfully!');
  } catch (error) {
    console.error('Error registering slash command:', error);
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isCommand()) {
    const { commandName } = interaction;

    if (commandName === 'verify') {
      const userId = interaction.user.id;
      const uniqueToken = crypto.randomBytes(16).toString('hex');
      
      await pool.query(
        'INSERT INTO verifications (user_id, token, created_at) VALUES ($1, $2, NOW())',
        [userId, uniqueToken]
      );

      const verificationUrl = `${process.env.VERIFICATION_APP_URL}/verify?token=${uniqueToken}`;
      
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setLabel('Verify Wallet')
            .setStyle(ButtonStyle.Link)
            .setURL(verificationUrl)
        );

      await interaction.reply({ 
        content: 'Click the button below to verify your wallet and token holdings. This link is unique to you and will expire in 1 hour.', 
        components: [row], 
        ephemeral: true 
      });
    }
  }
});

app.post('/verify-status', async (req, res) => {
  const { token, userId, verified } = req.body;
  console.log('Received verification status:', req.body);

  if (!token || !userId || verified === undefined) {
    return res.status(400).send('Invalid data');
  }
  try {
    await pool.query('UPDATE verifications SET verified = $1 WHERE token = $2 AND user_id = $3', [verified, token, userId]);

    const guild = client.guilds.cache.get('1282092238746419200');
    if (!guild) {
      console.error('Unable to find guild');
      return res.status(500).send('Internal server error');
    }

    const member = await guild.members.fetch(userId);
    if (!member) {
      console.error('Unable to find member');
      return res.status(500).send('Internal server error');
    }

    const user = await client.users.fetch(userId);
    const dmChannel = await user.createDM();

    if (verified) {
      const holderRole = guild.roles.cache.find(role => role.name === 'HOLDERS');
      if (!holderRole) {
        console.error('HOLDERS role not found');
        await dmChannel.send('Verification successful, but there was an error assigning the role. Please contact an administrator.');
        return res.status(500).send('Internal server error');
      }

      await member.roles.add(holderRole);
      await dmChannel.send('Congratulations! Your wallet is verified and whitelisted. You have been assigned the HOLDERS role.');
    } else {
      await dmChannel.send('Verification failed: Insufficient token balance. You need at least one $WORK token to be verified.');
    }

    res.status(200).send('Verification status updated successfully.');
  } catch (error) {
    console.error('Error updating verification status:', error);
    res.status(500).send('Internal server error');
  }
});

app.listen(3001, () => {
  console.log('API server running on port 3001');
});

client.login(process.env.DISCORD_BOT_TOKEN);