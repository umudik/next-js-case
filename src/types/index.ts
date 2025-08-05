export type Place = {
    id: string;
    name: string;
    street_address: string;
    city: string;
    state: string;
    logo: string | null;
    longitude: number;
    latitude: number;
    industry: string;
    isTradeAreaAvailable: boolean;
    isHomeZipcodesAvailable: boolean;
};

export type Competitor = {
    pid: string;
    name: string;
    street_address: string;
    city: string;
    region: string;
    logo: string | null;
    latitude: number;
    longitude: number;
    sub_category: string;
    trade_area_activity: boolean;
    home_locations_activity: boolean;
    distance: number;
};

export enum PolygonType {
    Polygon = "Polygon",
    MultiPolygon = "MultiPolygon",
}

export interface Polygon {
    type: PolygonType.Polygon;
    coordinates: number[][][];
}

export interface MultiPolygon {
    type: PolygonType.MultiPolygon;
    coordinates: number[][][][];
}

export type ParsedPolygon = Polygon | MultiPolygon;

export type Zipcode = {
    id: string;
    polygon: ParsedPolygon;
};

export type Location = {
    [id: string]: number;
};

export type TradeArea = {
    pid: string;
    polygon: ParsedPolygon;
    trade_area: number;
};

export type HomeZipcodes = {
    pid: string;
    locations: Location[];
};

export type DataType = "trade_area" | "home_zipcodes";

export type TradeAreaPercentage = 30 | 50 | 70;

export interface FilterState {
    radius: number;
    industries: string[];
    showPlaces: boolean;
    dataType: DataType;
    selectedTradeAreas: TradeAreaPercentage[];
    showCustomerData: boolean;
    searchQuery: string;
}

export interface MapViewState {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
}
