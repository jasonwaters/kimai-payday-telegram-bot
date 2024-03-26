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
  WORKER_NAME,
  WORKER_VENMO,
  WORKER_ID,
} = process.env;

async function notifyHoursAndCost(worker) {
  const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

  const kimai = createKimai(KIMAI_BASE_URL, KIMAI_AUTH_USER, KIMAI_AUTH_TOKEN);

  const { start, end } = getPriorPayPeriod(getCurrentPayPeriod());

  const timesheetEntries = await kimai.getTimesheetEntries(
    worker.id,
    start,
    end,
  );

  const { hours, cost } = summarizeTimesheetEntries(timesheetEntries);

  const timesheetLink = kimai.getTimesheetLink(worker, { start, end });
  const venmoLink = getVenmoLink(worker, cost, { start, end });

  await bot.sendMessage(
    TELEGRAM_CHAT_ID,
    `For pay period: <a href="${timesheetLink}">${start.format("MMM D")} - ${end.format("MMM D")}</a>, ${worker.name} worked ${hours.toFixed(2)} hours and earned $${cost.toFixed(2)}.  <a href="${venmoLink}">Pay Now 💸</a>`,
    {
      parse_mode: "HTML",
      link_preview_options: { is_disabled: true },
    },
  );
}

notifyHoursAndCost({
  name: WORKER_NAME,
  venmo: WORKER_VENMO,
  id: WORKER_ID,
});
