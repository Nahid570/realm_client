import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  studentData: (data) => ipcRenderer.invoke('student', data)
})
