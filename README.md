# kimai-payday-telegram-bot

I have several people that work for me from time to time. I use [Kimai](https://www.kimai.org/) to track their hours. Workers are paid their hours once a week on Sunday.

I used to manually sign in to kimai, look up each worker's hours and cost, then send them a venmo payment. That got old.

This script uses the Kimai API to fetch hours worked for all users, totals the hours and cost for the week, then sends a Telegram message to a group. The message serves as a reminder of what is owed and to whom. Since I pay with Venmo, a helpful hyperlink can be tapped within the message to pay the worker the appropriate amount with a single click.

## Quick Start with Docker Compose (Recommended)

### 1. Set Up Configuration

```bash
# Create config directory
mkdir -p /volume1/docker/kimai-payday/config

# Create .env file from template
cat > /volume1/docker/kimai-payday/config/.env << 'EOF'
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
KIMAI_BASE_URL=https://your-kimai-instance.com
KIMAI_AUTH_USER=your_kimai_username
KIMAI_AUTH_TOKEN=your_kimai_api_token
EOF

# Create workers.json file from template
cat > /volume1/docker/kimai-payday/config/workers.json << 'EOF'
{
  "workers": [
    {
      "name": "Worker Name",
      "venmo": "venmo-username",
      "kimaiId": 3
    }
  ]
}
EOF
```

See `.env_template` and `workers_template.json` in the repo for full examples.

### 2. Add to Your docker-compose.yml

```yaml
services:
  kimai-payday:
    image: ghcr.io/jasonwaters/kimai-payday-telegram-bot:latest
    volumes:
      - /volume1/docker/kimai-payday/config/.env:/app/.env:ro
      - /volume1/docker/kimai-payday/config/workers.json:/app/workers.json:ro
    restart: "no"
    profiles: ["manual"]
```

### 3. Run It

```bash
# From any directory
docker-compose -f /volume1/docker/docker-compose.yml run --rm kimai-payday

# Or if in the same directory as docker-compose.yml
docker-compose run --rm kimai-payday
```

### 4. Schedule It (Optional)

**Synology Task Scheduler:**
- Control Panel → Task Scheduler
- Create → Scheduled Task → User-defined script
- Schedule: Weekly on Sunday at 9am
- Script:

```bash
#!/bin/bash
docker-compose -f /volume1/docker/docker-compose.yml run --rm kimai-payday
```

**Cron:**

```bash
# Run every Sunday at 9am
0 9 * * 0  docker-compose -f /volume1/docker/docker-compose.yml run --rm kimai-payday
```

---

## Automated Image Publishing

Docker images are automatically built and published to GitHub Container Registry on every push via GitHub Actions. Images support both `linux/amd64` and `linux/arm64` architectures.

**Available tags:**
- `latest` - Latest build from main/master branch
- `main` / `master` - Latest from respective branches
- `v1.0.0` - Specific version tags
- `master-abc1234` - Specific commit SHAs

---

## Manual Build (Development)

If you want to build locally:

```bash
# Clone the repo
git clone https://github.com/jasonwaters/kimai-payday-telegram-bot.git
cd kimai-payday-telegram-bot

# Create config files
cp .env_template .env
cp workers_template.json workers.json
# Edit both files with your values

# Build
docker build -t kimai-payday-telegram-bot .

# Run
docker run --rm kimai-payday-telegram-bot
```

---

## Configuration

### .env File

| Variable | Required | Description |
|----------|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | Yes | Telegram bot token from [@BotFather](https://t.me/BotFather) |
| `TELEGRAM_CHAT_ID` | Yes | Chat ID to send messages to (group or individual) |
| `KIMAI_BASE_URL` | Yes | Base URL of your Kimai instance |
| `KIMAI_AUTH_USER` | Yes | Kimai username with API access |
| `KIMAI_AUTH_TOKEN` | Yes | Kimai API token |

### workers.json File

```json
{
  "workers": [
    {
      "name": "Worker Name",
      "venmo": "venmo-username",
      "kimaiId": 3
    }
  ]
}
```

- `name` - Worker display name
- `venmo` - Venmo username (optional, enables "Pay Now" link)
- `kimaiId` - Kimai user ID (found in Kimai API)
