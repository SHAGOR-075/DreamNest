import fs from 'fs'
import path from 'path'
import { config } from '../config/config.js'

const logDir = 'logs'
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

const getLogFileName = (type) => {
  const date = new Date().toISOString().split('T')[0]
  return path.join(logDir, `${type}-${date}.log`)
}

const formatLogMessage = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString()
  const metaString = Object.keys(meta).length > 0 ? JSON.stringify(meta) : ''
  return `[${timestamp}] ${level.toUpperCase()}: ${message} ${metaString}\n`
}

const writeLog = (level, message, meta = {}) => {
  const logMessage = formatLogMessage(level, message, meta)
  
  // Console output in development
  if (config.NODE_ENV === 'development') {
    console.log(logMessage.trim())
  }
  
  // File output
  const fileName = getLogFileName(level)
  fs.appendFileSync(fileName, logMessage)
}

export const logger = {
  info: (message, meta = {}) => writeLog('info', message, meta),
  warn: (message, meta = {}) => writeLog('warn', message, meta),
  error: (message, meta = {}) => writeLog('error', message, meta),
  debug: (message, meta = {}) => {
    if (config.NODE_ENV === 'development') {
      writeLog('debug', message, meta)
    }
  }
}
