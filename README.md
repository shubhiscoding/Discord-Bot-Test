# Discord Wallet Verification Bot

This Discord bot verifies users' wallet holdings and manages roles based on their token balance. It connects with the Solana blockchain to check token balances and uses a PostgreSQL database to track user verification status.

## Features

- Discord bot with `/verify` command
- Sends a unique verification link to users
- Periodic check to update user roles based on token holdings
- Integrates with Solana blockchain to verify token balances

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Solana CLI (optional for debugging)
- A Discord bot token
- An environment to host the bot (e.g., local machine, VPS)

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root of the project with the following content:

   ```env
   DISCORD_BOT_TOKEN=your-discord-bot-token
   DATABASE_URL=your-database-url
   VERIFICATION_APP_URL=your-verification-app-url
   ```

   Replace `your-discord-bot-token`, `your-database-url`, and `your-verification-app-url` with your actual values.

4. **Set up the PostgreSQL database:**

   Ensure your PostgreSQL database is running and create a table for verification:

   ```sql
   CREATE TABLE verifications (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      discord_username VARCHAR(255),
      public_key VARCHAR(255),
      token VARCHAR(255) UNIQUE NOT NULL,
      verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      verified_at TIMESTAMP WITH TIME ZONE
   );

   ```

## Running the Bot

Start the bot with:

```bash
node index.js
```

The bot will start and listen for interactions on your Discord server.

## Commands

- `/verify` - Starts the wallet connection and verification process. A unique verification link will be sent to the user.

## Cron Job

The bot includes a cron job that runs daily at midnight to check token holdings and update user roles accordingly.

## Troubleshooting

- **Bot not responding:** Check if the bot is online and properly connected to Discord. Ensure the bot token is correct and not expired.
- **Database errors:** Verify the database connection and schema. Ensure PostgreSQL is running and accessible.
- **Token balance issues:** Ensure the Solana connection is correct and the token mint address is accurate.