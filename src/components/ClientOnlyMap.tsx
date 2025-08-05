'use client';

import React, { useState, useMemo } from 'react';
import { CircularProgress, Alert, Box, Typography } from '@mui/material';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import MapView from './MapView';
import { useData } from '../hooks/useData';
import { useMapInteractions } from '../hooks/useMapInteractions';
import { useMapState } from '../hooks/useMapState';
import { MapViewState } from '../types';

const INITIAL_VIEW_STATE: MapViewState = {
    longitude: -104.73874,
    latitude: 38.932625,
    zoom: 4,
    pitch: 0,
    bearing: 0
};

export default function ClientOnlyMap() {
    const {
        myPlace,
        competitors,
        tradeAreas,
        homeZipcodes,
        zipcodes,
        loading,
        loadingStatus,
        error,
        getAvailableIndustries,
        getFilteredCompetitors
    } = useData();

    const availableIndustries = useMemo(() => getAvailableIndustries(), [getAvailableIndustries]);
    const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE);

    const {
        filters,
        visibleTradeAreas,
        visibleHomeZipcodes,
        handleFiltersChange,
        handleTradeAreaToggle,
        handleHomeZipcodesToggle
    } = useMapState({ availableIndustries });

    const {
        clickedPlace,
        hoveredPlace,
        handlePlaceClick,
        handlePlaceHover,
        handleMapClick,
        handleTooltipClose,
        handlePlaceAction
    } = useMapInteractions({
        filters,
        visibleTradeAreas,
        visibleHomeZipcodes,
        onTradeAreaToggle: handleTradeAreaToggle,
        onHomeZipcodesToggle: handleHomeZipcodesToggle
    });

    const filteredCompetitors = useMemo(
        () => getFilteredCompetitors(filters.radius, filters.industries, filters.searchQuery),
        [getFilteredCompetitors, filters.radius, filters.industries, filters.searchQuery]
    );

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
                bgcolor="#f5f5f5"
            >
                <Box textAlign="center">
                    <CircularProgress size={60} thickness={4} />
                    <Typography
                        variant="body1"
                        sx={{
                            mt: 2,
                            color: '#666',
                            fontSize: '1.1rem',
                            fontWeight: 500
                        }}
                    >
                        {loadingStatus}
                    </Typography>
                    <Box sx={{ mt: 2, opacity: 0.7 }}>
                        <Typography variant="caption" sx={{ color: '#999' }}>
                            This may take a few seconds...
                        </Typography>
                    </Box>
                </Box>
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
                bgcolor="#f5f5f5"
                p={3}
            >
                <Alert
                    severity="error"
                    sx={{
                        maxWidth: 500,
                        width: '100%',
                        borderRadius: 2,
                        boxShadow: 2
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Error loading data
                    </Typography>
                    <Typography variant="body2">
                        {error}
                    </Typography>
                </Alert>
            </Box>
        );
    }

    return (
        <div className="app-container">
            <LeftSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
                availableIndustries={availableIndustries}
            />

            <MapView
                myPlace={myPlace}
                competitors={filteredCompetitors}
                tradeAreas={tradeAreas}
                homeZipcodes={homeZipcodes}
                zipcodes={zipcodes}
                filters={filters}
                visibleTradeAreas={visibleTradeAreas}
                visibleHomeZipcodes={visibleHomeZipcodes}
                viewState={viewState}
                clickedPlace={clickedPlace}
                hoveredPlace={hoveredPlace}
                onPlaceClick={handlePlaceClick}
                onPlaceHover={handlePlaceHover}
                onMapClick={handleMapClick}
                onViewStateChange={setViewState}
                onTooltipClose={handleTooltipClose}
                onPlaceAction={handlePlaceAction}
            />

            <RightSidebar
                dataType={filters.dataType}
                selectedTradeAreas={filters.selectedTradeAreas}
            />
        </div>
    );
}