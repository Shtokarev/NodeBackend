/* eslint-disable @typescript-eslint/no-explicit-any */
interface Console {
  error: Function;
  log: Function;
  warn: Function;
}

const dumpFunction: Function = () => { /*-empty-*/ };

const logger = {
  actingConsole: {
    error: dumpFunction,
    log: dumpFunction,
    warn: dumpFunction,
  } as Console,

  init: (console: { error: Function; log: Function; warn: Function }) => {
    logger.actingConsole = console;
    return logger;
  },
  error: (...x: any) => logger.actingConsole.error(...x),
  log: (...x: any) => logger.actingConsole.log(...x),
  warn: (...x: any) => logger.actingConsole.warn(...x),
};

// export default logger;
export default logger;
