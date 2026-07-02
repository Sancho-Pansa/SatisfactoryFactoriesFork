export interface ParserPart {
    name: string;
    localName?: string;
    stackSize: number;
    isFluid: boolean;
    isFicsmas: boolean;
    energyGeneratedInMJ: number;
}

export interface ParserItemDataInterface {
    parts: { [key: string]: ParserPart };
    rawResources: { [key: string]: ParserRawResource };
}

export interface ParserRawResource {
    name: string;
    localName?: string;
    limit: number;
}