const TelegramBot = require("node-telegram-bot-api");
const createKimai = require("./createKimai");
const {
  getCurrentPayPeriod,
  getPriorPayPeriod,
  summarizeTimesheetEntries,
} = require("./utils");
const { getVenmoLink } = require("./venmo");

require("dotenv").config();

const {
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID,
  KIMAI_BASE_URL,
  KIMAI_AUTH_USER,
  KIMAI_AUTH_TOKEN,
} = process.env;

const telegramBot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });
const kimai = createKimai(KIMAI_BASE_URL, KIMAI_AUTH_USER, KIMAI_AUTH_TOKEN);

async function notifyHoursAndCost(payPeriod, workerId, workerName) {
  const { start, end } = payPeriod;

  const timesheetEntries = await kimai.getTimesheetEntries(
    workerId,
    start,
    end,
  );

  const { hours, cost } = summarizeTimesheetEntries(timesheetEntries);

  if (hours > 0 || cost > 0) {
    const timesheetLink = kimai.getTimesheetLink(workerId, { start, end });
    let message = `For pay period: <a href="${timesheetLink}">${start.format("MMM D")} - ${end.format("MMM D")}</a>, ${workerName} worked ${hours.toFixed(2)} hours and earned $${cost.toFixed(2)}.`;

    const venmoLink = getVenmoLink(workerId, cost, { start, end });
    if (venmoLink) {
      message += `  <a href="${venmoLink}">Pay Now 💸</a>`;
    }

    await telegramBot.sendMessage(TELEGRAM_CHAT_ID, message, {
      parse_mode: "HTML",
      link_preview_options: { is_disabled: true },
    });
  }
}

async function main() {
  const payPeriod = getPriorPayPeriod(getCurrentPayPeriod());
  const users = await kimai.getUsers();

  for (const user of users) {
    const { alias: name, id } = user;
    await notifyHoursAndCost(payPeriod, id, name);
  }
}

main();
