export default abstract class BaseMiddleware {
  private _name: string;
  private _disabled: boolean;
  private _next: (...args: any[]) => Promise<unknown>;

  constructor(name: string, next: (...args: any[]) => Promise<unknown>, disabled: boolean = false) {
    this._name = name;
    this._next = next;
    this._disabled = disabled;
  }

  public async invoke(...args: any[]): Promise<boolean> {
    return true;
  }

  public get name() { return this._name; }
  public get next() { return this._next; }
  public get disabled() { return this._disabled; }

  public set disabled(disabled: boolean) {
    this._disabled = disabled;
  }
}