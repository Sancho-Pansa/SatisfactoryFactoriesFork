import { ParserRecipe } from "./interfaces/ParserRecipe";
import { ParserPart, ParserItemDataInterface, ParserRawResource } from "./interfaces/ParserPart";
import { I18nDictionary } from "./interfaces/I18nDictionary";
import {
    blacklist,
    whitelist,
    isFluid,
    isFicsmas,
    getPartName,
    getFriendlyName
} from "./common";

function getItems(data: any[], i18nDictionary: I18nDictionary): ParserItemDataInterface {
    const parts: { [key: string]: ParserPart; } = {};
    const rawResources = getRawResources(data, i18nDictionary);

    if (!i18nDictionary) {
        i18nDictionary = {};
        data
            .flatMap((entry: any) => entry.Classes)
            .filter((entry: any) => entry.ClassName.startsWith("Desc_"))
            .forEach((entry: any) => {
                if (entry.ClassName) {
                    i18nDictionary[entry.ClassName] = entry.mDisplayName;
                }
            });
    }

    // Scan all recipes (not parts), looking for parts that are used in recipes.
    data
        .filter((entry: any) => entry.Classes)
        .flatMap((entry: any) => entry.Classes)
        .forEach((entry: any) => {
            switch (entry.ClassName) {
                // There are two exception products we need to check for and add to the parts list
                // Note that this part id is NuclearWaste, not Uranium Waste
                case "Desc_NuclearWaste_C":
                    parts["NuclearWaste"] = {
                        name: "Uranium Waste",
                        localName: i18nDictionary["Desc_NuclearWaste_C"] ?? "Uranium Waste",
                        stackSize: 500, //SS_HUGE
                        isFluid: isFluid("NuclearWaste"),
                        isFicsmas: isFicsmas(entry.mDisplayName),
                        energyGeneratedInMJ: 0
                    };
                    break;
                case "Desc_PlutoniumWaste_C":
                    parts["PlutoniumWaste"] = {
                        name: "Plutonium Waste",
                        localName: i18nDictionary["Desc_PlutoniumWaste_C"] ?? "Plutonium Waste",
                        stackSize: 500, //SS_HUGE
                        isFluid: isFluid("PlutoniumWaste"),
                        isFicsmas: isFicsmas(entry.mDisplayName),
                        energyGeneratedInMJ: 0
                    };
                    break;
                //These are exception products that aren't produced by mines or extractors, they are raw materials
                case "Desc_Leaves_C":
                    parts["Leaves"] = {
                        name: "Leaves",
                        localName: i18nDictionary["Desc_Leaves_C"] ?? "Leaves",
                        stackSize: 500, //SS_HUGE
                        isFluid: false,
                        isFicsmas: false,
                        energyGeneratedInMJ: 15
                    };
                    break;
                case "Desc_Wood_C":
                    parts["Wood"] = {
                        name: "Wood",
                        localName: i18nDictionary["Desc_Wood_C"] ?? "Wood",
                        stackSize: 200, //SS_BIG
                        isFluid: false,
                        isFicsmas: false,
                        energyGeneratedInMJ: 100
                    };
                    break;
                case "Desc_Mycelia_C":
                    parts["Mycelia"] = {
                        name: "Mycelia",
                        localName: i18nDictionary["Desc_Mycelia_C"] ?? "Mycelia",
                        stackSize: 200, //SS_BIG
                        isFluid: false,
                        isFicsmas: false,
                        energyGeneratedInMJ: 20
                    };
                    break;
                case "Desc_HogParts_C":
                    parts["HogParts"] = {
                        name: "Hog Remains",
                        localName: i18nDictionary["Desc_HogParts_C"] ?? "Hog Remains",
                        stackSize: 50, //SS_SMALL
                        isFluid: false,
                        isFicsmas: false,
                        energyGeneratedInMJ: 0
                    };
                    break;
                case "Desc_SpitterParts_C":
                    parts["SpitterParts"] = {
                        name: "Spitter Remains",
                        localName: i18nDictionary["Desc_SpitterParts_C"] ?? "Spitter Remains",
                        stackSize: 50, //SS_SMALL
                        isFluid: false,
                        isFicsmas: false,
                        energyGeneratedInMJ: 0
                    };
                    break;
                case "Desc_StingerParts_C":
                    parts["StingerParts"] = {
                        name: "Stinger Remains",
                        localName: i18nDictionary["Desc_StingerParts_C"] ?? "Stinger Remains",
                        stackSize: 50, //SS_SMALL
                        isFluid: false,
                        isFicsmas: false,
                        energyGeneratedInMJ: 0
                    };
                    break;
                case "Desc_HatcherParts_C":
                    parts["HatcherParts"] = {
                        name: "Hatcher Remains",
                        localName: i18nDictionary["Desc_HatcherParts_C"] ?? "Hatcher Remains",
                        stackSize: 50, //SS_SMALL
                        isFluid: false,
                        isFicsmas: false,
                        energyGeneratedInMJ: 0
                    };
                    break;
                case "Desc_DissolvedSilica_C":
                    // This is a special intermediate alt product
                    parts["DissolvedSilica"] = {
                        name: "Dissolved Silica",
                        localName: i18nDictionary["Desc_DissolvedSilica_C"] ?? "Dissolved Silica",
                        stackSize: 0, //SS_FLUID
                        isFluid: true,
                        isFicsmas: false,
                        energyGeneratedInMJ: 0
                    };
                    break;
                case "Desc_LiquidOil_C":
                    // This is a special liquid raw material
                    parts["LiquidOil"] = {
                        name: "Crude Oil",
                        localName: i18nDictionary["Desc_LiquidOil_C"] ?? "Crude Oil",
                        stackSize: 0, //SS_FLUID
                        isFluid: true,
                        isFicsmas: false,
                        energyGeneratedInMJ: 320
                    };
                    break;
                case "Desc_Gift_C":
                    // this is a ficsmas collectable
                    parts["Gift"] = {
                        name: "FICSMAS Gift",
                        localName: i18nDictionary["Desc_Gift_C"] ?? "FICSMAS Gift",
                        stackSize: 200, //SS_BIG
                        isFluid: false,
                        isFicsmas: true,
                        energyGeneratedInMJ: 0
                    };
                    break;
                case "Desc_Snow_C":
                    // this is a ficsmas collectable
                    parts["Snow"] = {
                        name: "Snow",
                        localName: i18nDictionary["Desc_Snow_C"] ?? "Snow",
                        stackSize: 500, //SS_HUGE
                        isFluid: false,
                        isFicsmas: true,
                        energyGeneratedInMJ: 0
                    };
                    break;
                case "Desc_Crystal_C":
                    parts["Crystal"] = {
                        name: "Blue Power Slug",
                        localName: i18nDictionary["Desc_Crystal_C"] ?? "Blue Power Slug",
                        stackSize: 50, //SS_SMALL
                        isFluid: false,
                        isFicsmas: false,
                        energyGeneratedInMJ: 0
                    };
                    break;
                case "Desc_Crystal_mk2_C":
                    parts["Crystal_mk2"] = {
                        name: "Yellow Power Slug",
                        localName: i18nDictionary["Desc_Crystal_mk2_C"] ?? "Yellow Power Slug",
                        stackSize: 50, //SS_SMALL
                        isFluid: false,
                        isFicsmas: false,
                        energyGeneratedInMJ: 0
                    };
                    break;
                case "Desc_Crystal_mk3_C":
                    parts["Crystal_mk3"] = {
                        name: "Purple Power Slug",
                        localName: i18nDictionary["Desc_Crystal_mk3_C"] ?? "Purple Power Slug",
                        stackSize: 50, //SS_SMALL
                        isFluid: false,
                        isFicsmas: false,
                        energyGeneratedInMJ: 0
                    };
                    break;
                case "Desc_SAM_C":
                    parts["SAM"] = {
                        name: "SAM",
                        localName: i18nDictionary["Desc_SAM_C"] ?? "SAM",
                        stackSize: 100, //SS_MEDIUM
                        isFluid: false,
                        isFicsmas: false,
                        energyGeneratedInMJ: 0
                    };
                    break;
                case "Desc_CrystalShard_C":
                    parts["CrystalShard"] = {
                        name: "Power Shard",
                        localName: i18nDictionary["Desc_CrystalShard_C"] ?? "Power Shard",
                        stackSize: 100, //SS_MEDIUM
                        isFluid: false,
                        isFicsmas: false,
                        energyGeneratedInMJ: 0
                    };
                    break;
                case "BP_ItemDescriptorPortableMiner_C":
                    parts["PortableMiner"] = {
                        name: "Portable Miner",
                        localName: i18nDictionary["BP_ItemDescriptorPortableMiner_C"] ?? "Portable Miner",
                        stackSize: 50, //SS_SMALL
                        isFluid: false,
                        isFicsmas: false,
                        energyGeneratedInMJ: 0
                    };
            }

            if (!entry.ClassName) return;

            // Ensures it's a recipe, we only care about items that are produced within a recipe.
            if (!entry.mProducedIn) return;
            //if (!whitelist.some(part => entry.ClassName && entry.ClassName.includes(part)) && !entry.mProducedIn) return;

            if (blacklist.some(building => entry.mProducedIn.includes(building))) return;
            //if (!whitelist.some(part => entry.ClassName && entry.ClassName.includes(part)) && blacklist.some(building => entry.mProducedIn.includes(building))) return;

            // Check if it's an alternate recipe and skip it for parts
            if (entry.ClassName.startsWith("Recipe_Alternate")) return;

            // Check if it's an unpackage recipe and skip it for parts
            if (entry.mDisplayName.includes("Unpackage")) return;

            // Extract the part name
            const productMatches = [...entry.mProduct.matchAll(/ItemClass=".*?\/Desc_(.*?)\.Desc_.*?",Amount=(\d+)/g)];

            productMatches.forEach(match => {
                const partName: string = getPartName(match[1]);  // Use the mProduct part name
                const friendlyName: string = getFriendlyName(entry.mDisplayName);  // Use the friendly name

                // Extract the product's Desc_ class name so we can find it in the class descriptors to get the stack size
                const productClass = match[0].match(/Desc_(.*?)\.Desc_/)?.[1];

                const classDescriptor = data
                    .flatMap((entry: any) => entry.Classes)
                    .find((entry: any) => entry.ClassName === `Desc_${productClass}_C`);


                const localName = i18nDictionary[`Desc_${productClass}_C`] ?? friendlyName;
                // Extract stack size
                const stackSize: number = stackSizeConvert(classDescriptor?.mStackSize || "SS_UNKNOWN");
                // Extract the energy value

                let energyValue = classDescriptor.mEnergyValue ?? 0;

                // If the part is a fluid, the energy value is multiplied by 1000, cos the game loves to store everything as 0.0001 values...
                if (isFluid(partName)) {
                    energyValue *= 1000;
                }

                //console.log(`Adding part: ${partName} (${friendlyName}) with energy value: ${energyValue}`);
                parts[partName] = {
                    name: friendlyName,
                    localName,
                    stackSize,
                    isFluid: isFluid(partName),
                    isFicsmas: isFicsmas(entry.mDisplayName),
                    energyGeneratedInMJ: Math.round(energyValue), // Round to the nearest whole number (all energy numbers are whole numbers)
                };

            });
        });

    // Sort the parts by key
    return {
        parts: parts,
        rawResources
    };
}

