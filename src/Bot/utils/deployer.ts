import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";
import { botCache, discord } from "../core/constants";
import { logger } from "../core/logger";


const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
botCache.commands.forEach((x) => {
  commands.push(x.data.toJSON());
});

const rest = new REST({ version: '10'}).setToken(process.env.DISCORD_BOT_TOKEN as string);

(async () => {
  try {
    logger.info(`Started refreshing ${commands.length} application (/) commands.`);
    const data: any = await rest.put(Routes.applicationGuildCommands(discord.user?.id as string, process.env.DEV_GUILD_ID as string), { body: commands });
    logger.info(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    logger.error(error);
    return null;
  }
})();