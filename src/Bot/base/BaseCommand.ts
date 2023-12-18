import { PermissionResolvable, SlashCommandBuilder } from "discord.js";
import CommandContext from "../contexts/CommandContext";

export default abstract class BaseCommand {
  private _slashData: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  private _disabled: boolean;
  private _userPermissions: PermissionResolvable[];
  private _selfPermissions: PermissionResolvable[];

  constructor(slashData: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">, disabled: boolean = false) {
    this._slashData = slashData;
    this._disabled = disabled;
    this._userPermissions = [];
    this._selfPermissions = [];
  }

  public async invoke(ctx: CommandContext) {
    "Not implemented yet.";
  }

  public get name() { return this._slashData.name; }
  public get toJSON() { return this._slashData.toJSON(); }
  public get data() { return this._slashData; }
  public get disabled() { return this._disabled; }
  public get userPermissions() { return this._userPermissions; }
  public get selfPermissions() { return this._selfPermissions; }

  public set disabled(disabled: boolean) {
    this._disabled = disabled;
  }
  public set userPermissions(perms: PermissionResolvable[]) {
    this._userPermissions = perms;
  }
  public set selfPermissions(perms: PermissionResolvable[]) {
    this._selfPermissions = perms;
  }
}