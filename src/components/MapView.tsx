'use client';

import React, { useMemo } from 'react';
import Map from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer, PolygonLayer } from '@deck.gl/layers';
import { MapViewState, Place, Competitor, TradeArea, HomeZipcodes, Zipcode, FilterState } from '../types';
import { Box, Button, Typography, Paper } from '@mui/material';
import { mapService } from '../services/mapService';
import { tradeAreaService } from '../services/tradeAreaService';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapViewProps {
    myPlace: Place | null;
    competitors: Competitor[];
    tradeAreas: TradeArea[];
    homeZipcodes: HomeZipcodes[];
    zipcodes: Zipcode[];
    filters: FilterState;
    visibleTradeAreas: Set<string>;
    visibleHomeZipcodes: string | null;
    viewState: MapViewState;
    clickedPlace: Place | Competitor | null;
    hoveredPlace: Place | Competitor | null;
    onPlaceClick: (place: Place | Competitor) => void;
    onPlaceHover: (place: Place | Competitor | null) => void;
    onMapClick: () => void;
    onViewStateChange: (viewState: MapViewState) => void;
    onTooltipClose: () => void;
    onPlaceAction: (place: Place | Competitor, action: 'trade_area' | 'home_zipcodes', show: boolean) => void;
}

export default function MapView({
    myPlace,
    competitors,
    tradeAreas,
    homeZipcodes,
    zipcodes,
    filters,
    visibleTradeAreas,
    visibleHomeZipcodes,
    viewState,
    clickedPlace,
    hoveredPlace,
    onPlaceClick,
    onPlaceHover,
    onMapClick,
    onViewStateChange,
    onTooltipClose,
    onPlaceAction
}: MapViewProps) {
    const displayCompetitors = useMemo(() => {
        return filters.showPlaces ? competitors : [];
    }, [competitors, filters.showPlaces]);

    const placesLayer = useMemo(() => new ScatterplotLayer({
        id: 'places',
        data: myPlace ? [myPlace, ...displayCompetitors] : displayCompetitors,
        getPosition: (d: Place | Competitor) => [d.longitude, d.latitude],
        getFillColor: (d: Place | Competitor) => mapService.getPlaceColor(d, hoveredPlace === d),
        getRadius: (d: Place | Competitor) => mapService.getPlaceRadius(d, hoveredPlace === d),
        radiusMinPixels: 6,
        radiusMaxPixels: 30,
        stroked: true,
        filled: true,
        pickable: true,
        autoHighlight: true,
        highlightColor: [255, 255, 255, 80],
        onClick: (info) => {
            if (info.object) {
                onPlaceClick(info.object);
            }
        },
        onHover: (info) => {
            onPlaceHover(info.object);
        },
        updateTriggers: {
            getRadius: [hoveredPlace],
            getFillColor: [hoveredPlace]
        }
    }), [myPlace, displayCompetitors, hoveredPlace, onPlaceClick, onPlaceHover]);

    const tradeAreaLayers = useMemo(() => {
        const layers: PolygonLayer[] = [];

        visibleTradeAreas.forEach(placeId => {
            const placeTradeAreas = tradeAreaService.filterTradeAreasByPlace(
                tradeAreas,
                placeId,
                filters.selectedTradeAreas
            );

            placeTradeAreas.forEach((tradeArea) => {
                layers.push(new PolygonLayer({
                    id: `trade-area-${tradeArea.pid}-${tradeArea.trade_area}`,
                    data: [tradeArea],
                    getPolygon: (d: TradeArea) => tradeAreaService.extractCoordinates(d.polygon),
                    getFillColor: tradeAreaService.getTradeAreaColor(tradeArea.trade_area),
                    getLineColor: [255, 255, 255, 255],
                    getLineWidth: 2,
                    lineWidthMinPixels: 1,
                    filled: true,
                    stroked: true,
                    pickable: false
                }));
            });
        });

        return layers;
    }, [tradeAreas, visibleTradeAreas, filters.selectedTradeAreas]);

    const homeZipcodesLayers = useMemo(() => {
        if (!visibleHomeZipcodes) return [];

        const homeZipcode = homeZipcodes.find((hz) => hz.pid === visibleHomeZipcodes);
        if (!homeZipcode) return [];

        const polygonData = tradeAreaService.getHomeZipcodePolygons(homeZipcode, zipcodes);

        return polygonData.map((data, index) =>
            new PolygonLayer({
                id: `home-zipcode-${visibleHomeZipcodes}-${index}`,
                data: [data],
                getPolygon: (d) => tradeAreaService.extractCoordinates(d.polygon),
                getFillColor: tradeAreaService.getHomeZipcodeColor(data.percentage),
                getLineColor: [255, 255, 255, 255],
                getLineWidth: 2,
                lineWidthMinPixels: 1,
                filled: true,
                stroked: true,
                pickable: false
            })
        );
    }, [homeZipcodes, visibleHomeZipcodes, zipcodes]);

    const layers = [
        ...tradeAreaLayers,
        ...homeZipcodesLayers,
        placesLayer
    ];

    const isTradeAreaVisible = (place: Place | Competitor) => {
        const placeId = mapService.getPlaceId(place);
        return visibleTradeAreas.has(placeId);
    };

    const isHomeZipcodesVisible = (place: Place | Competitor) => {
        const placeId = mapService.getPlaceId(place);
        return visibleHomeZipcodes === placeId;
    };

    const hasTradeAreaData = (place: Place | Competitor): boolean => {
        const placeId = mapService.getPlaceId(place);
        return tradeAreas.some(ta => ta.pid === placeId);
    };

    const hasHomeZipcodeData = (place: Place | Competitor): boolean => {
        const placeId = mapService.getPlaceId(place);
        return homeZipcodes.some(hz => hz.pid === placeId);
    };

    const renderTooltip = () => {
        if (!clickedPlace) return null;

        const isMyPlace = mapService.isMyPlace(clickedPlace);
        const name = isMyPlace ? (clickedPlace as Place).name : (clickedPlace as Competitor).name;
        const subCategory = !isMyPlace ? (clickedPlace as Competitor).sub_category : null;
        const distance = !isMyPlace ? (clickedPlace as Competitor).distance : null;

        return (
            <Paper
                elevation={4}
                sx={{
                    position: 'absolute',
                    bottom: 20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    p: 3,
                    minWidth: 280,
                    maxWidth: 400,
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    borderRadius: 3,
                    border: '1px solid rgba(0, 0, 0, 0.08)'
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        color: isMyPlace ? '#1976d2' : '#333',
                        mb: 1.5
                    }}
                >
                    {name}
                </Typography>

                {subCategory && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#666',
                            mb: 0.5
                        }}
                    >
                        Industry: {subCategory}
                    </Typography>
                )}

                {distance !== null && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#666',
                            mb: 2
                        }}
                    >
                        Distance: {distance.toFixed(2)} km
                    </Typography>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                    {filters.dataType === 'trade_area' && (
                        <Button
                            size="small"
                            variant={isTradeAreaVisible(clickedPlace) ? "outlined" : "contained"}
                            onClick={() => onPlaceAction(clickedPlace, 'trade_area', !isTradeAreaVisible(clickedPlace))}
                            disabled={!hasTradeAreaData(clickedPlace) || !filters.showCustomerData}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                py: 1
                            }}
                        >
                            {isTradeAreaVisible(clickedPlace) ? 'Hide' : 'Show'} Trade Area
                        </Button>
                    )}

                    {filters.dataType === 'home_zipcodes' && (
                        <Button
                            size="small"
                            variant={isHomeZipcodesVisible(clickedPlace) ? "outlined" : "contained"}
                            onClick={() => onPlaceAction(clickedPlace, 'home_zipcodes', !isHomeZipcodesVisible(clickedPlace))}
                            disabled={!hasHomeZipcodeData(clickedPlace) || !filters.showCustomerData}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                py: 1
                            }}
                        >
                            {isHomeZipcodesVisible(clickedPlace) ? 'Hide' : 'Show'} Home Zipcodes
                        </Button>
                    )}
                </Box>

                <Button
                    size="small"
                    onClick={onTooltipClose}
                    sx={{
                        mt: 2,
                        width: '100%',
                        borderRadius: 2,
                        textTransform: 'none'
                    }}
                    variant="text"
                    color="inherit"
                >
                    Close
                </Button>
            </Paper>
        );
    };

    return (
        <div className="map-container">
            <DeckGL
                viewState={viewState}
                onViewStateChange={(e: any) => onViewStateChange(e.viewState)}
                controller={true}
                layers={layers}
                onClick={(info) => {
                    if (!info.object) {
                        onMapClick();
                    }
                }}
            >
                <Map
                    mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                    attributionControl={false}
                />
            </DeckGL>
            {renderTooltip()}
        </div>
    );
}