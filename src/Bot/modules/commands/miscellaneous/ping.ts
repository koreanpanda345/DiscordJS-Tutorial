import { SlashCommandBuilder } from "discord.js";
import BaseCommand from "../../../base/BaseCommand";
import CommandContext from "../../../contexts/CommandContext";
import { botCache } from "../../../core/constants";

export default class PingCommand extends BaseCommand {
  constructor() {
    super(new SlashCommandBuilder().setName("ping").setDescription("Pong!"));
  }

  public async invoke(ctx: CommandContext) {
    botCache.createTask("time", async (ctx: CommandContext) => {
      setTimeout(async () => {
        await ctx.sendMessageToChannel({
          content: "Hello!"
        });
        return true;
      }, 10000);
      return true;
    });
    ctx.sendMessageToReply({
      content: "Pong!",
    });

  }
}