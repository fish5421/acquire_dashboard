import React, { createContext, useState, useMemo, useCallback } from 'react';

const DashboardContext = createContext();

const defaultFilters = {
  revenue: [0, 10000000],  // Default range for revenue
  profit: [0, 10000000],   // Default range for profit
  price: [0, 100000000],   // Default range for price
  businessType: 'all'      // Default business type
};

const defaultFilterRanges = {
  revenue: [0, 10000000],
  profit: [0, 10000000],
  price: [0, 100000000],
};

const DashboardProvider = ({ children }) => {
  const [filters, setFilters] = useState(defaultFilters);
  const [filterRanges, setFilterRanges] = useState(defaultFilterRanges);
  const [data, setData] = useState([]);
  const [hasUploadedData, setHasUploadedData] = useState(false);

  const updateFilterRanges = useCallback((newData) => {
    if (newData.length === 0) {
      setFilterRanges(defaultFilterRanges);
      setFilters(defaultFilters);
    } else {
      const newRanges = {
        revenue: [
          Math.min(...newData.map(item => item['TTM Revenue'])),
          Math.max(...newData.map(item => item['TTM Revenue']))
        ],
        profit: [
          Math.min(...newData.map(item => item['TTM Profit'])),
          Math.max(...newData.map(item => item['TTM Profit']))
        ],
        price: [
          Math.min(...newData.map(item => item['Asking Price'])),
          Math.max(...newData.map(item => item['Asking Price']))
        ],
      };
      setFilterRanges(newRanges);
      setFilters(prevFilters => ({
        ...prevFilters,
        revenue: newRanges.revenue,
        profit: newRanges.profit,
        price: newRanges.price,
      }));
    }
  }, []);

  const removeListingFromData = useCallback((index) => {
    setData(prevData => {
      const newData = [...prevData];
      newData.splice(index, 1);
      updateFilterRanges(newData);
      setHasUploadedData(newData.length > 0);
      return newData;
    });
  }, [updateFilterRanges]);

  const setDataAndUpdateUploadStatus = useCallback((newData) => {
    setData(newData);
    setHasUploadedData(newData.length > 0);
    updateFilterRanges(newData);
  }, [updateFilterRanges]);

  const value = useMemo(() => ({
    filters,
    setFilters,
    filterRanges,
    updateFilterRanges,
    data,
    setData: setDataAndUpdateUploadStatus,
    removeListingFromData,
    hasUploadedData,
  }), [filters, filterRanges, data, removeListingFromData, updateFilterRanges, hasUploadedData, setDataAndUpdateUploadStatus]);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export { DashboardContext, DashboardProvider };