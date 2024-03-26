const https = require("https");

const DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss";

module.exports = (kimaiBaseUrl, kimaiAuthUser, kimaiAuthToken) => {
  const API_ENDPOINT = `${kimaiBaseUrl}/api`;

  function getTimesheetLink(user, { start, end }) {
    const daterange = [
      start.format("M/D/YYYY"),
      "+-+",
      end.format("M/D/YYYY"),
    ].join("");

    return `${kimaiBaseUrl}/en/team/timesheet/?daterange=${daterange}&${encodeURIComponent("users[]")}=${user.id}&orderBy=begin&order=ASC`;
  }

  async function request(fragment, params, postProcess = (res) => res.json()) {
    return new Promise((resolve, reject) => {
      const url =
        `${API_ENDPOINT}/${fragment}?` +
        new URLSearchParams({
          ...params,
        });

      const headers = {
        "X-AUTH-USER": kimaiAuthUser,
        "X-AUTH-TOKEN": kimaiAuthToken,
        Accept: "application/json",
      };

      https
        .get(url, { headers }, (resp) => {
          let data = "";
          const { statusCode } = resp;

          resp.on("data", (chunk) => {
            data += chunk;
          });

          resp.on("end", () => {
            resolve({
              status: statusCode,
              json: () => Promise.resolve(JSON.parse(data)),
              text: () => Promise.resolve(data),
            });
          });
        })
        .on("error", (err) => reject(err));
    })
      .then(postProcess)
      .catch((err) => {
        throw new Error(`ERROR! - ${err.message}`);
      });
  }

  async function getTimesheetEntries(userId, start, end) {
    return request("timesheets", {
      user: userId,
      begin: start.format(DATE_FORMAT),
      end: end.format(DATE_FORMAT),
    });
  }

  return {
    getTimesheetEntries,
    getTimesheetLink,
  };
};
