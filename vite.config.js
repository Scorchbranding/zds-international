import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  base: './',
  appType: 'mpa',
  server: {
    host: true,
    port: 5173,
  },
  plugins: [
    {
      name: 'rewrite-public-css-urls',
      generateBundle(_opts, bundle) {
        for (const file of Object.values(bundle)) {
          if (file.type === 'asset' && file.fileName.endsWith('.css')) {
            const source = typeof file.source === 'string' ? file.source : file.source.toString()
            file.source = source.replaceAll('url(/images/', 'url(../images/')
          }
        }
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        apply: resolve(__dirname, 'apply.html'),
        drivers: resolve(__dirname, 'drivers.html'),
        news: resolve(__dirname, 'news.html'),
        thankYou: resolve(__dirname, 'thank-you.html'),
      },
    },
  },
})
