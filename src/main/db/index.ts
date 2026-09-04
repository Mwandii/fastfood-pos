import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'path'

const dbPath = path.join(app.getPath('userData'), 'fastfood-pos.db')

export const db: Database.Database = new Database(dbPath)

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')