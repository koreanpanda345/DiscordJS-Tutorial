import * as winston from "winston";

const myFormat = winston.format.printf(({
	level, message, label, timestamp
}) => {
	return `${timestamp} [ ${label} ] ${level.toUpperCase()} > ${message}`;
});

export const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		winston.format.label({ label: 'Discord Bot' }),
		winston.format.timestamp(),
		myFormat
	),
	transports: [
		new winston.transports.Console(),
	]
});