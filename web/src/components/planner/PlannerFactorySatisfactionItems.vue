<template>
  <v-table class="rounded border-md sub-card">
    <thead>
      <tr>
        <th class="text-h6 text-left border-e-md" scope="row">
          <i class="fas fa-box" /><span class="ml-2">{{ $t("planner.factory.satisfaction.item") }}</span>
        </th>
        <th class="d-flex text-h6 border-e-md align-center justify-center" scope="row">
          <i class="fas fa-abacus" /><span class="ml-2">{{ $t("planner.factory.satisfaction.satisfaction") }}</span>
          <tooltip-info :text="$t('planner.factory.satisfaction.help')" />
        </th>
        <th class="text-h6 text-center" scope="row">
          <i class="fas fa-truck-container" /><span class="ml-2">{{ $t("planner.factory.satisfaction.exports") }}</span>
        </th>
        <th class="text-h6 text-center" scope="row" />
      </tr>
    </thead>
    <tbody>
      <template v-for="(part, partId) in filteredParts" :key="partId">
        <tr>
          <td class="border-e-md name" :class="satisfactionShading(part)">
            <div class="d-flex justify-space-between">
              <div class="d-flex align-center" :class="classes(part)">
                <game-asset
                  clickable
                  height="48"
                  :subject="partId.toString()"
                  type="item"
                  width="48"
                />
                <span v-if="part.satisfied" class="ml-2">
                  <v-icon icon="fas fa-check" />
                </span>
                <span v-else class="ml-2">
                  <v-icon icon="fas fa-times" />
                </span>
                <div class="ml-2 text-body-1">
                  <div>
                    <b>{{ getPartDisplayName(partId.toString()) }}</b>
                  </div>
                  <v-chip v-if="showProductChip(factory, partId.toString())" class="sf-chip blue x-small mr-2">
                    {{ $t("planner.factory.satisfaction.product") }}
                  </v-chip>
                  <v-chip v-if="showByProductChip(factory, partId.toString())" class="sf-chip byproduct x-small mr-2">
                    {{ $t("planner.factory.satisfaction.byproduct") }}
                  </v-chip>
                  <v-tooltip v-if="showRecycledChip(factory, partId.toString())" bottom>
                    <template #activator="{ props: activatorProps }">
                      <v-chip v-bind="activatorProps" class="sf-chip green x-small mr-2">
                        <span class="mr-1">{{ $t("planner.factory.satisfaction.recycled") }}</span> <i class="fas fa-info-circle" />
                      </v-chip>
                    </template>
                    <i18n-t keypath="planner.factory.satisfaction.recycledTooltip" tag="span">
                      <template #br><br></template>
                    </i18n-t>
                  </v-tooltip>
                  <v-chip v-if="showImportedChip(factory, partId.toString())" class="sf-chip import x-small mr-2">
                    {{ $t("planner.factory.satisfaction.imported") }}
                  </v-chip>
                  <v-chip v-if="showRawChip(factory, partId.toString())" class="sf-chip cyan x-small mr-2">
                    {{ $t("planner.factory.satisfaction.raw") }}
                  </v-chip>
                  <v-chip v-if="showUnpackagedChip(factory, partId.toString())" class="sf-chip cyan x-small mr-2">
                    {{ $t("planner.factory.satisfaction.unpackaged") }}
                  </v-chip>
                  <v-chip v-if="showInternalChip(factory, partId.toString())" class="sf-chip green x-small mr-2">
                    {{ $t("planner.factory.satisfaction.internal") }}
                  </v-chip>
                </div>
              </div>
              <!-- Action buttons -->
              <div class="align-self-center text-right">
                <v-btn
                  v-if="showSatisfactionItemButton(factory, partId.toString(), 'addProduct')"
                  class="d-block mb-1"
                  color="primary"
                  size="small"
                  variant="outlined"
                  @click="addProduct(factory, partId.toString(), part.amountRemaining)"
                >
                  +&nbsp;<i class="fas fa-cube" /><span class="ml-1">{{ $t("planner.factory.satisfaction.addProduct") }}</span>
                </v-btn>
                <v-btn
                  v-if="showSatisfactionItemButton(factory, partId.toString(), 'addGenerator')"
                  class="d-block mb-1"
                  color="yellow-darken-3"
                  size="small"
                  variant="outlined"
                  @click="addGenerator(factory, partId.toString(), part.amountRemaining)"
                >
                  +&nbsp;<i class="fas fa-bolt mr-0" style="max-height: 16px" /><span class="ml-1">{{ $t("planner.factory.satisfaction.addGenerator") }}</span>
                </v-btn>
                <v-btn
                  v-if="showSatisfactionItemButton(factory, partId.toString(), 'fixGenerator')"
                  class="d-block mb-1"
                  color="green"
                  size="small"
                  variant="outlined"
                  @click="doFixGenerator(factory, partId.toString(), part.amountRequired)"
                >
                  <i class="fas fa-wrench" /><span class="ml-1">{{ $t("planner.factory.satisfaction.fixGenerator") }}</span>
                </v-btn>

                <template v-if="showSatisfactionItemButton(factory, partId.toString(), 'fixGeneratorManually')">
                  <v-btn
                    class="d-block my-1"
                    color="grey"
                    :ripple="false"
                    size="small"
                    variant="outlined"
                  >
                    <v-tooltip bottom>
                      <template #activator="{ props: activatorProps }">
                        <div v-bind="activatorProps">
                          <i class="fas fa-exclamation-circle" /><span class="ml-1">{{ $t("planner.factory.satisfaction.fixManually") }}</span>
                        </div>
                      </template>
                      <span>{{ $t("planner.factory.satisfaction.fixManuallyTooltip") }}</span>
                    </v-tooltip>
                  </v-btn>
                  <p class="text-center font-weight-bold">{{ + $t("planner.factory.satisfaction.fixManuallyRodsNeeded", { rodsAmount: showFuelRodsNeeded(partId.toString(), part.amountRemaining)}) }} </p>
                </template>
                <v-btn
                  v-if="showSatisfactionItemButton(factory, partId.toString(), 'fixProduct')"
                  class="d-block my-1"
                  color="green"
                  size="small"
                  @click="doFixProduct(partId.toString(), factory)"
                >
                  <i class="fas fa-wrench" /><span class="ml-1">{{ $t("planner.factory.satisfaction.fixProduct") }}</span>
                </v-btn>
                <v-btn
                  v-if="showSatisfactionItemButton(factory, partId.toString(), 'correctManually')"
                  class="d-block my-1"
                  color="grey"
                  :ripple="false"
                  size="small"
                  variant="outlined"
                >
                  <v-tooltip bottom>
                    <template #activator="{ props: activatorProps }">
                      <div v-bind="activatorProps">
                        <i class="fas fa-exclamation-circle" /><span class="ml-1">{{ $t("planner.factory.satisfaction.correctManually") }}</span>
                      </div>
                    </template>
                    <span>{{ $t("planner.factory.satisfaction.correctManuallyTooltip") }}</span>
                  </v-tooltip>
                </v-btn>
                <v-btn
                  v-if="showSatisfactionItemButton(factory, partId.toString(), 'fixImport') === true"
                  class="d-block mt-1"
                  color="green"
                  size="small"
                  @click="fixSatisfactionImport(factory, partId.toString())"
                >
                  &nbsp;<i class="fas fa-arrow-up" /><span class="ml-1">{{ $t("planner.factory.satisfaction.fixImport") }}</span>
                </v-btn>
                <v-btn
                  v-if="showSatisfactionItemButton(factory, partId.toString(), 'fixImport') === 'multiple'"
                  class="d-block my-1"
                  color="grey"
                  :ripple="false"
                  size="small"
                  variant="outlined"
                >
                  <v-tooltip bottom>
                    <template #activator="{ props: activatorProps }">
                      <div v-bind="activatorProps">
                        <i class="fas fa-exclamation-circle" /><span class="ml-1">{{ $t("planner.factory.satisfaction.fixImport") }}</span>
                      </div>
                    </template>
                    <span>{{ $t("planner.factory.satisfaction.fixImportTooltip") }}</span>
                  </v-tooltip>
                </v-btn>
              </div>
            </div>
          </td>
          <td class="border-e-md satisfaction" :class="satisfactionShading(part)">
            <div v-if="satisfactionBreakdowns">
              <div class="text-green d-flex justify-space-between align-center">
                <span>{{ $t("planner.factory.satisfaction.breakdown.production") }}</span>
                <span
                  :id="`${ factory.id }-satisfaction-${partId.toString()}-production`"
                  class="align-self-end text-right"
                >
                  {{ $t("planner.factory.satisfaction.breakdown.itemUnit", { num :formatNumber(part.amountSuppliedViaProduction) }) }}
                </span>
              </div>
              <div class="text-green d-flex justify-space-between align-center">
                <span>{{ $t("planner.factory.satisfaction.breakdown.fromImports") }}</span>
                <span
                  :id="`${ factory.id }-satisfaction-${partId.toString()}-supply-input`"
                  class="align-self-end text-right"
                >
                  {{ $t("planner.factory.satisfaction.breakdown.itemUnit", { num :formatNumber(part.amountSuppliedViaInput) }) }}
                </span>
              </div>
              <div class="text-green d-flex justify-space-between align-center">
                <span>{{ $t("planner.factory.satisfaction.breakdown.fromRaw") }}</span>
                <span
                  :id="`${ factory.id }-satisfaction-${partId.toString()}-supply-raw`"
                  class="align-self-end text-right"
                >
                  {{ $t("planner.factory.satisfaction.breakdown.itemUnit", { num :formatNumber(part.amountSuppliedViaRaw) }) }}
                </span>
              </div>
              <div class="text-orange d-flex justify-space-between align-center">
                <span>{{ $t("planner.factory.satisfaction.breakdown.internalConsumption") }}</span>
                <span
                  :id="`${ factory.id }-satisfaction-${partId.toString()}-required-production`"
                  class="align-self-end text-right"
                >
                  {{ $t("planner.factory.satisfaction.breakdown.itemUnitNeg", { num :formatNumber(part.amountSuppliedViaInput) }) }}
                </span>
              </div>
              <div class="text-orange d-flex justify-space-between align-center">
                <span>{{ $t("planner.factory.satisfaction.breakdown.export") }}</span>
                <span
                  :id="`${ factory.id }-satisfaction-${partId.toString()}-required-exports`"
                  class="align-self-end text-right"
                >
                  {{ $t("planner.factory.satisfaction.breakdown.itemUnitNeg", { num :formatNumber(part.amountSuppliedViaInput) }) }}
                </span>
              </div>
              <v-divider class="my-2" color="#ccc" />
            </div>
            <div class="text-center">
              <v-chip
                class="sf-chip small"
                :class="part.satisfied ? 'green' : 'red'"
              >
                <b>
                  <span :id="`${factory.id}-satisfaction-${partId.toString()}-remaining`">{{ formatNumber(part.amountRemaining) }}</span>/min {{ getSatisfactionLabel(part.amountRemaining) }}
                </b>
              </v-chip>
              <template v-if="showRawChip(factory, partId.toString())">
                <v-tooltip bottom>
                  <template #activator="{ props: activatorProps }">
                    <v-chip v-bind="activatorProps" class="sf-chip cyan small">
                      <span class="mr-2">Raw</span> <i class="fas fa-info-circle" />
                    </v-chip>
                  </template>
                  <span>Raw Items e.g. Iron Ore are always satisfied. Expand the Satisfaction Breakdowns or look at the Imports section for details of how much is needed.</span>
                </v-tooltip>
              </template>
              <template v-if="showUnpackagedChip(factory, partId.toString())">
                <v-tooltip bottom>
                  <template #activator="{ props: activatorProps }">
                    <v-chip v-bind="activatorProps" class="sf-chip cyan small">
                      <span class="mr-2">Unpackaged</span> <i class="fas fa-info-circle" />
                    </v-chip>
                  </template>
                  <span>This fluid is supplied by unpackaging within this factory rather than being drawn from raw resources.</span>
                </v-tooltip>
              </template>
              <div v-if="showSatisfactionItemButton(factory, partId.toString(), 'addToFactory')" class="mt-1">
                <v-tooltip bottom>
                  <template #activator="{ props: activatorProps }">
                    <v-btn
                      v-bind="activatorProps"
                      class="mr-1"
                      color="secondary"
                      :disabled="addingShortagePart === partId.toString()"
                      size="small"
                      variant="outlined"
                      @click="addShortageToNewFactory(factory, partId.toString())"
                    >
                      <template v-if="addingShortagePart === partId.toString()">
                        <v-progress-circular class="mr-1" indeterminate size="14" width="2" />
                        <span>Adding...</span>
                      </template>
                      <template v-else>
                        +&nbsp;<i class="fas fa-industry" /><span class="ml-1">New</span>
                      </template>
                    </v-btn>
                  </template>
                  <span>Adds this shortage as a product of a brand new factory,<br>and imports it into this factory.</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template #activator="{ props: activatorProps }">
                    <v-btn
                      v-bind="activatorProps"
                      color="secondary"
                      size="small"
                      variant="outlined"
                      @click="openAddShortageDialog(partId.toString())"
                    >
                      +&nbsp;<i class="fas fa-industry" /><span class="ml-1">Existing</span>
                    </v-btn>
                  </template>
                  <span>Adds this shortage as a product of an existing factory of your choice,<br>and imports it into this factory.</span>
                </v-tooltip>
              </div>
            </div>
          </td>
          <td :class="satisfactionShading(part)">
            <p v-if="getPartExportRequests(factory, partId.toString()).length === 0" class="text-center">
              -
            </p>
            <div v-else>
              <div>
                <v-chip
                  v-for="(request) in getPartExportRequests(factory, partId.toString())"
                  :key="`${partId}-${request.requestingFactoryId}`"
                  class="sf-chip small factory"
                  :color="isRequestSelected(factory, request.requestingFactoryId.toString(), partId.toString()) ? 'primary' : ''"
                  :style="isRequestSelected(factory, request.requestingFactoryId.toString(), partId.toString()) ? 'border-color: rgb(0, 123, 255) !important' : ''"
                  @click="initCalculator(factory, partId.toString(), request.requestingFactoryId)"
                >
                  <i class="fas fa-industry" />
                  <span class="ml-2">
                    <b>{{ findFactory(request.requestingFactoryId).name }}</b>: {{ formatNumber(request.amount) }}/{{ $t("common.units.timeMin") }}
                  </span>
                </v-chip>
              </div>
            </div>
          </td>
          <td class="text-right" :class="satisfactionShading(part)" style="width: 40px">
            <v-btn
              v-if="openedCalculator !== partId && getPartExportRequests(factory, partId.toString()).length > 0"
              class="rounded"
              color="primary"
              icon="fas fa-calculator"
              size="small"
              :title="$t('planner.factory.satisfaction.breakdown.showCalculator')"
              variant="outlined"
              @click="initCalculator(factory, partId.toString(), factory.exportCalculator[partId]?.selected)"
            />
            <v-btn
              v-if="openedCalculator === partId"
              class="rounded"
              color="primary"
              icon="fas fa-arrow-up"
              size="small"
              :title="$t('planner.factory.satisfaction.breakdown.hideCalculator')"
              variant="outlined"
              @click="closeCalculator()"
            />
          </td>
        </tr>
        <tr
          v-if="openedCalculator === partId && getPartExportRequests(factory, partId.toString()).length > 0"
        >
          <td class="calculator-row bg-grey-darken-3" colspan="5">
            <div class="calculator-tray" :class="{ expanded: calculatorShow }">
              <export-calculator
                :key="partId + factory.exportCalculator[partId].selected"
                :factory="factory"
                :part="partId.toString()"
              />
            </div>
          </td>
        </tr>
      </template>
    </tbody>
  </v-table>
  <add-shortage-dialog
    v-if="shortageDialogPart"
    v-model="shortageDialogOpen"
    :factory="factory"
    :part-id="shortageDialogPart"
  />
