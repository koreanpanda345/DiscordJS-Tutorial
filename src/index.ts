require('dotenv').config();
import { botCache, discord } from "./Bot/core/constants";

(async () => {
  await botCache.loadCommands();
  await botCache.loadEvents();
  await botCache.loadMiddleware();
  await botCache.loadMonitors();

  // Handle Events
  botCache.events.forEach(async (x) => {
    await botCache.handleEvent(x.name);
  })

  discord.login(process.env.DISCORD_BOT_TOKEN);
})();