function stackSizeConvert(stackSize: string): number {
    // Convert e.g. SS_HUGE to 500
    switch (stackSize) {
        case "SS_HUGE":
            return 500;
        case "SS_BIG":
            return 200;
        case "SS_MEDIUM":
            return 100;
        case "SS_SMALL":
            return 50;
        default:
            return 0;
    }
}

// Function to extract raw resources from the game data
function getRawResources(data: any[], i18nDictionary: I18nDictionary): { [key: string]: ParserRawResource; } {
    const rawResources: { [key: string]: ParserRawResource; } = {};
    const limits: { [key: string]: number; } = {
        "Coal": 42300,
        "LiquidOil": 12600,
        "NitrogenGas": 12000,
        "OreBauxite": 12300,
        "OreCopper": 36900,
        "OreGold": 15000,
        "OreIron": 92100,
        "OreUranium": 2100,
        "RawQuartz": 13500,
        "SAM": 10200,
        "Stone": 69900,
        "Sulfur": 10800,
        "Water": 9007199254740991,
    };

    data
        .filter((entry: any) => entry.NativeClass === "/Script/CoreUObject.Class'/Script/FactoryGame.FGResourceDescriptor'")
        .flatMap((entry: any) => entry.Classes)
        .forEach((resource: any) => {
            const className = getPartName(resource.ClassName);
            const displayName: string = resource.mDisplayName;
            const localName: string = i18nDictionary[resource.ClassName] ?? displayName;

            const data = {
                name: displayName,
                localName,
                limit: limits[className] || 0
            };

            if (className && displayName) {
                rawResources[className] = data;
            }
        });

    // Manually add Leaves, Wood, Mycelia to the rawResources list
    rawResources["Leaves"] = {
        name: "Leaves",
        localName: i18nDictionary["Desc_Leaves_C"] ?? "Leaves",
        limit: limits["Leaves"] || 100000000
    };
    rawResources["Wood"] = {
        name: "Wood",
        localName: i18nDictionary["Desc_Wood_C"] ?? "Wood",
        limit: limits["Wood"] || 100000000
    };
    rawResources["Mycelia"] = {
        name: "Mycelia",
        localName: i18nDictionary["Desc_Mycelia_C"] ?? "Mycelia",
        limit: limits["Mycelia"] || 100000000
    };

    //Manually add alien parts to the rawResources list
    rawResources["HatcherParts"] = {
        name: "Hatcher Remains",
        localName: i18nDictionary["Desc_HatcherParts_C"] ?? "Hatcher Remains",
        limit: 100000000
    };
    rawResources["HogParts"] = {
        name: "Hog Remains",
        localName: i18nDictionary["Desc_HogParts_C"] ?? "Hog Remains",
        limit: 100000000
    };
    rawResources["SpitterParts"] = {
        name: "Spitter Remains",
        localName: i18nDictionary["Desc_SpitterParts_C"] ?? "Spitter Remains",
        limit: 100000000
    };
    rawResources["StingerParts"] = {
        name: "Stinger Remains",
        localName: i18nDictionary["Desc_StingerParts_C"] ?? "Stinger Remains",
        limit: 100000000
    };

    //Manually add slugs. Numbers from Satisfactory Calculator map
    rawResources["Crystal"] = {
        name: "Blue Power Slug",
        localName: i18nDictionary["Desc_Crystal_C"] ?? "Blue Power Slug",
        limit: 596
    };
    rawResources["Crystal_mk2"] = {
        name: "Yellow Power Slug",
        localName: i18nDictionary["Desc_Crystal_mk2_C"] ?? "Yellow Power Slug",
        limit: 389
    };
    rawResources["Crystal_mk3"] = {
        name: "Purple Power Slug",
        localName: i18nDictionary["Desc_Crystal_mk3_C"] ?? "Purple Power Slug",
        limit: 257
    };

    //Ficmas items
    rawResources["Gift"] = {
        name: "FICSMAS Gift",
        localName: i18nDictionary["Desc_Gift_C"] ?? "FICSMAS Gift",
        limit: 100000000
    };

    // Order the rawResources by key
    const orderedRawResources: { [key: string]: ParserRawResource; } = {};
    Object.keys(rawResources).sort().forEach(key => {
        orderedRawResources[key] = rawResources[key];
    });
    return orderedRawResources;
}

