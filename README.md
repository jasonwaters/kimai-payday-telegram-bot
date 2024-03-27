# kimai-payday-telegram-bot
This is a simple script that pulls logged hours from kimai for a single user, totals the hours and cost for the week, then notifies a telegram group.

 ## Build Docker Container

- clone the project
- change directory to project root
- copy `.env_tamplate` to `.env` and update the environment variables.
- `docker build --no-cache -t kimai-payday-telegram-bot .`

## Run the docker command

- `docker run --rm -v /volume1/media/:/media kimai-payday-telegram-bot`
- set up a cron job to run on a schedule
