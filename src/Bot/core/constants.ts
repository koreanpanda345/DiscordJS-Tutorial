import { Client, IntentsBitField } from "discord.js";
import { CacheManager } from "./cache";

export const discord = new Client({
  intents: IntentsBitField.Flags.MessageContent | IntentsBitField.Flags.Guilds,
});

export const botCache = new CacheManager();

export enum FolderPath {
  MODULES_FOLDER = "modules",
  ROOT_FOLDER = "src/Bot",
  COMMAND_FOLDER = "commands",
  EVENT_FOLDER = "events",
  MIDDLEWARE_FOLDER = "middlewares",
  MONITOR_FOLDER = "monitors",
  TASK_FOLDER = "tasks",
}