<template>
  <div>
    <h1 class="text-h5 mb-4">
      <i class="fas fa-arrow-to-right" />
      <span class="ml-3">{{ $t("planner.factory.body.import.header") }}</span>
    </h1>
    <p v-show="helpText" class="text-body-2 mb-4">
      <i class="fas fa-info-circle" /> {{ $t("planner.factory.body.import.help") }}
    </p>
    <div v-if="Object.keys(factory.rawResources).length > 0 || Object.keys(factory.parts).length > 0">
      <raw-resources :factory="factory" />
      <imports :factory="factory" :help-text="helpText" />
    </div>
    <p v-else class="text-body-1">{{ $t("planner.factory.body.import.wait") }}.</p>
  </div>
</template>

<script setup lang="ts">
  import { defineProps } from 'vue'
  import { Factory } from '@/interfaces/planner/FactoryInterface'
  import RawResources from '@/components/planner/imports/RawResources.vue'
  import Imports from '@/components/planner/imports/Imports.vue'

  defineProps<{
    factory: Factory;
    helpText: boolean;
  }>()

</script>
