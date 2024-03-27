const { getWorker } = require("./utils");

function getVenmoLink(kimaiId, dollarAmount, { start, end }) {
  const worker = getWorker(kimaiId);

  if (!worker || !Object.hasOwnProperty.call(worker, "venmo")) {
    return undefined;
  }

  const note = `For pay period: ${start.format("MMM D")} to ${end.format("MMM D")}. 💰\n\nThank you!! ♥️️`;
  return `https://venmo.com/?txn=pay&audience=private&recipients=${worker.venmo}&amount=${dollarAmount}&note=${note}`;
}

module.exports = {
  getVenmoLink,
};
