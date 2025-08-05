import { useCallback, useState } from "react";
import { Competitor, FilterState, Place } from "../types";
import { mapService } from "../services/mapService";

interface UseMapInteractionsProps {
    filters: FilterState;
    visibleTradeAreas: Set<string>;
    visibleHomeZipcodes: string | null;
    onTradeAreaToggle: (placeId: string, show: boolean) => void;
    onHomeZipcodesToggle: (placeId: string, show: boolean) => void;
}

interface UseMapInteractionsReturn {
    clickedPlace: Place | Competitor | null;
    hoveredPlace: Place | Competitor | null;
    handlePlaceClick: (place: Place | Competitor) => void;
    handlePlaceHover: (place: Place | Competitor | null) => void;
    handleMapClick: () => void;
    handleTooltipClose: () => void;
    handlePlaceAction: (
        place: Place | Competitor,
        action: "trade_area" | "home_zipcodes",
        show: boolean,
    ) => void;
}

export function useMapInteractions({
    filters,
    visibleTradeAreas,
    visibleHomeZipcodes,
    onTradeAreaToggle,
    onHomeZipcodesToggle,
}: UseMapInteractionsProps): UseMapInteractionsReturn {
    const [clickedPlace, setClickedPlace] = useState<Place | Competitor | null>(
        null,
    );
    const [hoveredPlace, setHoveredPlace] = useState<Place | Competitor | null>(
        null,
    );

    const handlePlaceClick = useCallback((place: Place | Competitor) => {
        setClickedPlace(place);

        if (filters.showCustomerData) {
            const placeId = mapService.getPlaceId(place);

            if (
                filters.dataType === "trade_area" && visibleTradeAreas.size > 0
            ) {
                visibleTradeAreas.forEach((id) => {
                    if (id !== placeId) {
                        onTradeAreaToggle(id, false);
                    }
                });
                onTradeAreaToggle(placeId, true);
            } else if (
                filters.dataType === "home_zipcodes" && visibleHomeZipcodes
            ) {
                onHomeZipcodesToggle(placeId, true);
            }
        }
    }, [
        filters,
        visibleTradeAreas,
        visibleHomeZipcodes,
        onTradeAreaToggle,
        onHomeZipcodesToggle,
    ]);

    const handlePlaceHover = useCallback((place: Place | Competitor | null) => {
        setHoveredPlace(place);
    }, []);

    const handleMapClick = useCallback(() => {
        if (filters.dataType === "trade_area") {
            visibleTradeAreas.forEach((id) => {
                onTradeAreaToggle(id, false);
            });
        } else if (
            filters.dataType === "home_zipcodes" && visibleHomeZipcodes
        ) {
            onHomeZipcodesToggle(visibleHomeZipcodes, false);
        }
    }, [
        filters.dataType,
        visibleTradeAreas,
        visibleHomeZipcodes,
        onTradeAreaToggle,
        onHomeZipcodesToggle,
    ]);

    const handleTooltipClose = useCallback(() => {
        if (clickedPlace) {
            const placeId = mapService.getPlaceId(clickedPlace);

            if (visibleTradeAreas.has(placeId)) {
                onTradeAreaToggle(placeId, false);
            }
        }
        setClickedPlace(null);
    }, [clickedPlace, visibleTradeAreas, onTradeAreaToggle]);

    const handlePlaceAction = useCallback((
        place: Place | Competitor,
        action: "trade_area" | "home_zipcodes",
        show: boolean,
    ) => {
        const placeId = mapService.getPlaceId(place);

        if (action === "trade_area") {
            if (show) {
                visibleTradeAreas.forEach((id) => {
                    if (id !== placeId) {
                        onTradeAreaToggle(id, false);
                    }
                });
            }
            onTradeAreaToggle(placeId, show);
        } else {
            onHomeZipcodesToggle(placeId, show);
        }
    }, [visibleTradeAreas, onTradeAreaToggle, onHomeZipcodesToggle]);

    return {
        clickedPlace,
        hoveredPlace,
        handlePlaceClick,
        handlePlaceHover,
        handleMapClick,
        handleTooltipClose,
        handlePlaceAction,
    };
}
