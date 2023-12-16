export default abstract class BaseEvent {
  private _name: string;
  private _disabled: boolean;
  private _onlyOnce: boolean;

  constructor(name: string, onlyOnce: boolean  = false, disabled: boolean = false) {
    this._name = name;
    this._disabled = disabled;
    this._onlyOnce = onlyOnce;
  }

  public async invoke(...args: any[]) {
    "Not yet implemented"
  }

  public get name() { return this._name; }
  public get disabled() { return this._disabled; }
  public get onlyOnce() { return this._onlyOnce; }

  public set disabled(disabled: boolean) {
    this._disabled = disabled;
  }
}