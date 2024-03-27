# kimai-payday-telegram-bot
I have several people that work for me from time to time. I use [kimai](https://www.kimai.org/) to track their hours.  Workers are for paid their hours once a week on Sunday.

I used to manually sign in to kimai, look up each worker's hours and cost, then send them a venmo payment.  That got old.

This script uses the kimai API to fetch hours worked for all users, it totals the hours and cost for the week, then sends a telegram message to a group.  The message serves as a reminder of what is owed and to whom.  Since I pay with venmo, a helpful hyperlink can be tapped within the message to pay the worker the appropriate amount with a single click. 

 ## Build Docker Container

- clone the project
- change directory to project root
- copy `.env_template` to `.env` and update the environment variables.
- copy `workers_template.json` to `workers.json` and add worker details.
- `docker build --no-cache -t kimai-payday-telegram-bot .`

## Run the docker command

- `docker run --rm -v /volume1/media/:/media kimai-payday-telegram-bot`
- set up a cron job to run on a schedule
