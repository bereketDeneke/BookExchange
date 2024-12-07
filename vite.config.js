import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';
import fullReload from 'vite-plugin-full-reload';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default defineConfig({
  plugins: [
    eslintPlugin({
      include: ['pages/*.js', 'pages/**/*.js', 'utils/*.js'], // Run ESLint on these files
    }),
    fullReload(['src/styles/**/*.scss']), // Watch SCSS files in the styles directory
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/global.scss";`, // Include global styles
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './styles'),
    },
  },
});
