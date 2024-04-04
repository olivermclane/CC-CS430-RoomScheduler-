import pino from "pino";
import axios from "axios";

const send = async function (level, logEvent, a, b) {
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
      const response = await axios.post("http://127.0.0.1:8000/post-log/", formattedLogEvent, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    console.error("Error sending log event:", error);
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
