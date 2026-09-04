import { ElectronAPI } from '@electron-toolkit/preload'

interface Api {
  ping: () => Promise<{ message: string; sqliteVersion: unknown }>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}