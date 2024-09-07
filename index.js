require('dotenv').config();
const { Client, GatewayIntentBits, ApplicationCommandOptionType } = require('discord.js');
const { Connection, PublicKey } = require('@solana/web3.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

const connection = new Connection("https://api.mainnet-beta.solana.com");

client.once('ready', async () => {
  console.log('Bot is online!');

  const guild = client.guilds.cache.get('1282092238746419200');
  if (!guild) return console.error("Unable to find guild.");

  try {
    await guild.commands.create({
      name: 'verify',
      description: 'Verify your $WORK token holdings and get a role!',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'wallet',
          description: 'Your Solana wallet address',
          required: true,
        },
      ],
    });
    console.log('Slash command registered successfully!');
  } catch (error) {
    console.error('Error registering slash command:', error);
  }
});

// Token check function
async function checkTokenHolding(walletAddress, minBalance) {
  console.log(`Checking token holding for wallet: ${walletAddress}`);
  
  if (!walletAddress || typeof walletAddress !== 'string' || walletAddress.length !== 44) {
    throw new Error('Invalid wallet address format');
  }

  try {
    const publicKey = new PublicKey(walletAddress);
    console.log(`Public key created: ${publicKey.toBase58()}`);

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") });
    console.log(`Token accounts fetched: ${tokenAccounts.value.length}`);

    for (const tokenAccount of tokenAccounts.value) {
      const tokenInfo = tokenAccount.account.data.parsed.info;
      console.log(`Checking token: ${tokenInfo.mint}`);
      if (tokenInfo.mint === 'F7Hwf8ib5DVCoiuyGr618Y3gon429Rnd1r5F9R5upump') {
        const balance = tokenInfo.tokenAmount.uiAmount;
        console.log(`$WORK token balance: ${balance}`);
        if (balance >= minBalance) {
          return true;
        }
      }
    }
  } catch (error) {
    console.error('Error in checkTokenHolding:', error);
    throw error;
  }
  return false;
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'verify') {
    await interaction.deferReply({ ephemeral: true });

    const walletAddress = interaction.options.getString('wallet');
    const minBalance = 1;

    try {
      console.log(`Verification requested for wallet: ${walletAddress}`);
      const hasTokens = await checkTokenHolding(walletAddress, minBalance);

      if (hasTokens) {
        const role = interaction.guild.roles.cache.find(role => role.name === 'HOLDERS');
        if (role) {
          const member = interaction.guild.members.cache.get(interaction.user.id);
          await member.roles.add(role);
          await interaction.editReply({ content: 'You have been granted the Holder role!', ephemeral: true });
        } else {
          await interaction.editReply({ content: 'Role not found on this server!', ephemeral: true });
        }
      } else {
        await interaction.editReply({ content: 'You do not hold enough $WORK tokens.', ephemeral: true });
      }
    } catch (error) {
      console.error('Error during verification:', error);
      await interaction.editReply({ content: `An error occurred during verification: ${error.message}. Please try again later.`, ephemeral: true });
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);