import { MultiPolygon, ParsedPolygon, Polygon, PolygonType } from "../types";

export function isPolygon(polygon: ParsedPolygon): polygon is Polygon {
    return polygon.type === PolygonType.Polygon;
}

export function isMultiPolygon(
    polygon: ParsedPolygon,
): polygon is MultiPolygon {
    return polygon.type === PolygonType.MultiPolygon;
}

export function hasValidCoordinates(polygon: ParsedPolygon): boolean {
    if (!polygon || !polygon.coordinates || polygon.coordinates.length === 0) {
        return false;
    }

    if (isMultiPolygon(polygon)) {
        return polygon.coordinates[0] &&
            polygon.coordinates[0][0] &&
            polygon.coordinates[0][0].length > 0;
    }

    if (isPolygon(polygon)) {
        return polygon.coordinates[0] &&
            polygon.coordinates[0].length > 0;
    }

    return false;
}
