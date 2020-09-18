/* eslint-disable @typescript-eslint/no-explicit-any */
type ConsoleFunction = (...args: any) => void;

interface Console {
  error: ConsoleFunction;
  log: ConsoleFunction;
  warn: ConsoleFunction;
}

export interface Logger extends Console {
  actingConsole: Console;
  init: (console: Console) => Logger;
}

const dumpFunction: ConsoleFunction = () => { /*-empty-*/ };

const logger: Logger = {
  actingConsole: {
    error: dumpFunction,
    log: dumpFunction,
    warn: dumpFunction,
  },
  init: (console) => {
    logger.actingConsole = console;
    return logger;
  },
  error: (...args: any) => logger.actingConsole.error(...args),
  log: (...args: any) => logger.actingConsole.log(...args),
  warn: (...args: any) => logger.actingConsole.warn(...args),
};

export default logger;
