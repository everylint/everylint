import fs from 'fs';
import VFile from 'vfile';

export default class SourceFile extends VFile {
  static readFileSync(path) {
    const contents = fs.readFileSync(path, 'utf8');
    return new SourceFile({ path, contents });
  }

  static readFile(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, 'utf8', (err, content) => {
        if (err) return reject(err);
        return resolve(content);
      });
    });
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
