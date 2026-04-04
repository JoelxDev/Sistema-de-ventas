import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // port: 5000,
    allowedHosts: [
      'eb12-2001-1388-61e3-4b8b-598d-f6c8-c6b2-f346.ngrok-free.app'
    ]
  }
})