function fixItemNames(items: ParserItemDataInterface): void {
    // Go through the item names and do some manual fixes, e.g. renaming "Residual Plastic" to "Plastic"
    const fixItems: Record<string, string> = {
        "AlienProtein": "Alien Protein",
        "AluminumIngot": "Aluminum Ingot", // the parser uses the recipe display name instead of the part descriptor name. The "Alternate: Pure Aluminum Ingot" recipe produces AluminumIngot, so the part gets that recipe name instead of "Aluminum Ingot"
        "CompactedCoal": "Compacted Coal",
        "DarkEnergy": "Dark Matter Residue",
        "HeavyOilResidue": "Heavy Oil Residue",
        "LiquidFuel": "Fuel",
        "PolymerResin": "Polymer Resin",
        "Rubber": "Rubber",
        "Silica": "Silica", // the parser uses the recipe display name instead of the part descriptor name. The "Alumina Solution" recipe produces both AluminaSolution and Silica as products — so when Silica was processed as a product of that recipe, it inherited the recipe name "Alumina Solution" instead of its own name "Silica"
        "Snow": "Snow",
        "Water": "Water",
    };

    for (const search of Object.keys(fixItems)) {
        if (items.parts[search]) {
            items.parts[search].name = fixItems[search];
        }
    }
}

