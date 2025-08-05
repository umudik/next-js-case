'use client';

import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Switch,
    FormGroup,
    Typography,
    Chip,
    Box,
    SelectChangeEvent,
    Paper,
    Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SearchIcon from '@mui/icons-material/Search';
import { FilterState, DataType, TradeAreaPercentage } from '../types';

interface LeftSidebarProps {
    filters: FilterState;
    onFiltersChange: (filters: Partial<FilterState>) => void;
    availableIndustries: string[];
}

export default function LeftSidebar({
    filters,
    onFiltersChange,
    availableIndustries
}: LeftSidebarProps) {
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onFiltersChange({ searchQuery: event.target.value });
    };

    const handleRadiusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(event.target.value) || 0;
        // Prevent negative values
        const validValue = Math.max(0, value);
        onFiltersChange({ radius: validValue });
    };

    const handleIndustryChange = (event: SelectChangeEvent<string[]>) => {
        const value = event.target.value as string[];
        onFiltersChange({ industries: value });
    };

    const handleDataTypeChange = (event: SelectChangeEvent<DataType>) => {
        onFiltersChange({ dataType: event.target.value as DataType });
    };

    const handleTradeAreaChange = (percentage: TradeAreaPercentage) => {
        const current = filters.selectedTradeAreas;
        const updated = current.includes(percentage)
            ? current.filter(p => p !== percentage)
            : [...current, percentage];
        onFiltersChange({ selectedTradeAreas: updated });
    };

    return (
        <div className="left-sidebar">
            <Box sx={{ p: 3 }}>
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                        fontWeight: 600,
                        color: '#1976d2',
                        mb: 3
                    }}
                >
                    Filters & Controls
                </Typography>


                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        mb: 3,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 2,
                        border: '1px solid #e0e0e0'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SearchIcon sx={{ color: '#1976d2' }} />
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search by business name..."
                            value={filters.searchQuery}
                            onChange={handleSearchChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#fff',
                                    borderRadius: 2,
                                    '& fieldset': {
                                        borderColor: '#e0e0e0',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#1976d2',
                                    }
                                }
                            }}
                        />
                    </Box>
                    {filters.searchQuery && (
                        <Typography
                            variant="caption"
                            sx={{
                                mt: 1,
                                display: 'block',
                                color: 'text.secondary'
                            }}
                        >
                            Searching for: "{filters.searchQuery}"
                        </Typography>
                    )}
                </Paper>

                <Accordion
                    defaultExpanded
                    sx={{
                        mb: 2,
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        '&:before': { display: 'none' }
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                            backgroundColor: '#f8f9fa',
                            borderRadius: '12px 12px 0 0',
                            '&.Mui-expanded': {
                                backgroundColor: '#e3f2fd',
                                borderBottom: '2px solid #1976d2'
                            },
                            '&:hover': {
                                backgroundColor: '#e8f4f8'
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOnIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                            <Typography sx={{ fontWeight: 500 }}>Place Analysis</Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ backgroundColor: '#fff', p: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                                <TextField
                                    label="Radius (miles)"
                                    type="number"
                                    value={filters.radius}
                                    onChange={handleRadiusChange}
                                    size="small"
                                    fullWidth
                                    inputProps={{
                                        min: 0,
                                        step: 0.1
                                    }}
                                    sx={{
                                        backgroundColor: '#fff',
                                        borderRadius: 1,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2
                                        }
                                    }}
                                />
                            </Paper>

                            <FormControl size="small" fullWidth>
                                <InputLabel>Industries</InputLabel>
                                <Select
                                    multiple
                                    value={filters.industries}
                                    onChange={handleIndustryChange}
                                    renderValue={(selected) => {
                                        if (selected.length === 0) return 'Select industries...';
                                        if (selected.length === availableIndustries.length) return 'All industries';
                                        if (selected.length <= 3) {
                                            return (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} size="small" />
                                                    ))}
                                                </Box>
                                            );
                                        }
                                        return `${selected.length} industries selected`;
                                    }}
                                >
                                    {availableIndustries.map((industry) => (
                                        <MenuItem key={industry} value={industry}>
                                            <Checkbox checked={filters.industries.includes(industry)} />
                                            {industry}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={filters.showPlaces}
                                        onChange={(e) => onFiltersChange({ showPlaces: e.target.checked })}
                                    />
                                }
                                label="Show Places"
                            />
                        </Box>
                    </AccordionDetails>
                </Accordion>

                <Accordion
                    defaultExpanded
                    sx={{
                        mb: 2,
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        '&:before': { display: 'none' }
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                            backgroundColor: '#f8f9fa',
                            borderRadius: '12px 12px 0 0',
                            '&.Mui-expanded': {
                                backgroundColor: '#e3f2fd',
                                borderBottom: '2px solid #1976d2'
                            },
                            '&:hover': {
                                backgroundColor: '#e8f4f8'
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AnalyticsIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                            <Typography sx={{ fontWeight: 500 }}>Customer Analysis</Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ backgroundColor: '#fff', p: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                                <FormControl size="small" fullWidth>
                                    <InputLabel>Data Type</InputLabel>
                                    <Select
                                        value={filters.dataType}
                                        onChange={handleDataTypeChange}
                                        sx={{
                                            backgroundColor: '#fff',
                                            borderRadius: 2
                                        }}
                                    >
                                        <MenuItem value="trade_area">Trade Area</MenuItem>
                                        <MenuItem value="home_zipcodes">Home Zipcodes</MenuItem>
                                    </Select>
                                </FormControl>
                            </Paper>

                            {filters.dataType === 'trade_area' && (
                                <FormGroup>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        Trade Area Percentages
                                    </Typography>
                                    {[30, 50, 70].map((percentage) => (
                                        <FormControlLabel
                                            key={percentage}
                                            control={
                                                <Checkbox
                                                    checked={filters.selectedTradeAreas.includes(percentage as TradeAreaPercentage)}
                                                    onChange={() => handleTradeAreaChange(percentage as TradeAreaPercentage)}
                                                />
                                            }
                                            label={`${percentage}%`}
                                        />
                                    ))}
                                </FormGroup>
                            )}

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={filters.showCustomerData}
                                        onChange={(e) => onFiltersChange({ showCustomerData: e.target.checked })}
                                    />
                                }
                                label="Show Customer Data"
                            />
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </div>
    );
}