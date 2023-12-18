import { CommandInteraction } from "discord.js";
import BaseCommand from "../../../base/BaseCommand";
import BaseMiddleware from "../../../base/BaseMiddleware";
import CommandContext from "../../../contexts/CommandContext";

export default class CommandPermissionMiddleware extends BaseMiddleware {
  constructor() {
    super(
      'command_permissions',
      async (command: BaseCommand, interaction: CommandInteraction) => {

        let ctx = new CommandContext(interaction);

        await command.invoke(ctx);
      });
  }


  public async invoke(command: BaseCommand, interaction: CommandInteraction) {
    if (command.userPermissions.length > 0) {
      const member = await interaction.guild!.members.fetch(interaction.user.id);

      for (let perms of command.userPermissions) {
        if (!member.permissions.has(perms)) {
          await interaction.reply({
            ephemeral: true,
            content: `You do not have permission to use this command. You must have the permission of \`${perms}\`!`,
          })
          return false;
        }
      }
    }

    if (command.selfPermissions.length > 0) {
      const me = await interaction.guild?.members.fetchMe();

      for (let perms of command.selfPermissions) {
        if (!me?.permissions.has(perms)) {
          await interaction.reply({
            ephemeral: true,
            content: `I do not have the correct permissions to do this. I must have the permission of \`${perms}\`!`,
          });
          return false;
        }
      }
    }
    return true;
  }
}