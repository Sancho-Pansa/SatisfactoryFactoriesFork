<template>
  <v-row>
    <v-col>
      <v-btn
        class="ma-1"
        color="blue"
        :disabled="getFactories().length === 0"
        prepend-icon="fas fa-compress-alt"

        variant="tonal"
        @click="emit('hide-all')"
      >
        {{ $t("planner.globalActions.hideAll") }}
      </v-btn>
      <v-btn
        class="ma-1"
        color="blue"
        :disabled="getFactories().length === 0"
        prepend-icon="fas fa-expand-alt"

        variant="tonal"
        @click="expandAll"
      >
        {{ $t("planner.globalActions.expandAll") }}
      </v-btn>
      <v-btn
        class="ma-1"
        color="blue"
        prepend-icon="fas fa-info-circle"
        variant="tonal"
        @click="emit('toggle-help-text')"
      >
        {{ helpTextShown ? $t("planner.globalActions.hideInfo") : $t("planner.globalActions.showInfo") }}
      </v-btn>
      <v-btn
        class="ma-1"
        color="green"
        prepend-icon="fas fa-users-class"
        ripple
        variant="tonal"
        @click="eventBus.emit('introToggle', true)"
      >
        {{ $t("planner.globalActions.showIntro") }}
      </v-btn>
      <v-btn
        class="ma-1"
        color="yellow"
        prepend-icon="fas fa-file-import"
        ripple
        variant="tonal"
        @click="emit('import-world')"
      >
        {{ $t("planner.globalActions.importWorld") }}
      </v-btn>
      <v-btn
        class="ma-1"
        color="red"
        :disabled="getFactories().length === 0"
        prepend-icon="fas fa-trash"
        variant="tonal"
        @click="confirmDelete($t('planner.globalActions.clearConfirm')) && emit('clear-all')"
      >
        {{ $t("planner.globalActions.clear") }}
      </v-btn>
      <v-btn
        class="ma-1"
        color="secondary"
        :disabled="getFactories().length === 0"
        prepend-icon="fas fa-copy"
        variant="tonal"
        @click="copyPlanToClipboard"
      >
        {{ $t("planner.globalActions.copyPlan") }}
      </v-btn>
      <v-btn
        class="ma-1"
        color="secondary"
        prepend-icon="fas fa-clipboard"
        variant="tonal"
        @click="confirmReplace() && pastePlanFromClipboard()"
      >
        {{ $t("planner.globalActions.pastePlan") }}
      </v-btn>
      <templates />
      <v-btn
        class="ma-1"
        color="amber"
        :disabled="getFactories().length === 0 || disableRecalc"
        prepend-icon="fas fa-calculator-alt"
        variant="tonal"
        @click="forceRecalc"
      >
        {{ $t("planner.globalActions.recalculate.button") }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
  import { useAppStore } from '@/stores/app-store'
  import { usePowerTarget } from '@/composables/usePowerTarget'
  import { confirmDialog } from '@/utils/helpers'
  import { useI18n } from 'vue-i18n'
  import eventBus from '@/utils/eventBus'

  const { getFactories, getCurrentTab, prepareLoader, forceCalculation } = useAppStore()
  const { powerTarget } = usePowerTarget()

  const disableRecalc = ref(false)

  defineProps<{ helpTextShown: boolean }>()

  const emit = defineEmits<{
    (event: 'hide-all'): void;
    (event: 'show-all'): void;
    (event: 'toggle-help-text'): void;
    (event: 'import-world'): void;
    (event: 'clear-all'): void;
  }>()

  const confirmDelete = (message: string): boolean => {
    return confirm(message)
  }

  const confirmReplace = () => {
    if (getFactories().length === 0) return true
    return confirmDialog('This will replace your plan. Are you sure?')
  }

  const expandAll = () => {
    if (getFactories().length > 10) {
      eventBus.emit('toast', { message: 'You are expanding a lot of factories. Expect performance issues.', type: 'warning' })

      setTimeout(() => {
        emit('show-all')
      }, 250)
    } else {
      emit('show-all')
    }
  }

  const copyPlanToClipboard = () => {
    // Holistic full-tab copy: the tab name, power target and the entire factories
    // array (which itself carries products, building groups, export calculator
    // settings, tasks, notes, collapse state, sync state, etc). The tab id is
    // intentionally omitted — a paste replaces the current tab and keeps its own id.
    // Older exports were a bare Factory[] array, which paste still accepts.
    const plan = JSON.stringify({
      name: getCurrentTab()?.name,
      factories: getFactories(),
      powerTarget: powerTarget.value,
    })
    navigator.clipboard.writeText(plan)
    eventBus.emit('toast', { message: 'Plan copied to clipboard! You can save it to a file if you like, or paste it.' })
  }

  const pastePlanFromClipboard = () => {
    navigator.clipboard.readText().then(plan => {
      try {
        const parsedPlan = JSON.parse(plan)
        // Legacy blobs are a bare Factory[] array; new ones are a full tab
        // { name, factories, powerTarget }.
        const isLegacy = Array.isArray(parsedPlan)
        const factoriesToLoad = isLegacy ? parsedPlan : parsedPlan.factories
        if (!Array.isArray(factoriesToLoad)) {
          throw new Error('Plan does not contain a factories array.')
        }
        emit('clear-all')

        setTimeout(() => {
          prepareLoader(factoriesToLoad)
          // Replace the current tab's settings with the pasted plan's (keeps its id).
          if (!isLegacy) {
            powerTarget.value = Number(parsedPlan.powerTarget) || 0
            const tab = getCurrentTab()
            if (tab && parsedPlan.name) {
              tab.name = parsedPlan.name
            }
          }
        }, 250)
      } catch (err) {
        if (err instanceof Error) {
          alert(`Invalid plan. Error: ${err.message}`)
        }
      }
    })
  }

  const forceRecalc = async () => {
    const confirmText = t("planner.globalActions.recalculate.confirm")
    const confirmed = confirmDialog(confirmText)

    if (!confirmed) return

    eventBus.emit('toast', { message: t("planner.globalActions.recalculate.toast"), type: 'warning' })
    eventBus.emit('plannerShow', false)
    disableRecalc.value = true

    // Wait for planner to comply
    await new Promise(resolve => setTimeout(resolve, 250))
    forceCalculation()

    console.log('Calculations completed, telling planner to show')
    eventBus.emit('plannerShow', true)
    eventBus.emit('toast', { message: t("planner.globalActions.recalculate.completionToast"), type: 'success' })
  }

  eventBus.on('calculationsCompleted', () => {
    disableRecalc.value = false
  })
</script>

<style lang="scss" scoped>
v-list-item {
  margin-bottom: 10px;
  :last-child {
    margin-bottom: 0;
  }
}
</style>
