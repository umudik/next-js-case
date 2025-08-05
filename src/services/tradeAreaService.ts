import { HomeZipcodes, ParsedPolygon, TradeArea, Zipcode } from "../types";
import {
    hasValidCoordinates,
    isMultiPolygon,
    isPolygon,
} from "../utils/typeGuards";

interface HomeZipcodePolygon {
    zipcode: string;
    percentage: number;
    polygon: ParsedPolygon;
}

export interface TradeAreaService {
    extractCoordinates(polygon: ParsedPolygon): number[][];
    getTradeAreaColor(percentage: number): [number, number, number, number];
    getHomeZipcodeColor(percentage: number): [number, number, number, number];
    filterTradeAreasByPlace(
        tradeAreas: TradeArea[],
        placeId: string,
        selectedPercentages: number[],
    ): TradeArea[];
    getHomeZipcodePolygons(
        homeZipcode: HomeZipcodes | null,
        zipcodes: Zipcode[],
    ): HomeZipcodePolygon[];
}

export const tradeAreaService: TradeAreaService = {
    extractCoordinates(polygon: ParsedPolygon): number[][] {
        if (!hasValidCoordinates(polygon)) {
            return [];
        }

        if (isMultiPolygon(polygon)) {
            return polygon.coordinates[0][0];
        } else if (isPolygon(polygon)) {
            return polygon.coordinates[0];
        }

        return [];
    },

    getTradeAreaColor(percentage: number): [number, number, number, number] {
        const TRADE_AREA_COLORS = {
            30: [255, 67, 54, 220] as [number, number, number, number],
            50: [76, 175, 80, 160] as [number, number, number, number],
            70: [33, 150, 243, 120] as [number, number, number, number],
        };
        return TRADE_AREA_COLORS[
            percentage as keyof typeof TRADE_AREA_COLORS
        ] || [128, 128, 128, 180];
    },

    getHomeZipcodeColor(percentage: number): [number, number, number, number] {
        const opacity = Math.floor((percentage / 100) * 180 + 40);

        const colors: [number, number, number, number][] = [
            [255, 235, 59, opacity],
            [255, 193, 7, opacity],
            [255, 152, 0, opacity],
            [255, 111, 0, opacity],
            [244, 109, 67, opacity],
            [215, 48, 39, opacity],
            [165, 0, 38, opacity],
        ];

        const index = Math.min(Math.floor(percentage / 15), colors.length - 1);
        return colors[index];
    },

    filterTradeAreasByPlace(
        tradeAreas: TradeArea[],
        placeId: string,
        selectedPercentages: number[],
    ): TradeArea[] {
        return tradeAreas.filter((ta) =>
            ta.pid === placeId &&
            selectedPercentages.includes(ta.trade_area)
        );
    },

    getHomeZipcodePolygons(
        homeZipcode: HomeZipcodes | null,
        zipcodes: Zipcode[],
    ): HomeZipcodePolygon[] {
        if (!homeZipcode) return [];

        return homeZipcode.locations
            .map((loc) => {
                const zipId = Object.keys(loc)[0];
                const percentage = parseFloat(String(loc[zipId]));
                const zipcode = zipcodes.find((z) => z.id === zipId);

                if (!zipcode) return null;

                return {
                    zipcode: zipId,
                    percentage,
                    polygon: zipcode.polygon,
                };
            })
            .filter((item): item is HomeZipcodePolygon => item !== null);
    },
};
