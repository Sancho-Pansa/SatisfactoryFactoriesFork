import { createI18n } from "vue-i18n"
import ru from "@/locales/ru_RU.json"
import en from "@/locales/en_US.json"

export default createI18n({
    locale: "en",
    fallbackLocale: "en",
    legacy: false,
    globalInjection: true,
    messages: {
        en,
        ru
    }
})