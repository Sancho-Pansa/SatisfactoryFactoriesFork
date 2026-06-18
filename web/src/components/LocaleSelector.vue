<template>
  <v-select
    v-model="$i18n.locale"
    :label="$t('language.self')"
    :items="locales"
    item-title="name"
    item-value="code"
    density="compact"
    single-line>
  </v-select>
</template>

<script setup lang="ts">
  import { ref } from "vue";

  const locales = ref([
    { code: "ru", name: "Русский" },
    { code: "en", name: "English" }
  ]);
</script>
