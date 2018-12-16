import * as path from 'path';
import * as fs from 'fs';
import { Logger } from './Util';

export class ConfigBuilder {
  private logger: Logger = new Logger('ConfigBuilder');
  private contents: string;
  private configDir: string;
  private readonly indent: string = '    ';
  private readonly baseConfigDir: string = path.resolve(__dirname, '../config');

  public readonly directory = this.configDir;

  constructor(name: string) {
    let split = name.split('/');
    name = split.pop();

    this.configDir = path.join(this.baseConfigDir, split.join('/'));
    this.newConfig(name);
    this.contents =
    `/** Configuration for ${name} **/\n
    module.exports = {`
  }

  private newConfig(name: string) {
    name = path.join(this.configDir, name);
    if (!fs.existsSync(this.configDir)) fs.mkdirSync(this.configDir);
    fs.writeFileSync(`${name}.js`, '', 'utf8');
  }

  public addOption(name: string, type: string[], value: any = null, comment?: string): void {
    if (name.includes('/')) {
      let loopIndent = '';
      let split = name.split('/');
      name = split.pop();

      while (split.length > 0) {
        loopIndent += this.indent;
        let item = split.shift();
        this.contents += `\n${loopIndent}${item}: {`;
      }

      this.appendOption(loopIndent + this.indent, name, type, value, comment);
      split = loopIndent.split(this.indent);
      
      while (split.length > 0) {
        this.contents += `\n${split.join('')}}`;
        split.shift();
      }
    }
  }

  private appendOption(...args) {
    if (!this.contents.endsWith(` {`)) this.contents += `,\n${args[0]}`;
    this.contents += `\n${args[0]}/** Allowed Types: ${args[2].join(', ')} **/`;
    if (args[4]) this.contents += `\n${args[0]}/** ${args[4]} **/\n`;
    this.contents += `\n${args[0]}${args[1]}: ${args[3]}`;
  }

  public close() {
    this.contents += '}';
  }
}
