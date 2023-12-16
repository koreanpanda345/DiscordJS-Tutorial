import { CommandInteraction, CommandInteractionOptionResolver, InteractionReplyOptions, MessageCreateOptions, MessagePayload } from "discord.js";

export default class CommandContext {
  private _interaction: CommandInteraction;
  private _args: CommandInteractionOptionResolver;

  constructor(interaction: CommandInteraction) {
    this._interaction = interaction;
    this._args = interaction.options as CommandInteractionOptionResolver;
  }


  public async sendMessagToAuthor(options: string | MessagePayload | MessageCreateOptions) {
    let dm = await this._interaction.user.createDM();
    await dm.send(options);
  }

  public async sendMessageToChannel(options: string | MessagePayload | MessageCreateOptions) {
    return this._interaction.channel?.send(options);
  }

  public async sendMessageToReply(options: InteractionReplyOptions) {
    return this._interaction.reply(options);
  }

  public get interaction() {
    return this._interaction;
  }

  public get args() {
    return this._args;
  }
}