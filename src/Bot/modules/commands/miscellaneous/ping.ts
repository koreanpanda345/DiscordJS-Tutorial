import { SlashCommandBuilder } from "discord.js";
import BaseCommand from "../../../base/BaseCommand";
import CommandContext from "../../../contexts/CommandContext";

export default class PingCommand extends BaseCommand {
  constructor() {
    super(new SlashCommandBuilder().setName("ping").setDescription("Pong!"));
  }

  public async invoke(ctx: CommandContext) {
    ctx.sendMessageToReply({
      content: "Pong!",
    });
  }
}