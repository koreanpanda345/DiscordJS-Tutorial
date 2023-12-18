import { CommandInteraction, Interaction } from "discord.js";
import BaseEvent from "../../../base/BaseEvent";
import { botCache } from "../../../core/constants";
import CommandContext from "../../../contexts/CommandContext";

export default class InteractionCreateEvent extends BaseEvent {
  constructor() {
    super('interactionCreate');
  }

  public async invoke(interaction: Interaction) {
    if (interaction.isCommand()) {
      let ctx = new CommandContext(interaction as CommandInteraction);
      await botCache.startTask("time", ctx);
      await botCache.handleMonitor('slash_command', interaction);
      return;
    }
  }
}