</template>

<script setup lang="ts">
  import { computed, inject } from 'vue'
  import { getPartDisplayName } from '@/utils/helpers'
  import {
    Factory, FactoryItem, FactoryPowerChangeType,
    PartMetrics,
  } from '@/interfaces/planner/FactoryInterface'
  import { addProductToFactory, fixProduct, getProduct } from '@/utils/factory-management/products'
  import { useGameDataStore } from '@/stores/game-data-store'
  import { getPartExportRequests } from '@/utils/factory-management/exports'
  import { formatNumber } from '@/utils/numberFormatter'
  import { useAppStore } from '@/stores/app-store'
  import { useI18n } from 'vue-i18n'
  import {
    addShortageToFactory,
    convertWasteToGeneratorFuel,
    showByProductChip,
    showImportedChip,
    showInternalChip,
    showProductChip,
    showRawChip,
    showRecycledChip,
    showSatisfactionItemButton,
    showUnpackagedChip,
  } from '@/utils/factory-management/satisfaction'
  import { getInput } from '@/utils/factory-management/inputs'
  import { addPowerProducerToFactory } from '@/utils/factory-management/power'
  import { calculateFactories, newFactory } from '@/utils/factory-management/factory'
  import eventBus from '@/utils/eventBus'
  import ExportCalculator from '@/components/planner/satisfaction/calculator/ExportCalculator.vue'
  import AddShortageDialog from '@/components/planner/satisfaction/AddShortageDialog.vue'
  import {
    initializeCalculatorFactoryPart,
    initializeCalculatorFactorySettings,
  } from '@/utils/factory-management/exportCalculator'

  const updateFactory = inject('updateFactory') as (factory: Factory) => void
  const findFactory = inject('findFactory') as (factoryId: string | number) => Factory
  const navigateToFactory = inject('navigateToFactory') as (id: string | number) => void

  const appStore = useAppStore()
  const { t } = useI18n()

  const { getDefaultRecipeForPart, getGeneratorFuelRecipeByPart, getGameData } = useGameDataStore()
  const openedCalculator = ref('')
  const shortageDialogPart = ref('')
  const shortageDialogOpen = ref(false)
  const addingShortagePart = ref('')
  const satisfactionBreakdowns = appStore.getSatisfactionBreakdowns()
  const calculatorShow = ref(false)

  const props = defineProps<{
    factory: Factory;
    helpText: boolean;
    showSurplusOutputs?: boolean;
  }>()

  const filteredParts = computed(() => {
    if (!props.showSurplusOutputs) return props.factory.parts
    const result: Record<string, PartMetrics> = {}
    for (const [partId, part] of Object.entries(props.factory.parts)) {
      // Surplus: amountRemaining > 0
      // Output: exported to another factory
      // Shortage: amountRemaining < 0
      const hasSurplusOrShortage = part.amountRemaining !== 0
      const isExported = getPartExportRequests(props.factory, partId).length > 0
      if (hasSurplusOrShortage || isExported) {
        result[partId] = part
      }
    }
    return result
  })

  const classes = (part: PartMetrics) => {
    return {
      'text-green': part.satisfied,
      'text-red': !part.satisfied,
    }
  }

  const satisfactionShading = (part: PartMetrics) => {
    return {
      'border-green': part.satisfied,
      'border-red': !part.satisfied,
    }
  }

  const addProduct = (factory: Factory, part: string, amount: number): void => {
    addProductToFactory(factory, {
      id: part,
      amount: Math.abs(amount),
      recipe: getDefaultRecipeForPart(part),
    })

    updateFactory(factory)
  }

  const addShortageToNewFactory = async (factory: Factory, part: string): Promise<void> => {
    if (addingShortagePart.value) return
    addingShortagePart.value = part

    // Let the browser paint the "Adding..." button state before the synchronous recalculation blocks the thread.
    await new Promise(resolve => setTimeout(resolve, 50))

    try {
      const targetFactory = newFactory(`${getPartDisplayName(part)} Factory`)
      appStore.addFactory(targetFactory)

      addShortageToFactory(factory, targetFactory, part, getDefaultRecipeForPart(part))
      calculateFactories(appStore.getFactories(), getGameData())
      eventBus.emit('toast', { message: `Created "${targetFactory.name}" producing "${getPartDisplayName(part)}"!` })

      // The dialog owns this setting; respect it here too so users can add multiple shortages without being jumped around.
      if (localStorage.getItem('shortageJumpToFactory') !== 'false') {
        // The new factory must be in the DOM before we can scroll to it.
        await nextTick()
        navigateToFactory(targetFactory.id)
      }
    } finally {
      addingShortagePart.value = ''
    }
  }

  const openAddShortageDialog = (part: string): void => {
    shortageDialogPart.value = part
    shortageDialogOpen.value = true
  }

  const addGenerator = (factory: Factory, part: string, amount: number): void => {
    const recipe = getGeneratorFuelRecipeByPart(part)

    if (!recipe) {
      console.error(`Could not find generator fuel recipe for part ${part}`)
      return
    }

    // We need to add the power producer first so the DOM renders it.
    // We need to change the ingredients after the fact because reactivity doesn't work correctly with the byproduct display. It needs a calculation.
    addPowerProducerToFactory(factory, {
      building: 'generatornuclear',
      ingredientAmount: 1,
      recipe: recipe.id,
      updated: FactoryPowerChangeType.Ingredient,
    })

    updateFactory(factory)

    // Get the producer which should be the latest one in the array
    const producer = factory.powerProducers[factory.powerProducers.length - 1]

    producer.fuelAmount = convertWasteToGeneratorFuel(recipe, Math.abs(amount))
    updateFactory(factory)
  }

  const showFuelRodsNeeded = (part: string, amount: number) => {
    const recipe = getGeneratorFuelRecipeByPart(part)

    if (!recipe) {
      console.error(`Could not find generator fuel recipe for part ${part}`)
      return
    }

    return convertWasteToGeneratorFuel(recipe, Math.abs(amount))
  }

  const fixSatisfactionImport = (factory: Factory, partIndex: string) => {
    const itemImport = getInput(factory, partIndex)

    // If the import is not found
    if (!itemImport) {
      console.error(`Could not find import for ${partIndex} to fix!`)
      return
    }

    // Set the import amount to the required amount
    itemImport.amount = factory.parts[partIndex].amountRequired
    updateFactory(factory)
  }

  const initCalculator = async (
    factory: Factory,
    part: string,
    selectedFactory?: number | string | null
  ) => {
    changeCalculatorSelection(factory, selectedFactory, part)
    openedCalculator.value = part

    // Wait for the next tick to ensure the calculator is rendered before properly opening it
    await nextTick()

    calculatorShow.value = true
  }

  const closeCalculator = async () => {
    calculatorShow.value = false

    await new Promise(resolve => setTimeout(resolve, 300))

    openedCalculator.value = ''
  }

  const changeCalculatorSelection = (factory: Factory, requestFacIdRaw: number | string | null | undefined, part: string) => {
    // Ensure requestFacId is a string indexable by an object
    let requestFacId
    if (requestFacIdRaw) {
      requestFacId = String(requestFacIdRaw)
    }
    console.log(`PlannerFactorySatisfactionItems: Changing calculator selection for ${factory.name} part ${part} to factory ${requestFacId}`)
    if (!factory.exportCalculator[part]) {
      console.log(`PlannerFactorySatisfactionItems: Calculator Settings for ${factory.name} part ${part} not initialized, creating it now.`)
      initializeCalculatorFactoryPart(factory, part)
    }

    if (requestFacId) {
      if (!factory.exportCalculator[part].factorySettings[requestFacId]?.trainTime) {
        console.log(`PlannerFactorySatisfactionItems: Calculator Factory settings for ${factory.name} part ${part}, requesting factory ${requestFacId} not initialized, creating it now.`)
        initializeCalculatorFactorySettings(factory, part, requestFacId)
      }
    }

    console.log('changeCalculatorSelection: calculatorSettings', factory.exportCalculator[part])
    console.log('changeCalculatorSelection: requestFacId', requestFacId)

    factory.exportCalculator[part].selected = requestFacId ?? null
  }

  const isRequestSelected = (factory: Factory, factoryId: string, part: string) => {
    if (!factory.exportCalculator[part]) {
      // console.error(`Could not find export calculator settings for part ${part}`)
      return false
    }
    return factory.exportCalculator[part]?.selected === factoryId
  }

  const getSatisfactionLabel = (total: number) => {
    return (total >= 0 ? t('planner.factory.satisfaction.breakdown.surplus') : t('planner.factory.satisfaction.breakdown.shortage')).toLocaleLowerCase()
  }

  const doFixProduct = (partId: string, factory: Factory) => {
    const product = getProduct(factory, partId) as FactoryItem

    if (!product) {
      alert('Could not fix the product due to there not being a product! Please report this to Discord with a share link, quoting the factory in question.')
      console.error(`Could not find product for part ${partId}`)
      return
    }
    fixProduct(product, factory)
    updateFactory(factory)
  }

  const doFixGenerator = (factory: Factory, part: string, amount: number) => {
    const generator = factory.powerProducers.find(producer => producer.recipe === getGeneratorFuelRecipeByPart(part)?.id)
    const recipe = getGeneratorFuelRecipeByPart(part)

    if (!generator) {
      alert('Could not fix the generator due to there not being a generator! Please report this to Discord with a share link, quoting the factory in question.')
      console.error(`Could not find generator for part ${part}`)
      return
    }

    if (!recipe) {
      console.error(`Could not find generator fuel recipe for part ${part}`)
      return
    }

    generator.fuelAmount = convertWasteToGeneratorFuel(recipe, Math.abs(amount))
    updateFactory(factory)
  }

  // const getCalculatorSettings = (factory: Factory, part: string | null): ExportCalculatorSettings | undefined => {
  //   if (part === null) {
  //     console.error(`Could not get calculator settings for invalid part ${part}`)
  //     return undefined
  //   }
  //   return factory.exportCalculator[part]
  // }
  //
  // const getRequestForPartByDestFac = (factory: Factory, part: string, destFacId: string): FactoryDependencyRequest | undefined => {
  //   // Get the requests, then filter by the requesting factory to get the exact request for the port
  //   const requests = factory.dependencies.requests[destFacId]
  //   if (!requests) {
  //     return undefined
  //   }
  //   return requests.find(request => request.part === part)
  // }

  // const openCalculator = (factoryId: string, partId: string) => {
  //   if (openedCalculator.value === partId) {
  //     // Close the currently opened calculator
  //     openedCalculator.value = ''
  //   } else {
  //     // Open the clicked calculator and close others
  //     openedCalculator.value = partId
  //   }
  // }
</script>

<style lang="scss" scoped>
table {
  tbody {
    tr {
      td {
        padding: 0.5rem 1rem !important;
        transition: background 0.5s ease-out !important;
        border-block: thin solid #4b4b4b !important;

        &.border-red {
          background: var(--sf-problem-bg) !important;
          border-block: thin solid var(--sf-problem-border) !important;
        }

        &.name {
          height: 78px !important;
          width: 500px;
        }

        &.calculator-row {
          padding: 0 !important;
          height: 0 !important;
        }

        &.satisfaction {
          width: 300px
        }
      }
    }
  }
}

.calculator-tray {
  overflow: hidden;
  height: 0;
  transition: height, 0.25s ease-in;

  &.expanded {
    height: 250px; /* Adjust based on expected content height */
  }
}
</style>
