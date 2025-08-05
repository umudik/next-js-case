'use client';

import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Divider
} from '@mui/material';
import { DataType, TradeAreaPercentage } from '../types';

interface RightSidebarProps {
    dataType: DataType;
    selectedTradeAreas: TradeAreaPercentage[];
    homeZipcodesPercentiles?: number[];
}

const TRADE_AREA_COLORS = {
    30: '#ff4336',
    50: '#4caf50',
    70: '#2196f3'
};

const HOME_ZIPCODES_COLORS = [
    '#fee08b',
    '#fdae61',
    '#f46d43',
    '#d73027',
    '#a50026'
];

export default function RightSidebar({
    dataType,
    selectedTradeAreas,
    homeZipcodesPercentiles = []
}: RightSidebarProps) {
    const renderTradeAreaLegend = () => (
        <Box>
            <Typography variant="h6" gutterBottom>
                Trade Area Legend
            </Typography>
            {selectedTradeAreas.map((percentage) => (
                <Box key={percentage} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                        sx={{
                            width: 20,
                            height: 20,
                            backgroundColor: TRADE_AREA_COLORS[percentage],
                            borderRadius: 1,
                            mr: 1,
                            opacity: percentage === 30 ? 0.8 : percentage === 50 ? 0.6 : 0.4
                        }}
                    />
                    <Typography variant="body2">
                        {percentage}% Trade Area
                    </Typography>
                </Box>
            ))}
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                %30 = En küçük alan (yüksek opaklık)<br />
                %70 = En geniş alan (düşük opaklık)
            </Typography>
        </Box>
    );

    const renderHomeZipcodesLegend = () => {
        const percentileRanges = [
            { label: '0-20', range: '0-4.5%' },
            { label: '20-40', range: '4.5%-25%' },
            { label: '40-60', range: '25%-29%' },
            { label: '60-80', range: '29%-32.6%' },
            { label: '80-100', range: '32.6%-45%' }
        ];

        return (
            <Box>
                <Typography variant="h6" gutterBottom>
                    Home Zipcodes Legend
                </Typography>
                {percentileRanges.map((item, index) => (
                    <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box
                            sx={{
                                width: 20,
                                height: 20,
                                backgroundColor: HOME_ZIPCODES_COLORS[index],
                                borderRadius: 1,
                                mr: 1
                            }}
                        />
                        <Typography variant="body2">
                            {item.label}: {item.range}
                        </Typography>
                    </Box>
                ))}
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Percentile groups based on customer distribution
                </Typography>
            </Box>
        );
    };

    return (
        <div className="right-sidebar">
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Legend
                </Typography>

                <Paper sx={{ p: 2 }}>
                    {dataType === 'trade_area' ? (
                        renderTradeAreaLegend()
                    ) : (
                        renderHomeZipcodesLegend()
                    )}
                </Paper>

                <Divider sx={{ my: 2 }} />

                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Places Legend
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box
                            sx={{
                                width: 20,
                                height: 20,
                                backgroundColor: '#2196f3',
                                borderRadius: '50%',
                                mr: 1,
                                border: '3px solid #fff',
                                boxShadow: '0 0 0 2px #2196f3'
                            }}
                        />
                        <Typography variant="body2">My Place</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box
                            sx={{
                                width: 20,
                                height: 20,
                                backgroundColor: '#ff9800',
                                borderRadius: '50%',
                                mr: 1
                            }}
                        />
                        <Typography variant="body2">Other Places</Typography>
                    </Box>
                </Paper>
            </Box>
        </div>
    );
}