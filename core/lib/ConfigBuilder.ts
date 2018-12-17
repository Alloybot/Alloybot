import * as path from 'path';
import * as fs from 'fs';
import { Logger } from './Util';

export class ConfigBuilder {
  private logger: Logger = new Logger('ConfigBuilder');
  private contents: string;
  private configDir: string;
  private configName: string;
  private configFile;
  private readonly indent: string = '  ';
  private readonly baseConfigDir: string = path.resolve(__dirname, '../config');

  public readonly directory = this.configDir;
  public readonly name = this.configName;
  public readonly version: string;

  constructor(name: string, version: string) {
    let split = name.split('/');
    this.configName = name = split.pop();
    this.version = version;

    this.configDir = path.join(this.baseConfigDir, split.join('/'));
    this.contents =
    `module.exports = {\n${this.indent}__META: {\n${this.indent}${this.indent}version: '${this.version}',\n${this.indent}${this.indent}name: '${this.configName}'\n${this.indent}}`;
  }

  private writeConfig() {
    let name = path.join(this.configDir, this.configName);
    if (!fs.existsSync(this.configDir)) fs.mkdirSync(this.configDir, { recursive: true });
    if (!fs.existsSync(`${name}.js`)) fs.writeFileSync(`${name}.js`, this.contents, 'utf8');
    this.configFile = require(path.join(this.configDir, this.configName));
    if (this.configFile.__META.version != this.version) {
      this.logger.note(`The config for ${this.configName} is out of date!\nPlease backup any changes you have made, and delete the config.\nThe latest version of the config will be regenerated on the next startup.\nLocation: ${path.join(__dirname, name)}`);
    }
  }

  public addOption(name: string, type: string[], comment?: string): void {
    if (name.includes('/')) {
      let loopIndent: string[] = [];
      let split = name.split('/');
      name = split.pop();

      while (split.length > 0) {
        if (!this.contents.endsWith(` {`) && !this.contents.endsWith(' ')) this.contents = this.contents + `,\n`;
        loopIndent.push(this.indent);
        let item = split.shift();
        this.contents = this.contents + `\n${loopIndent.join("")}${item}: {`;
      }

      this.appendOption(loopIndent.join("") + this.indent, name, type, comment);
      
      while (loopIndent.length > 0) {
        this.contents = this.contents + `\n${loopIndent.join("")}}`;
        loopIndent.pop();
      }
    } else {
      this.appendOption(this.indent, name, type, comment);
    }
  }

  private appendOption(indent, name, type, comment) {
    if (!this.contents.endsWith(` {`) && !this.contents.endsWith(' ')) this.contents = this.contents + `,\n${indent}`;
    this.contents = this.contents + `\n${indent}/**\n${indent} * @property {${type.join(' | ')}} ${name}\n${indent} * @default undefined`;
    if (comment) this.contents = this.contents + `\n${indent} * @description ${comment}\n${indent} */`;
    this.contents = this.contents + `\n${indent}${name}: undefined`;
  }

  public close() {
    this.contents = this.contents + '\n}';
    this.writeConfig();
  }

  public getConfig() {
    return this.configFile;
  }
}
