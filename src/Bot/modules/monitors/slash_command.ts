import { CommandInteraction } from "discord.js";
import BaseMonitor from "../../base/BaseMonitor";
import { botCache } from "../../core/constants";
import { logger } from "../../core/logger";

export default class SlashCommandMonitor extends BaseMonitor {
  constructor() {
    super('slash_command');
  }

  public async invoke(interaction: CommandInteraction) {
    try {
      let command = botCache.findCommand(interaction.commandName);

      if (!command) {
        logger.warn(`Slash Command ${interaction.commandName} doesn't seem to exist.`);
        return;
      }

      await botCache.handleMiddleware('command_permissions', command, interaction);
    } catch (error) {
      logger.error(error);
      return;
    }

  }
}