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
import { inject } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'
import { createI18n } from 'vue-i18n'

inject()
injectSpeedInsights()

const app = createApp(App)

const i18n = createI18n( {
  legacy: false,
  locale: "ru",
  fallbackLocale: "en",
  messages: {
    en: {
      navigation: {
        planner: "Planner",
        graph: "Graph (WIP)",
        recipes: "Recipes",
        changelog: "Change Log"
      }
    },
    ru: {
      navigation: {
        planner: "Планировщик",
        graph: "Схема",
        recipes: "Рецепты",
        changelog: "История изменений"
      }
    }
  }
});

registerPlugins(app)

app.use(i18n)
app.mount('#app')
