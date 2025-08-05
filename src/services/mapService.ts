import { Competitor, HomeZipcodes, Place, TradeArea, Zipcode } from "../types";

export interface MapService {
    calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number,
    ): number;
    getPlaceId(place: Place | Competitor): string;
    isMyPlace(place: Place | Competitor): boolean;
    shouldShowPlace(
        place: Place | Competitor,
        filters: { showPlaces: boolean },
    ): boolean;
    getPlaceColor(
        place: Place | Competitor,
        isHovered: boolean,
    ): [number, number, number, number];
    getPlaceRadius(place: Place | Competitor, isHovered: boolean): number;
}

export const mapService: MapService = {
    calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number,
    ): number {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    },

    getPlaceId(place: Place | Competitor): string {
        return "id" in place ? place.id : place.pid;
    },

    isMyPlace(place: Place | Competitor): boolean {
        return "id" in place;
    },

    shouldShowPlace(
        place: Place | Competitor,
        filters: { showPlaces: boolean },
    ): boolean {
        if (this.isMyPlace(place)) return true;
        return filters.showPlaces;
    },

    getPlaceColor(
        place: Place | Competitor,
        isHovered: boolean,
    ): [number, number, number, number] {
        if (this.isMyPlace(place)) {
            return isHovered ? [33, 150, 243, 255] : [25, 118, 210, 255];
        }
        return isHovered ? [255, 152, 0, 255] : [255, 111, 0, 255];
    },

    getPlaceRadius(place: Place | Competitor, isHovered: boolean): number {
        if (this.isMyPlace(place)) {
            return isHovered ? 12 : 10;
        }
        return isHovered ? 10 : 8;
    },
};
