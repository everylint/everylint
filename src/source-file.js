import fs from 'fs';
import VFile from 'vfile';

export default class SourceFile extends VFile {
  static readSync(path) {
    const contents = fs.readFileSync(path, 'utf8');
    return new SourceFile({ path, contents });
  }

  warning(...args) {
    return super.message.apply(this, args);
  }

  error(...args) {
    try {
      super.fail.apply(this, args);
    } catch (message) {
      // VFile.fail throws the message, so we catch and return it
      return message;
    }
  }
}