function fixTurbofuel(items: ParserItemDataInterface, recipes: ParserRecipe[], i18nDictionary: I18nDictionary): void {
    // Rename the current "Turbofuel" which is actually "Packaged Turbofuel"
    items.parts["PackagedTurboFuel"] = items.parts["TurboFuel"];

    // Add the actual "Turbofuel" as a new item
    items.parts["LiquidTurboFuel"] = {
        name: "Turbofuel",
        localName: i18nDictionary["LiquidTurboFuel"] ?? "Turbofuel",
        stackSize: 0,
        isFluid: true,
        isFicsmas: false,
        energyGeneratedInMJ: 2000
    };
    //rename the packaged item to PackagedTurboFuel
    items.parts["PackagedTurboFuel"] = {
        name: "Packaged Turbofuel",
        localName: i18nDictionary["PackagedTurboFuel"] ?? "Packaged Turbofuel",
        stackSize: 100, //SS_MEDIUM
        isFluid: false,
        isFicsmas: false,
        energyGeneratedInMJ: 2000
    };
    //remove the incorrect packaged turbofuel
    delete items.parts["TurboFuel"];

    // Now we need to go through the recipes and wherever "TurboFuel" is mentioned, it needs to be changed to "PackagedTurbofuel"
    recipes.forEach(recipe => {
        recipe.products.forEach(product => {
            if (product.part === "TurboFuel") {
                product.part = "PackagedTurboFuel";
            }
        });

        recipe.ingredients.forEach(ingredient => {
            if (ingredient.part === "TurboFuel") {
                ingredient.part = "PackagedTurboFuel";
            }
        });
    });
}

export { getItems, fixItemNames, fixTurbofuel };