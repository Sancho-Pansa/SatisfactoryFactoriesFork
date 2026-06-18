<template>
  <h1 class="text-h5">
    <i class="fas fa-power-off mr-3" /> {{ $t("statistics.power.header") }}
  </h1>
  <p v-show="helpText" class="mb-4">
    <i class="fas fa-info-circle mr-2" /> {{ $t("statistics.power.info") }}
  </p>
  <v-chip
    class="sf-chip yellow"
    variant="tonal"
  >
    <i class="fas fa-bolt" />
    <i class="fas fa-minus" />
    <span class="ml-2">{{ $t("statistics.power.consumed", { value: powerConsumed.value, unit: powerConsumed.unit }) }}</span>
  </v-chip>
  <v-chip
    class="sf-chip yellow"
    variant="tonal"
  >
    <i class="fas fa-bolt" />
    <i class="fas fa-plus" />
    <span class="ml-2">{{ $t("statistics.power.generated", { value: powerProduced.value, unit: powerProduced.unit }) }}</span>
  </v-chip>
  <v-chip
    class="sf-chip"
    :class="{
      'green': totalPower.totalPowerDifference > 0,
      'red': totalPower.totalPowerDifference < 0,
    }"
    variant="tonal"
  >
    <i class="fas fa-plug mr-2" />{{ $t("statistics.power.difference", { value: powerDifference.value, unit: powerDifference.unit }) }}
  </v-chip>
</template>

<script setup lang="ts">
  import {
    Factory,
  } from '@/interfaces/planner/FactoryInterface'
  import { calculateTotalPower } from '@/utils/statistics'
  import { formatPower } from '@/utils/numberFormatter'

  const props = defineProps<{
    factories: Factory[];
    helpText: boolean;
  }>()

  const totalPower = computed(() => calculateTotalPower(props.factories))
  const powerConsumed = computed(() => {
    return {
      value: formatPower(totalPower.value.totalPowerConsumed).value,
      unit: formatPower(totalPower.value.totalPowerConsumed).unit,
    }
  })
  const powerProduced = computed(() => {
    return {
      value: formatPower(totalPower.value.totalPowerProduced).value,
      unit: formatPower(totalPower.value.totalPowerProduced).unit,
    }
  })
  const powerDifference = computed(() => {
    return {
      value: formatPower(totalPower.value.totalPowerDifference).value,
      unit: formatPower(totalPower.value.totalPowerDifference).unit,
    }
  })
</script>
