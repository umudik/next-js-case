import {
    MultiPolygon,
    ParsedPolygon,
    Polygon,
    PolygonType,
    TradeArea,
    Zipcode,
} from "../types";

interface RawTradeArea {
    pid: string;
    polygon: string;
    trade_area: number;
}

interface RawZipcode {
    id: string;
    polygon: string;
}

export interface DataParser {
    parseTradeAreas(rawData: RawTradeArea[]): TradeArea[];
    parseZipcodes(rawData: RawZipcode[]): Zipcode[];
    parsePolygonString(polygonString: string): ParsedPolygon;
}

export const dataParser: DataParser = {
    parseTradeAreas(rawData: RawTradeArea[]): TradeArea[] {
        return rawData.map((item) => ({
            pid: item.pid,
            polygon: this.parsePolygonString(item.polygon),
            trade_area: item.trade_area,
        }));
    },

    parseZipcodes(rawData: RawZipcode[]): Zipcode[] {
        return rawData.map((item) => ({
            id: item.id,
            polygon: this.parsePolygonString(item.polygon),
        }));
    },

    parsePolygonString(polygonString: string): ParsedPolygon {
        try {
            const parsed = JSON.parse(polygonString);
            if (!parsed || typeof parsed !== "object") {
                throw new Error("Invalid polygon structure - not an object");
            }

            if (!parsed.type || !parsed.coordinates) {
                console.warn("Polygon missing type or coordinates:", parsed);
                throw new Error("Invalid polygon structure - missing fields");
            }

            if (parsed.type === PolygonType.MultiPolygon) {
                const multiPolygon: MultiPolygon = {
                    type: PolygonType.MultiPolygon,
                    coordinates: parsed.coordinates,
                };
                return multiPolygon;
            } else if (parsed.type === PolygonType.Polygon) {
                const polygon: Polygon = {
                    type: PolygonType.Polygon,
                    coordinates: parsed.coordinates,
                };
                return polygon;
            } else {
                throw new Error(`Unknown polygon type: ${parsed.type}`);
            }
        } catch (error) {
            console.error("Failed to parse polygon:", error);
            const emptyPolygon: Polygon = {
                type: PolygonType.Polygon,
                coordinates: [],
            };
            return emptyPolygon;
        }
    },
};
