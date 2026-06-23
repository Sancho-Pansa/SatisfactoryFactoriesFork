export default {
  general: {
    powerUnitMW: "MW",
    powerUnitGW: "GW",
    timeUnitMin: "min",
  },
  language: {
    self: "Language"
  },
  navigation: {
    planner: "Planner",
    graph: "Graph (WIP)",
    recipes: "Recipes",
    changelog: "Change Log"
  },
  planner: {
    add: "Add Factory",
    factory: {
      header: {
        placeholder: "Factory Name",
        tasks: "Tasks",
        notes: "See notes",
        controls: {
          up: "Move Factory Up",
          down: "Move Factory Down",
          collapse: "Collapse Factory",
          expand: "Expand Factory",
          copy: "Copy Factory",
          delete: "Delete Factory",
          confirmDelete: "Are you sure you want to delete this factory?"
        }
      },
      collapsed: {
        import: "Imports",
        export: "Exports",
        raw: "Raw Resource(s)",
        produce: "Produces",
        emptyFactory: "Empty factory! Select a product!"
      },
      body: {
        productsAndPower: {
          header: "Products &amp; Power Generators",
          help: {
            paragraph: "Products that are created within the factory. Products are first used to fulfil recipes internally, and any surplus is then available for Export.<br> e.g. if you add 200 Iron Rods and also 100 Screws, you'd have 100 surplus Rods remaining used as an Export (and the Screws as a end product).<br>"
          },
          product: {
            itemLabel: "Item",
            recipeLabel: "Recipe",
            qtyLabel: "Qty /min",
            satisfy: "Satisfy",
            trim: "Trim",
            internal: "Internal",
            noDemand: "No demand",
            byproduct: "Byproduct",
          },
          addProduct: "Add Product",
          addGenerator: "Add Power Generator"
        },
        import: {
          header: "Imports",
          help: "Imports are the resources needed to produce the factory's products and ensure its satisfaction. To set up imports, you select another factory and choose one of its outputs. This creates a \"request\" for that output. The selected factory must fulfill this request, and you'll be notified if it cannot meet the demand. All available outputs are listed in the Outputs section of the factory you choose.",
          wait: "Awaiting product selection",
          selection: {
            error: "There are no factories available to import the current product selection",
            factoryLabel: "Factory",
            itemLabel: "Item",
            qtyLabel: "Qty /min",
            satisfy: "Satisfy",
            trim: "Trim",
            view: "View",
            noAmount: "No amount set",
            redundant: "Redundant",
            add: "Add Import",
            rawOnly: "This factory is only using raw resources and requires no imports.",
            noImport: "There are no factories that have exports available to supply this factory."
          },
          rawResources: {
            header: "Raw Resources",
            help: "Raw resources (e.g. Iron Ore) aren't defined as imports. It is assumed you'll supply them sufficiently. It seemed a little pointless to force you to make a factory to input it directly into a factory."
          }
        }
      }
    },
    syncStatus: {
      unknown: "Game sync unknown",
      true: "In sync with game",
      false: "Out of sync with game",
      reset: "Reset sync status",
      clickTooltip: "Mark as in sync with game",
      textTooltip: "Game Sync is when you have implemented the factory inside the game.<br> When it drops out of sync, there are changes that you need to implement.<br> When a factory's products are changed, the factory will be out of sync, or if you set it manually."
    },
    globalActions: {
      hideAll: "Hide all",
      expandAll: "Expand all",
      showInfo: "Show Info",
      hideInfo: "Hide Info",
      showIntro: "Show Intro",
      importWorld: "Import world [WIP]",
      clear: "Clear",
      clearConfirm: "Are you really sure? This will delete literally everything!",
      copyPlan: "Copy Plan",
      pastePlan: "Paste Plan",
      recalculate: {
        button: "Recalculate",
        confirm: "WARNING: Forcing a recalculation takes a LONG time for large plans. Your browser will lag and will likely complain about stalling. Are you sure?",
        toast: "Forcing recalculation of all factories. This may take a while for large plans. Expect lag.",
        completionToast: "Recalculations completed."
      }
    },
    notes: {
      header: "Notes",
      placeholder: "Add some notes!",
      clear: "Clear Notes",
      limitMessage: "Max character length {charLimit} reached, condense your notes, pioneer!"
    }
  },
  tabnavigation: {
    confirm: "Are you sure you wish to delete this tab? This action is irreversible!"
  },
  statistics: {
    header: "Statistics [WIP]",
    hide: "Hide",
    show: "Show",
    hideAll: "Hide all Products",
    showAll: "Show all Protucts",
    resources: {
      header: "Raw Resources",
      info: "Shows the amount of raw resources consumed by all your factories.",
      emptyList: "Awaiting Resource Consumption"
    },
    buildings: {
      header: "Building Summary",
      info: "Shows the amount buildings of each type in all your factories.",
      emptyList: "Awaiting Building Construction"
    },
    power: {
      header: "Power Consumption and Generation",
      info: "Shows world level power consumption and generation data.",
      consumed: "{value} {unit} consumed",
      generated: "{value} {unit} generated",
      difference: "{value} {unit} difference",
    },
    itemsDifference: {
      header: "Product Surplus & Deficit",
      info: "Shows the amount of surplus or deficit of items you have in your factory. These are items that either need to be produced more (in red), or items that can be stored or sunk (in green)!",
      emptyList: "No Product Surplus or Deficit"
    },
    items: {
      header: "Produced Items",
      info: "Shows all the items produced by all your factories.",
      emptyList: "Awaiting Production"
    }
  }
}
