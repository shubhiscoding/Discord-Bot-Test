# Discord $WORK Token Role Bot

This bot automatically assigns a role to users in your Discord server based on their $WORK token holdings from the Solana blockchain.

## Prerequisites

Before running the bot, ensure you have the following:
1. **Node.js**: [Download and install Node.js](https://nodejs.org/) (version 16.x or later recommended).
2. **Solana Wallet and Token Info**: Ensure you have the Solana $WORK token mint address and the token program ID.
3. **Discord Bot**: Create a bot in the [Discord Developer Portal](https://discord.com/developers/applications) and get the Bot Token.
4. **Discord Server**: The bot must be added to your Discord server with the necessary permissions.

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/discord-work-token-bot.git
cd discord-work-token-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory of the project and add your Discord Bot Token:

```plaintext
DISCORD_BOT_TOKEN=YOUR_DISCORD_BOT_TOKEN
```

Replace `YOUR_DISCORD_BOT_TOKEN` with the token from the Discord Developer Portal.

### 4. Update Bot Code

Open `index.js` and ensure the following:
- Replace `YOUR_GUILD_ID` with your Discord server's Guild ID.
- Verify the Solana Token Program ID is correct (typically `Token Program ID`).

### 5. Run the Bot

Start the bot using Node.js:

```bash
node bot.js
```

You should see `Bot is online!` in the terminal if everything is set up correctly.

## Usage

1. **Verify Token Holdings**: In your Discord server, use the slash command `/verify` followed by your Solana wallet address. For example:

   ```
   /verify wallet 3sPF...YourSolanaAddress
   ```

2. **Check Role Assignment**: If the wallet address holds the required amount of $WORK tokens, the bot will assign the "Token Holder" role to the user.

## Troubleshooting

- **Bot Permissions**: Ensure the bot has `Manage Roles` permission and the role is set above the bot's role in the server hierarchy.
- **Errors**: Check the terminal for any errors logged during the bot's operation and ensure all configuration details are correct.
- **Token Info**: Double-check the $WORK token mint address and Solana Token Program ID.