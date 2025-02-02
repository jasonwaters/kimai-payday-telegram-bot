const { getWorker } = require("./utils");

function roundToCents(value) {
  return parseFloat(value.toFixed(2));
}

function getVenmoLink(kimaiId, dollarAmount, { start, end }) {
  const worker = getWorker(kimaiId);

  if (!worker || !Object.hasOwnProperty.call(worker, "venmo")) {
    return undefined;
  }
  const note = `For pay period: ${start.format("MMM D")} to ${end.format("MMM D")}. 💰\n\nThank you!! ♥️️`;
  return `https://venmo.com/${worker.venmo}?txn=pay&audience=private&amount=${roundToCents(dollarAmount)}&note=${note}`;
}

module.exports = {
  getVenmoLink,
};
