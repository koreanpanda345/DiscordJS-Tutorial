import { Collection, CommandInteraction } from "discord.js";
import { FolderPath, botCache, discord } from "./constants";
import { logger } from "./logger";
import { glob } from "glob";
import BaseCommand from "../base/BaseCommand";
import BaseEvent from "../base/BaseEvent";
import CommandContext from "../contexts/CommandContext";
import BaseMiddleware from "../base/BaseMiddleware";
import BaseMonitor from "../base/BaseMonitor";

export class CacheManager {
  private _commands: Collection<string, BaseCommand> = new Collection();
  private _events: Collection<string, BaseEvent> = new Collection();
  private _middleware: Collection<string, BaseMiddleware> = new Collection();
  private _monitors: Collection<string, BaseMonitor> = new Collection();
  private _tasks: Collection<string, (...args: any[]) => Promise<boolean>> = new Collection();


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
  public findCommand(name: string) {
    return this._commands.get(name);
  }
  public async handleCommand(command: BaseCommand, interaction: CommandInteraction) {
    try {
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

  public async loadMiddleware() {
    logger.info(`Loading Middlewares....`);
    const pth = this.createPath(FolderPath.MIDDLEWARE_FOLDER);
    const files = glob.sync(pth);

    for (let file of files) {
      const { default: mid } = await import(this.fixPath(file));
      const middleware = new mid() as BaseMiddleware;

      if(!this._middleware.has(middleware.name)) this._middleware.set(middleware.name, middleware);
    }
    logger.info(`Successfully loaded ${this._middleware.size} middlewares.`);
  }

  public async handleMiddleware(name: string, ...args: any[]) {
    try {
      let middleware = this._middleware.get(name);

      if(!middleware) {
        logger.warn(`Middleware ${name} doesn't exist`);
        return;
      }

      if (middleware.disabled) {
        logger.warn(`Middleware ${middleware.name} is disabled`);
        return;
      }

      let result = await middleware.invoke(...args);

      if(!result) return;

      await middleware.next(...args);
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  public async loadMonitors() {
    logger.info(`Loading Monitors....`);
    const pth = this.createPath(FolderPath.MONITOR_FOLDER);
    const files = glob.sync(pth);

    for (let file of files) {
      const { default: mon } = await import(this.fixPath(file));
      const monitor = new mon as BaseMonitor;

      if (!this._monitors.has(monitor.name)) this._monitors.set(monitor.name, monitor);
    }

    logger.info(`Successfully loaded ${this._monitors.size} monitors`);
  }

  public async handleMonitor(name: string, ...args: any[]) {
    try {
      let monitor = this._monitors.get(name);

      if(!monitor) {
        logger.warn(`Monitor ${name} doesn't exist`);
        return;
      }

      if(monitor.disabled) {
        logger.warn(`Monitor ${name} is disabled`);
        return;
      }

      await monitor.invoke(...args);
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  public createTask(name: string, task: (...args: any[]) => Promise<boolean>) {
    if(!this._tasks.has(name)) this._tasks.set(name, task);
  }

  public async startTask(name: string, ...args: any[]) {
    try {
      let task = await this._tasks.get(name);

      if(!task) {
        logger.warn(`Task ${name} doesn't exist`);
        return;
      }

      await task(...args);
    } catch (error) {
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