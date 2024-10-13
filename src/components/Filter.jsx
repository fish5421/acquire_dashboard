import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HelpCircle, X } from 'lucide-react';
import RangeFilter from './RangeFilter';
import { DashboardContext } from '../context/DashboardContext';

const Filter = ({ data = [] }) => {
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  const { filters, setFilters, filterRanges, hasUploadedData } = useContext(DashboardContext);

  const businessTypes = useMemo(() => {
    if (!data || data.length === 0) return ['all'];
    return ['all', ...new Set(data.map(item => item['Business Type']))];
  }, [data]);

  useEffect(() => {
    const newActiveFilters = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && (value[0] > filterRanges[key][0] || value[1] < filterRanges[key][1])) {
        newActiveFilters[key] = true;
      } else if (key === 'businessType' && value !== 'all') {
        newActiveFilters[key] = true;
      }
    });
    setActiveFilters(newActiveFilters);
  }, [filters, filterRanges]);

  const handleFilterChange = (key, newValue) => {
    setFilters(prevFilters => ({ ...prevFilters, [key]: newValue }));
  };

  const handleResetFilter = (key) => {
    const resetValue = key === 'businessType' ? 'all' : filterRanges[key];
    handleFilterChange(key, resetValue);
  };

  const resetAllFilters = () => {
    setFilters({
      revenue: filterRanges.revenue,
      profit: filterRanges.profit,
      price: filterRanges.price,
      businessType: 'all',
    });
  };

  const generatePresets = (key) => {
    const [min, max] = filterRanges[key];
    const range = max - min;
    return [
      { label: `${min} - ${min + range * 0.25}`, min: min, max: min + range * 0.25 },
      { label: `${min + range * 0.25} - ${min + range * 0.5}`, min: min + range * 0.25, max: min + range * 0.5 },
      { label: `${min + range * 0.5} - ${min + range * 0.75}`, min: min + range * 0.5, max: min + range * 0.75 },
      { label: `${min + range * 0.75} - ${max}`, min: min + range * 0.75, max: max },
    ];
  };

  const ContextualHelp = ({ id, content }) => (
    <div className="relative inline-block ml-2">
      <HelpCircle
        className="w-4 h-4 text-gray-400 cursor-help"
        onMouseEnter={() => setActiveTooltip(id)}
        onMouseLeave={() => setActiveTooltip(null)}
      />
      {activeTooltip === id && (
        <div className="absolute z-10 w-64 p-2 mt-2 text-sm bg-white rounded-md shadow-lg border border-gray-200">
          {content}
        </div>
      )}
    </div>
  );

  const ActiveFilterIndicator = ({ isActive, onReset }) => (
    <div className="ml-2 w-6 h-6 flex items-center justify-center">
      {isActive && (
        <Button
          variant="outline"
          size="sm"
          className="px-1 py-0"
          onClick={onReset}
          aria-label="Reset filter"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  if (!data) {
    return (
      <Card className="w-full">
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <p className="text-xl font-semibold">Loading filters...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Filters</span>
          {hasUploadedData && (
            <Button onClick={resetAllFilters} variant="outline" size="sm">
              Reset All Filters
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {!hasUploadedData ? (
            <div className="flex flex-col items-center justify-center h-64">
              <h3 className="text-xl font-semibold mb-2">No Data to Display</h3>
              <p className="text-gray-600 mb-4">Upload data from the File Management page to see available filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <span className="flex-grow">Revenue</span>
                    <ContextualHelp
                      id="help-revenue"
                      content="Set the revenue range for startups to display"
                    />
                    <ActiveFilterIndicator
                      isActive={activeFilters.revenue}
                      onReset={() => handleResetFilter('revenue')}
                    />
                  </h3>
                  <RangeFilter
                    label="Revenue Range"
                    min={filterRanges.revenue[0]}
                    max={filterRanges.revenue[1]}
                    value={filters.revenue}
                    onChange={(value) => handleFilterChange('revenue', value)}
                    presets={generatePresets('revenue')}
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <span className="flex-grow">Profit</span>
                    <ContextualHelp
                      id="help-profit"
                      content="Set the profit range for startups to display"
                    />
                    <ActiveFilterIndicator
                      isActive={activeFilters.profit}
                      onReset={() => handleResetFilter('profit')}
                    />
                  </h3>
                  <RangeFilter
                    label="Profit Range"
                    min={filterRanges.profit[0]}
                    max={filterRanges.profit[1]}
                    value={filters.profit}
                    onChange={(value) => handleFilterChange('profit', value)}
                    presets={generatePresets('profit')}
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <span className="flex-grow">Price</span>
                    <ContextualHelp
                      id="help-price"
                      content="Set the asking price range for startups to display"
                    />
                    <ActiveFilterIndicator
                      isActive={activeFilters.price}
                      onReset={() => handleResetFilter('price')}
                    />
                  </h3>
                  <RangeFilter
                    label="Price Range"
                    min={filterRanges.price[0]}
                    max={filterRanges.price[1]}
                    value={filters.price}
                    onChange={(value) => handleFilterChange('price', value)}
                    presets={generatePresets('price')}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700 flex items-center">
                  <span className="flex-grow">Business Type</span>
                  <ContextualHelp
                    id="help-business-type"
                    content="Filter startups by their business type"
                  />
                  <ActiveFilterIndicator
                    isActive={activeFilters.businessType}
                    onReset={() => handleResetFilter('businessType')}
                  />
                </h3>
                <Select
                  value={filters.businessType}
                  onValueChange={(value) => handleFilterChange('businessType', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === 'all' ? 'All' : type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Filter;