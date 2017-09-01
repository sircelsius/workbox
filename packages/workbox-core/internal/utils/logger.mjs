import WorkboxError from '../models/WorkboxError.mjs';

/**
 * These variables should be referenced over this.LOG_LEVELS as
 * the minifier can't minify public LOG_LEVELS function.
 */
const VERBOSE_LOG_LEVEL = 0;
const DEBUG_LOG_LEVEL = 1;
const WARNING_LOG_LEVEL = 2;
const ERROR_LOG_LEVEL = 3;

const GREY = `#7f8c8d`;
const GREEN = `#2ecc71`;
const YELLOW = `#f39c12`;
const RED = `#c0392b`;

/**
 * LogHelper should be used to print to the console.
 *
 * This class will allow Workbox to log in a consistent style and
 * take advantage of console coloring and groups.
 */
class Logger {
  /**
   * Initialises the log level based on the current origin.
   */
  constructor() {
    // TODO: Set initial log level based on localhost
    this._logLevel = VERBOSE_LOG_LEVEL;
  }

  /**
   * Allows access to the log levels.
   * @return {Object} An object containing the available log levels.
   */
  get LOG_LEVELS() {
    return {
      verbose: VERBOSE_LOG_LEVEL,
      debug: DEBUG_LOG_LEVEL,
      warning: WARNING_LOG_LEVEL,
      error: ERROR_LOG_LEVEL,
    };
  }

  /**
   * A setter for the logLevel allowing the developer to define
   * which messages should be printed to the console.
   * @param {number} newLevel the new logLevel to use.
   */
  set logLevel(newLevel) {
    // TODO: Switch to Assertion class
    if (typeof newLevel !== 'number') {
      throw new WorkboxError('invalid-type', {
        paramName: 'logLevel',
        expectedType: 'number',
        value: newLevel,
      });
    }

    if (newLevel > ERROR_LOG_LEVEL ||
      newLevel < VERBOSE_LOG_LEVEL) {
      throw new WorkboxError('invalid-value', {
        paramName: 'logLevel',
        validValueDescription: `Please use a value from LOG_LEVELS, i.e ` +
          `'logLevel = LOG_LEVELS.verbose'.`,
        value: newLevel,
      });
    }

    this._logLevel = newLevel;
  }

  /**
   * If the current logLevel allows this log, it'll
   * be printed to the console with the supplied function.
   * @param {Function} logFunction
   * @param {*} logArgs
   * @param {number} minLevel
   */
  _print(logFunction, logArgs, minLevel, levelColor) {
    if (this._logLevel > minLevel) {
      return;
    }

    const initLogOutput = [
      '%c🔧',
    ];

    const logObjects = [];
    logArgs.forEach((logArg) => {
      if (logObjects.length === 0 &&typeof logArg === 'string') {
        initLogOutput.push(logArg);
      } else {
        logObjects.push(logArg);
      }
    });

    logFunction(initLogOutput.join(' '), `color: ${levelColor}`,
      ...logObjects);
  }

  /**
   * Prints to `console.log`
   */
  log(...args) {
    this._print(console.log, args, VERBOSE_LOG_LEVEL, GREY);
  }

  /**
   * Prints to `console.debug`
   */
  debug(...args) {
    this._print(console.debug, args, DEBUG_LOG_LEVEL, GREEN);
  }

  /**
   * Prints to `console.warn`
   */
  warn(...args) {
    this._print(console.warn, args, WARNING_LOG_LEVEL, YELLOW);
  }

  /**
   * Prints to `console.error`
   */
  error(...args) {
    this._print(console.error, args, ERROR_LOG_LEVEL, RED);
  }
}

export default new Logger();
