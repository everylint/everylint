import fs from 'fs';
import promisify from 'pify';
import VFile from 'vfile';

const fsP = promisify(fs);

export default class SourceFile extends VFile {
  static readFileSync(path) {
    const contents = fs.readFileSync(path, 'utf8');
    return new SourceFile({ path, contents });
  }

  static async readFile(path) {
    const contents = await fsP.readFile(path, 'utf8');
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
