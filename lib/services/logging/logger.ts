import("@/envConfig")
import { format } from "date-fns"
import pino from 'pino';
import type { TransportPipelineOptions, TransportTargetOptions } from 'pino';
import fs from 'fs';
import path from 'path';
import { config } from "@/lib/config"

const LOG_DIRECTORY = path.join(process.cwd(), 'logs');
const LOG_FILE_RETENTION_DAYS = parseInt(config.server.logFileRetention);

if (!fs.existsSync(LOG_DIRECTORY)) {
  fs.mkdirSync(LOG_DIRECTORY, { recursive: true });
}

const logFileName = format(new Date(), 'yyyy-MM-dd') + '.log';
const logFilePath = path.join(LOG_DIRECTORY, logFileName);

const isDevelopment = process.env.NODE_ENV !== 'production';


type CustomTransportTargetOptions = TransportTargetOptions | TransportPipelineOptions;

const prodFileTarget: TransportTargetOptions =   {
    target: 'pino/file',
    options: {
      destination: logFilePath,
      append: true,
      mkdir: true,
    },
  }
const devFileTarget: TransportTargetOptions = {
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'SYS:standard',
  },
}
const targets:  CustomTransportTargetOptions[] = isDevelopment ? [devFileTarget] : [];



export const logger = pino(
  pino.transport({
    targets,
  })
);

export function cleanupOldLogs(retentionDays = LOG_FILE_RETENTION_DAYS) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

  fs.readdirSync(LOG_DIRECTORY).forEach((file) => {
    const filePath = path.join(LOG_DIRECTORY, file);
    const fileStats = fs.statSync(filePath);

    if (fileStats.mtime < cutoffDate) {
      fs.unlinkSync(filePath);
      logger.info(`Deleted old log file: ${file}`);
    }
  });
}

