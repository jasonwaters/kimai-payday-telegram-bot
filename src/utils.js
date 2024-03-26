const dayjs = require("dayjs");

function getPriorPayPeriod(period) {
  const { start, end } = period;
  return { start: start.subtract(7, "days"), end: end.subtract(7, "days") };
}
function getCurrentPayPeriod() {
  const today = dayjs();
  const start = today.startOf("week");
  const end = today.endOf("week");

  return { start, end };
}

function summarizeTimesheetEntries(entrees = []) {
  return entrees.reduce(
    (tot, cur) => {
      tot.hours += cur.duration / 3600;
      tot.cost += cur.rate;
      return tot;
    },
    { hours: 0, cost: 0 },
  );
}

module.exports = {
  getPriorPayPeriod,
  getCurrentPayPeriod,
  summarizeTimesheetEntries,
};
