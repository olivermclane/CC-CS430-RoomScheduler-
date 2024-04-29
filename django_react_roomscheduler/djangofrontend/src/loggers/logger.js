import pino from "pino";
import axios from "axios";

const send = async function (level, logEvent) {
  const authToken = localStorage.getItem('access_token');
  const headers = {'Authorization':`Bearer ${authToken}`}

  try {
    // Check if the level is above the specified level below
    if (pino.levels.values[level] > pino.levels.values.debug) {
      // Format the log event
      const formattedLogEvent = [
        level.toUpperCase(),
        new Date(logEvent.ts).toLocaleString(),
        `${logEvent.messages.join(", ")}`,
      ];

      // Send the formatted log event to the server
      const response = await axios.post("/post-log/", formattedLogEvent, {headers});
    }
  } catch (error) {
    logger.error("Error sending log event:", error);
  }
};

const logger = pino({
  browser: {
    serialize: true,
    asObject: false,
    transmit: {
      send,
    },
  },
});

export default logger;
