/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import '@/assets/styles/global.scss'
import { applySfColorVars } from '@/utils/colors'
import { inject } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'
import { createI18n } from 'vue-i18n'
import en from './i18n/en.json'
import ru from './i18n/ru.json'
import { ru as ruRule } from './i18n/pluralization'

// Publish the semantic colour tokens as --sf-* CSS variables before mount so the
// first paint already resolves them (global.scss references var(--sf-*)).
applySfColorVars()

inject()
injectSpeedInsights()

const app = createApp(App)

const i18n = createI18n({
  legacy: false,
  locale: 'ru',
  fallbackLocale: 'en',
  pluralRules: {
    ru: ruRule,
  },
  messages: {
    en,
    ru,
  },
})

registerPlugins(app)

app.use(i18n)
app.mount('#app')
