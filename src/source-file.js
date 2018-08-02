const fs = require('fs');
const promisify = require('pify');
const VFile = require('vfile');

const fsP = promisify(fs);

class SourceFile extends VFile {
  static readFileSync(path) {
    const contents = fs.readFileSync(path, 'utf8');
    return new SourceFile({ path, contents });
  }

  static async readFile(path) {
    const contents = await fsP.readFile(path, 'utf8');
    return new SourceFile({ path, contents });
  }

  constructor() {
    super();
    this.types = {};
    this.statistic = {
      errors: 0,
      warnings: 0,
      info: 0,
      total: 0,
    };
  }

  // TODO: Pass either object or regular arguments
  message(...args) {
    this.statistic.warnings += 1;
    this.statistic.total += 1;

    return super.message.apply(this, args);
  }

  warning(...args) {
    return this.message(...args);
  }

  info(...args) {
    this.statistic.info += 1;
    this.statistic.total += 1;

    return super.info.apply(this, args);
  }

  error(...args) {
    this.statistic.errors += 1;
    this.statistic.total += 1;

    try {
      super.fail.apply(this, args);
    } catch (message) {
      // VFile.fail throws the message, so we catch and return it
      return message;
    }
  }
}

module.exports = SourceFile;
