import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  // base: '/ToDo_APP/',
  base: '/',
  plugins: [react()
    ,tailwindcss()],


  server: {
    proxy: {
      '/tasks': 'http://localhost:3000',
    },
  },
})