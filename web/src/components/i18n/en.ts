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
