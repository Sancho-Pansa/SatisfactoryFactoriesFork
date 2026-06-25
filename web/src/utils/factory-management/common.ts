import { Factory } from '@/interfaces/planner/FactoryInterface'
import { DataInterface } from '@/interfaces/DataInterface'
import { PowerRecipe, Recipe } from '@/interfaces/Recipes'
import { useI18n } from 'vue-i18n'

export const createNewPart = (factory: Factory, part: string) => {
  if (!factory.parts[part]) {
    factory.parts[part] = {
      amountRequired: 0,
      amountRequiredExports: 0,
      amountRequiredProduction: 0,
      amountRequiredPower: 0,
      amountSupplied: 0,
      amountSuppliedViaInput: 0,
      amountSuppliedViaRaw: 0,
      amountSuppliedViaProduction: 0,
      amountRemaining: 0,
      satisfied: true,
      isRaw: false,
      exportable: false,
    }
  }
}

// You may think that this is duplication with the gameDataStore. It kind of is, however, trying to mock the store in tests is a gigantic pain in the arse.
// Therefore, usage of gameDataStore within the ./factory-management files is to be used sparingly, and proxies created here.
export const getRecipe = (recipeId: any, gameData: DataInterface): Recipe | undefined => {
  const recipe = gameData.recipes.find(r => r.id === recipeId)

  if (!recipe) {
    console.error(`Recipe with ID ${recipeId} not found.`)
    return
  }

  return recipe
}

export const getPartDisplayNameWithoutDataStore = (part: string, gameData: DataInterface): string => {
  if (!part) {
    return 'NO PART!!!'
  }
  if (!gameData) {
    console.error('getPartDisplayName: No game data!!')
    return 'NO DATA!!!'
  }
  return gameData.items.rawResources[part]?.name ||
    gameData.items.parts[part]?.name ||
    `UNKNOWN PART ${part}!`
}

export const getPowerRecipeById = (id: string, gameData: DataInterface): PowerRecipe | null => {
  if (!gameData || !id) {
    return null
  }

  return gameData.powerGenerationRecipes.find(recipe => recipe.id === id) ?? null
}

export const getBuildingDisplayName = (building: string) => {
  const { t } = useI18n()
  const buildingFriendly = new Map<string, string>([
    ['assemblermk1', t('buildings.assemblermk1')],
    ['blender', t('buildings.blender')],
    ['constructormk1', t('buildings.constructormk1')],
    ['converter', t('buildings.converter')],
    ['foundrymk1', t('buildings.foundrymk1')],
    ['hadroncollider', t('buildings.hadroncollider')],
    ['generatorbiomass', t('buildings.generatorbiomass')],
    ['generatorcoal', t('buildings.generatorcoal')],
    ['generatorfuel', t('buildings.generatorfuel')],
    ['generatornuclear', t('buildings.generatornuclear')],
    ['manufacturermk1', t('buildings.manufacturermk1')],
    ['oilrefinery', t('buildings.oilrefinery')],
    ['packager', t('buildings.packager')],
    ['quantumencoder', t('buildings.quantumencoder')],
    ['smeltermk1', t('buildings.smeltermk1')],
    ['waterExtractor', t('buildings.waterExtractor')],
  ])

  return buildingFriendly.get(building) ?? `UNKNOWN BUILDING: ${building}`
}
