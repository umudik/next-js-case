import { useCallback, useEffect, useState } from "react";
import { DataType, FilterState, TradeAreaPercentage } from "../types";

interface UseMapStateProps {
    availableIndustries: string[];
}

interface UseMapStateReturn {
    filters: FilterState;
    visibleTradeAreas: Set<string>;
    visibleHomeZipcodes: string | null;
    handleFiltersChange: (newFilters: Partial<FilterState>) => void;
    handleTradeAreaToggle: (placeId: string, show: boolean) => void;
    handleHomeZipcodesToggle: (placeId: string, show: boolean) => void;
}

const getInitialFilters = (availableIndustries: string[]): FilterState => ({
    radius: 0,
    industries: availableIndustries,
    showPlaces: true,
    dataType: "trade_area",
    selectedTradeAreas: [30, 50, 70],
    showCustomerData: true,
    searchQuery: "Express Employment Professionals",
});

export function useMapState(
    { availableIndustries }: UseMapStateProps,
): UseMapStateReturn {
    const [filters, setFilters] = useState<FilterState>(() =>
        getInitialFilters(availableIndustries)
    );
    const [visibleTradeAreas, setVisibleTradeAreas] = useState<Set<string>>(
        new Set(),
    );
    const [visibleHomeZipcodes, setVisibleHomeZipcodes] = useState<
        string | null
    >(null);

    useEffect(() => {
        if (availableIndustries.length > 0 && filters.industries.length === 0) {
            setFilters((prev) => ({
                ...prev,
                industries: availableIndustries,
            }));
        }
    }, [availableIndustries, filters.industries.length]);

    const handleFiltersChange = useCallback(
        (newFilters: Partial<FilterState>) => {
            setFilters((prev) => {
                const updated = { ...prev, ...newFilters };

                if (
                    newFilters.dataType && newFilters.dataType !== prev.dataType
                ) {
                    if (!updated.showCustomerData) {
                        setVisibleTradeAreas(new Set());
                        setVisibleHomeZipcodes(null);
                    } else {
                        if (newFilters.dataType === "home_zipcodes") {
                            setVisibleTradeAreas(new Set());
                        } else if (newFilters.dataType === "trade_area") {
                            setVisibleHomeZipcodes(null);
                        }
                    }
                }

                if (newFilters.showCustomerData !== undefined) {
                    if (!newFilters.showCustomerData) {
                        setVisibleTradeAreas(new Set());
                        setVisibleHomeZipcodes(null);
                    }
                }

                return updated;
            });
        },
        [],
    );

    const handleTradeAreaToggle = useCallback(
        (placeId: string, show: boolean) => {
            setVisibleTradeAreas((prev) => {
                const newSet = new Set(prev);
                if (show) {
                    newSet.add(placeId);
                } else {
                    newSet.delete(placeId);
                }
                return newSet;
            });
        },
        [],
    );

    const handleHomeZipcodesToggle = useCallback(
        (placeId: string, show: boolean) => {
            setVisibleHomeZipcodes(show ? placeId : null);
        },
        [],
    );

    return {
        filters,
        visibleTradeAreas,
        visibleHomeZipcodes,
        handleFiltersChange,
        handleTradeAreaToggle,
        handleHomeZipcodesToggle,
    };
}
