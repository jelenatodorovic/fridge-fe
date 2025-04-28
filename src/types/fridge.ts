export enum FridgeType {
    BASIC = 'BASIC',
    WITH_FREEZER = 'WITH_FREEZER',
    PREMIUM = 'PREMIUM'
}

export enum FridgeSize {
    S = 'S',
    M = 'M',
    L = 'L'
}

export enum ItemSize {
    XS = 'XS',
    S = 'S',
    M = 'M',
    L = 'L',
    XL = 'XL'
}

export enum CompartmentType {
    FRIDGE = 'FRIDGE',
    FREEZER = 'FREEZER',
    FRESH_ZONE = 'FRESH_ZONE'
}

export interface FridgeCompartmentDto {
    tempFromTo: number[];
    capacity: number;
    items: ItemDto[];
}

export interface ItemDto {
    id?: number;
    name: string;
    size: ItemSize;
    bestBeforeDate: string | null;
}

export interface FridgeDto {
    id: number;
    name: string;
    type: FridgeType;
    size: FridgeSize;
    totalCapacity: number;
    compartments: Record<CompartmentType, FridgeCompartmentDto>;
} 