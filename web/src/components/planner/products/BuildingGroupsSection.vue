<template>
  <div class="mb-2">
    <v-btn
      :id="`${idPrefix}-building-groups-toggle`"
      block
      :color="item.buildingGroupsHaveProblem ? 'red' : 'green'"
      :disabled="disabled"
      size="small"
      variant="tonal"
      @click="toggleBuildingGroupTray(item)"
    >
      <span class="mr-2">
        <span v-if="item.buildingGroupsTrayOpen"><i class="fas fa-chevron-up" /></span>
        <span v-else><i class="fas fa-chevron-down" /></span>
      </span>
      <i class="fas fa-layer-group" />
      <span v-if="item.buildingGroupsHaveProblem" class="ml-2">
        <i class="fas fa-exclamation-triangle" /> {{ $t('planner.factory.productsAndPower.buildingGroups.problem') }}
      </span>
      <span v-else class="ml-2">
        {{ $t(
          'planner.factory.productsAndPower.buildingGroups.header',
          {
            action: item.buildingGroupsTrayOpen ? $t('planner.factory.productsAndPower.buildingGroups.headerClose') : $t('planner.factory.productsAndPower.buildingGroups.headerOpen'),
            num: item.buildingGroups.length
          })
        }}
        <tooltip-info :is-caption="false" :text="introTooltip" />
      </span>
      <span class="ml-3 d-inline-flex align-center">
        <tooltip :text="$t('planner.factory.productsAndPower.buildingGroups.powerShardsTooltip', {noun: itemNoun})">
          <game-asset height="18px" subject="power-shard" type="item_id" width="18px" />
        </tooltip>
        <span :id="`${idPrefix}-power-shards-total`" class="ml-1">{{ getTotalPowerShards(item.buildingGroups) }}</span>
      </span>
      <span v-if="type === ItemType.Product || somersloopBuildCost > 0" class="ml-3 d-inline-flex align-center">
        <tooltip :text="somersloopTooltip">
          <game-asset height="18px" subject="somersloop" type="item_id" width="18px" />
        </tooltip>
        <span :id="`${idPrefix}-somersloops-total`" class="ml-1">{{ getTotalSomersloops(item.buildingGroups, building) }}</span>
      </span>
    </v-btn>
    <div v-if="item.buildingGroupsTrayOpen" class="mt-2 buildingGroups" :class="item.buildingGroupsHaveProblem ? 'problem' : ''">
      <building-groups
        :building="building"
        :factory="factory"
        :item="item"
        :type="type"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { Factory, FactoryItem, FactoryPowerProducer, ItemType } from '@/interfaces/planner/FactoryInterface'
  import { getTotalPowerShards, toggleBuildingGroupTray } from '@/utils/factory-management/building-groups/common'
  import { getSomersloopBuildCost, getTotalSomersloops } from '@/utils/factory-management/building-groups/somersloops'
  import { useI18n } from 'vue-i18n'

  const props = defineProps<{
    factory: Factory
    item: FactoryItem | FactoryPowerProducer
    building: string
    type: ItemType
    idPrefix: string
    disabled?: boolean
  }>()

  const { t } = useI18n()

  const itemNoun = computed(() => props.type === ItemType.Product ? t('planner.factory.productsAndPower.buildingGroups.tooltipNounProduct') : t('planner.factory.productsAndPower.buildingGroups.tooltipNounProducer'))

  const somersloopBuildCost = computed(() => getSomersloopBuildCost(props.building))

  const somersloopTooltip = computed(() => somersloopBuildCost.value > 0
    ? t('planner.factory.productsAndPower.buildingGroups.somersloopsToBuild', { num: somersloopBuildCost.value })
    : t('planner.factory.productsAndPower.buildingGroups.somersloopsTotal'),
  )

  const introTooltip = computed(() => props.type === ItemType.Product
    ? t('planner.factory.productsAndPower.buildingGroups.productIntroTooltip')
    : t('planner.factory.productsAndPower.buildingGroups.producerIntroTooltip'),
  )
</script>
