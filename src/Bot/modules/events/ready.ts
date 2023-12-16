import BaseEvent from "../../base/BaseEvent";
import { logger } from "../../core/logger";

export default class ReadyEvent extends BaseEvent {
  constructor() {
    super('ready', true);
  }

  public async invoke() {
    logger.info('Bot is ready!');

    await import('./../../utils/deployer');
  }
}