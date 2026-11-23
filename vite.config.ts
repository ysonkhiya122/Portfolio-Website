import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

/**
 * Injects <link rel="preload"> for the fonts used above the fold.
 *
 * Font files are emitted with content hashes, so the href cannot be
 * hardcoded in index.html. Preloading the two latin subsets removes the
 * layout shift measured when the webfont swapped in after first paint
 * (Lighthouse CLS was 0.164, all of it the hero stat row re-wrapping).
 */
function preloadFonts(patterns: RegExp[]): Plugin {
  return {
    name: 'preload-critical-fonts',
    enforce: 'post',
    transformIndexHtml(html, ctx) {
      const bundle = ctx.bundle
      if (!bundle) return html

      const hrefs = Object.keys(bundle)
        .filter((file) => file.endsWith('.woff2'))
        .filter((file) => patterns.some((pattern) => pattern.test(file)))

      if (hrefs.length === 0) return html

      const tags = hrefs.map((href) => ({
        tag: 'link',
        attrs: {
          rel: 'preload',
          href: `/${href}`,
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
        },
        injectTo: 'head-prepend' as const,
      }))

      return { html, tags }
    },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    preloadFonts([
      /-latin-(wght-)?normal-[\w-]+\.woff2$/,
      /jetbrains-mono-latin-400-normal-[\w-]+\.woff2$/,
    ]),
  ],

  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },

  css: {
    preprocessorOptions: {
      scss: {
        // Tokens are available to every module without an @use line.
        additionalData: `@use "@/styles/tokens" as *;`,
        // Modern Sass API only — silences the legacy-JS-API deprecation
        // and keeps the build future-proof.
        api: 'modern-compiler',
      },
    },
  },

  server: {
    host: '0.0.0.0',
    port: 5173,
    // Preview hosts are proxied in sandboxed environments.
    allowedHosts: ['.e2b.app', 'localhost'],
    // Never expose the dev server to the network with a permissive
    // origin policy; Vite's default is already restrictive, spelled out
    // here so a future edit has to be deliberate.
    cors: { origin: /^https?:\/\/(localhost|127\.0\.0\.1|[\w-]+\.e2b\.app):\d+$/ },
  },

  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: ['.e2b.app', 'localhost'],
  },

  build: {
    target: 'es2022',
    cssTarget: 'chrome111',
    sourcemap: mode !== 'production' ? true : 'hidden',
    // Warn early if a single chunk gets heavy.
    chunkSizeWarningLimit: 180,
    rollupOptions: {
      output: {
        // Deterministic, immutable-hash filenames for long-cache safety.
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) {
            return 'react'
          }
          return undefined
        },
      },
    },
  },

  // Strip console/debugger from production without shipping a plugin.
  esbuild: mode === 'production' ? { drop: ['console', 'debugger'] } : {},

  test: undefined,
}))
