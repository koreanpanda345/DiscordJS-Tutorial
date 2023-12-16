import { Interaction } from "discord.js";
import BaseEvent from "../../../base/BaseEvent";
import { botCache } from "../../../core/constants";

export default class InteractionCreateEvent extends BaseEvent {
  constructor() {
    super('interactionCreate');
  }

  public async invoke(interaction: Interaction) {
    if (interaction.isCommand()) {
      await botCache.handleCommand(interaction.commandName, interaction);
      return;
    }
  }
}