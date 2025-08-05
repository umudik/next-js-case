"use client";

import { useEffect, useState } from "react";
import { Competitor, HomeZipcodes, Place, TradeArea, Zipcode } from "../types";
import { dataParser } from "../services/dataParser";

export function useData() {
    const [myPlace, setMyPlace] = useState<Place | null>(null);
    const [competitors, setCompetitors] = useState<Competitor[]>([]);
    const [tradeAreas, setTradeAreas] = useState<TradeArea[]>([]);
    const [homeZipcodes, setHomeZipcodes] = useState<HomeZipcodes[]>([]);
    const [zipcodes, setZipcodes] = useState<Zipcode[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingStatus, setLoadingStatus] = useState<string>(
        "Initializing...",
    );
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                setLoadingStatus("🏢 Loading business data...");
                await new Promise((resolve) => setTimeout(resolve, 1000));
                console.log("Loading basic data...");
                const myPlaceResponse = await fetch("/data/my_place.json");
                const competitorsResponse = await fetch(
                    "/data/competitors.json",
                );

                if (!myPlaceResponse.ok || !competitorsResponse.ok) {
                    throw new Error("Failed to fetch basic data");
                }

                const myPlaceData = await myPlaceResponse.json();
                const competitorsData = await competitorsResponse.json();

                setMyPlace(myPlaceData);
                setCompetitors(competitorsData);

                setLoadingStatus("🗺️ Loading geographic data...");
                await new Promise((resolve) => setTimeout(resolve, 1000));
                console.log("Loading large data files...");
                const timeout = 30000;

                const fetchWithTimeout = (url: string) => {
                    return Promise.race([
                        fetch(url),
                        new Promise((_, reject) =>
                            setTimeout(
                                () =>
                                    reject(new Error(`Timeout loading ${url}`)),
                                timeout,
                            )
                        ),
                    ]) as Promise<Response>;
                };

                const [
                    tradeAreasResponse,
                    homeZipcodesResponse,
                    zipcodesResponse,
                ] = await Promise.all([
                    fetchWithTimeout("/data/trade_areas.json"),
                    fetchWithTimeout("/data/home_zipcodes.json"),
                    fetchWithTimeout("/data/zipcodes.json"),
                ]);

                if (
                    !tradeAreasResponse.ok || !homeZipcodesResponse.ok ||
                    !zipcodesResponse.ok
                ) {
                    throw new Error("Failed to fetch large data files");
                }

                const [
                    rawTradeAreasData,
                    homeZipcodesData,
                    rawZipcodesData,
                ] = await Promise.all([
                    (tradeAreasResponse as Response).json(),
                    (homeZipcodesResponse as Response).json(),
                    (zipcodesResponse as Response).json(),
                ]);

                setLoadingStatus("🔄 Processing polygon data...");
                await new Promise((resolve) => setTimeout(resolve, 1000));

                const parsedTradeAreas = dataParser.parseTradeAreas(
                    rawTradeAreasData,
                );
                const parsedZipcodes = dataParser.parseZipcodes(
                    rawZipcodesData,
                );

                setLoadingStatus("✨ Finalizing map data...");

                setTradeAreas(parsedTradeAreas);
                setHomeZipcodes(homeZipcodesData);
                setZipcodes(parsedZipcodes);

                console.log("All data loaded successfully!");
                setLoadingStatus("✅ Ready!");
            } catch (err) {
                console.error("Data loading error:", err);
                setError(
                    err instanceof Error
                        ? err.message
                        : "An error occurred while loading data",
                );
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(loadData, 100);
        return () => clearTimeout(timer);
    }, []);

    const getAvailableIndustries = () => {
        const industries = new Set<string>();
        competitors.forEach((competitor) => {
            if (competitor.sub_category) {
                industries.add(competitor.sub_category);
            }
        });
        return Array.from(industries).sort();
    };

    const getFilteredCompetitors = (
        radius: number,
        industries: string[],
        searchQuery: string = "",
    ) => {
        return competitors.filter((competitor) => {
            if (
                searchQuery &&
                !competitor.name.toLowerCase().includes(
                    searchQuery.toLowerCase(),
                )
            ) {
                return false;
            }

            if (radius > 0 && competitor.distance > radius) {
                return false;
            }
            if (
                industries.length > 0 &&
                !industries.includes(competitor.sub_category)
            ) {
                return false;
            }
            return true;
        });
    };

    const getTradeAreasByPlace = (placeId: string) => {
        return tradeAreas.filter((ta) => ta.pid === placeId);
    };

    const getHomeZipcodesByPlace = (placeId: string) => {
        const homeZipcode = homeZipcodes.find((hz) => hz.pid === placeId);
        if (!homeZipcode) return null;

        const polygonData = homeZipcode.locations
            .map((loc: any) => {
                const zipId = Object.keys(loc)[0];
                const percentage = parseFloat(Object.values(loc)[0] as string);
                const zipcode = zipcodes.find((z: any) => z.id === zipId);

                if (!zipcode) return null;

                return {
                    zipcode: zipId,
                    percentage,
                    polygon: zipcode.polygon,
                };
            })
            .filter((item: any) => item !== null);

        return {
            ...homeZipcode,
            polygonData,
        };
    };

    return {
        myPlace,
        competitors,
        tradeAreas,
        homeZipcodes,
        zipcodes,
        loading,
        loadingStatus,
        error,
        getAvailableIndustries,
        getFilteredCompetitors,
        getTradeAreasByPlace,
        getHomeZipcodesByPlace,
    };
}
