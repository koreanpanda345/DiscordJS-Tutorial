import { Collection, CommandInteraction } from "discord.js";
import { FolderPath, botCache, discord } from "./constants";
import { logger } from "./logger";
import { glob } from "glob";
import BaseCommand from "../base/BaseCommand";
import BaseEvent from "../base/BaseEvent";
import CommandContext from "../contexts/CommandContext";

export class CacheManager {
  private _commands: Collection<string, BaseCommand> = new Collection();
  private _events: Collection<string, BaseEvent> = new Collection();
  private _monitors: Collection<string, any> = new Collection();
  private _tasks: Collection<string, any> = new Collection();


  public async loadCommands() {
    logger.info("Loading Commands....");
    const pth = this.createPath(FolderPath.COMMAND_FOLDER);
    const files = glob.sync(pth);

    for (let file of files) {
      const { default: cmd } = await import(this.fixPath(file));
      const command = new cmd() as BaseCommand;

      if(!this._commands.has(command.name)) this._commands.set(command.name, command);
    }

    logger.info(`Successfully loaded ${this._commands.size} commands!`);
  }

  public async handleCommand(name: string, interaction: CommandInteraction) {
    try {
      let command = this._commands.get(name);

      if (!command) {
        logger.warn(`Command ${name} doesn't exist`);
        return null;
      }

      if(command.disabled) {
        await interaction.reply({
          ephemeral: true,
          content: `Command \`${name}\` is disabled at the moment. Please try again later!`
        });
        return;
      }

      let ctx = new CommandContext(interaction);

      await command.invoke(ctx);
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  public async loadEvents() {
    logger.info("Loading Events....");
    const pth = this.createPath(FolderPath.EVENT_FOLDER);
    const files = glob.sync(pth);

    for (let file of files) {
      const { default: evt } = await import(this.fixPath(file));
      const event = new evt() as BaseEvent;

      if(!this._events.has(event.name)) this._events.set(event.name, event);
    }

    logger.info(`Successfully loaded ${this._events.size} events!`);
  }

  public async handleEvent(name: string) {
    try {
      let event = this._events.get(name);

      if (!event) {
        logger.warn(`Event ${name} doesn't exist`);
        return;
      }

      if (event.disabled) {
        logger.warn(`Event ${event.name} is disabled!`);
        return;
      }

      if (event.onlyOnce) discord.once(event.name, async (...args) => await event?.invoke(...args));
      else discord.on(event.name, async (...args) => await event?.invoke(...args));
    } catch(error) {
      logger.error(error);
      return null;
    }
  }

  public get commands() { return this._commands; }
  public get events() { return this._events; }

  private createPath(dir: string) {
    return `./${FolderPath.ROOT_FOLDER}/${FolderPath.MODULES_FOLDER}/${dir}/**/*.ts`;
  }

  private fixPath(path: string) {
    let newPath = path.replace(/\\/g, "/");
    return newPath.replace(FolderPath.ROOT_FOLDER, "..");
  }
}