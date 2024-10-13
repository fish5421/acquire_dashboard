import React, { useState, useMemo, useEffect, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { formatCurrency, calculateFinancialRatio, formatRatio } from "@/lib/utils";
import logError from "@/lib/errorLogger";
import Filter from './Filter';
import StartupDetailsTable from './StartupDetailsTable';
import RevenueVsPriceChart from './RevenueVsPriceChart';
import ProfitVsPriceChart from './ProfitVsPriceChart';
import SummaryStatistics from './SummaryStatistics';
import { DashboardContext } from '../context/DashboardContext';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

const Dashboard = ({ isLoading }) => {
  const [hasUploadedData, setHasUploadedData] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [error, setError] = useState(null);
  const { data, filters, updateFilterRanges } = useContext(DashboardContext);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedDashboard');
    if (hasVisited) {
      setIsFirstVisit(false);
    } else {
      localStorage.setItem('hasVisitedDashboard', 'true');
    }
  }, []);

  const processData = useCallback(() => {
    try {
      console.log('Processing data. Data length:', data.length);
      console.log('Sample data item:', data[0]);
      if (data.length > 0 && !hasUploadedData) {
        console.log('Updating filter ranges');
        setHasUploadedData(true);
        updateFilterRanges(data);
      }
    } catch (err) {
      logError(err, { component: 'Dashboard', function: 'processData' });
      setError('An error occurred while processing the data. Please try again.');
    }
  }, [data, hasUploadedData, updateFilterRanges]);

  useEffect(() => {
    processData();
  }, [processData]);

  const generateReport = () => {
    console.log('Generating report');
    // ... (rest of the generateReport function remains unchanged)
  };

  const filteredData = useMemo(() => {
    console.log('Applying filters:', filters);
    if (!hasUploadedData || !filters) return data;
    const filtered = data.filter(item =>
      (!filters.revenue || (item['TTM Revenue'] >= filters.revenue[0] && item['TTM Revenue'] <= filters.revenue[1])) &&
      (!filters.profit || (item['TTM Profit'] >= filters.profit[0] && item['TTM Profit'] <= filters.profit[1])) &&
      (!filters.price || (item['Asking Price'] >= filters.price[0] && item['Asking Price'] <= filters.price[1])) &&
      (!filters.businessType || filters.businessType === 'all' || item['Business Type'] === filters.businessType)
    );
    console.log('Filtered data length:', filtered.length);
    return filtered;
  }, [data, filters, hasUploadedData]);

  const sortedData = useMemo(() => {
    console.log('Sorting data. Sort config:', sortConfig);
    if (!hasUploadedData) return [];
    let sortableItems = [...filteredData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === 'Price to Revenue Multiple') {
          aValue = calculateFinancialRatio(a['Asking Price'], a['TTM Revenue']);
          bValue = calculateFinancialRatio(b['Asking Price'], b['TTM Revenue']);
        } else if (sortConfig.key === 'Price to Profit Multiple') {
          aValue = calculateFinancialRatio(a['Asking Price'], a['TTM Profit']);
          bValue = calculateFinancialRatio(b['Asking Price'], b['TTM Profit']);
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }
        if (aValue === 'N/A' && bValue === 'N/A') return 0;
        if (aValue === 'N/A') return sortConfig.direction === 'ascending' ? 1 : -1;
        if (bValue === 'N/A') return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    console.log('Sorted data length:', sortableItems.length);
    return sortableItems;
  }, [filteredData, sortConfig, hasUploadedData]);

  const handleSort = (key) => {
    console.log('Handling sort. Key:', key);
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const averageMetrics = useMemo(() => {
    console.log('Calculating average metrics');
    if (!hasUploadedData || filteredData.length === 0) {
      return {
        avgRevenue: 0,
        avgProfit: 0,
        avgPrice: 0,
        avgPriceToRevenue: 'N/A',
        avgPriceToProfit: 'N/A',
      };
    }
    const sum = filteredData.reduce((acc, item) => {
      acc.revenue += Number(item['TTM Revenue']) || 0;
      acc.profit += Number(item['TTM Profit']) || 0;
      acc.price += Number(item['Asking Price']) || 0;
      const priceToRevenue = calculateFinancialRatio(item['Asking Price'], item['TTM Revenue']);
      const priceToProfit = calculateFinancialRatio(item['Asking Price'], item['TTM Profit']);
      console.log(`Item: Price to Revenue = ${priceToRevenue}, Price to Profit = ${priceToProfit}`);
      if (priceToRevenue !== 'N/A') {
        acc.priceToRevenue += Number(priceToRevenue.replace('x', '')) || 0;
        acc.validPriceToRevenue += 1;
      }
      if (priceToProfit !== 'N/A') {
        acc.priceToProfit += Number(priceToProfit.replace('x', '')) || 0;
        acc.validPriceToProfit += 1;
      }
      return acc;
    }, { revenue: 0, profit: 0, price: 0, priceToRevenue: 0, priceToProfit: 0, validPriceToRevenue: 0, validPriceToProfit: 0 });

    const count = filteredData.length;
    const metrics = {
      avgRevenue: sum.revenue / count || 0,
      avgProfit: sum.profit / count || 0,
      avgPrice: sum.price / count || 0,
      avgPriceToRevenue: sum.validPriceToRevenue > 0 ? formatRatio((sum.priceToRevenue / sum.validPriceToRevenue)) : 'N/A',
      avgPriceToProfit: sum.validPriceToProfit > 0 ? formatRatio((sum.priceToProfit / sum.validPriceToProfit)) : 'N/A',
    };
    console.log('Calculated average metrics:', metrics);
    console.log(`Valid Price to Revenue ratios: ${sum.validPriceToRevenue}, Sum: ${sum.priceToRevenue}`);
    console.log(`Valid Price to Profit ratios: ${sum.validPriceToProfit}, Sum: ${sum.priceToProfit}`);
    return metrics;
  }, [filteredData, hasUploadedData]);

  const OnboardingOverlay = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-white p-8 rounded-lg max-w-2xl"
      >
        <h2 className="text-2xl font-bold mb-4">Welcome to Dashboard 2.0!</h2>
        <p className="mb-4">Here's a quick guide to get you started:</p>
        <ul className="list-disc list-inside mb-4">
          <li>Use the filters at the top to refine your data</li>
          <li>Check out the summary statistics for a quick overview</li>
          <li>Explore the charts to visualize trends</li>
          <li>View detailed startup information in the table below</li>
        </ul>
        <button onClick={() => setIsFirstVisit(false)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Get Started
        </button>
      </motion.div>
    </motion.div>
  );

  const EmptyStateMessage = ({ title, message }) => (
    <div className="flex flex-col items-center justify-center h-64">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{message}</p>
    </div>
  );

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

  if (error) {
    logError(new Error(error), { component: 'Dashboard', location: 'render' });
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <h2 className="text-lg font-semibold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard 2.0</h1>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-xl font-semibold">Loading data...</p>
        </div>
      ) : (
        <>
          <AnimatePresence>
            {isFirstVisit && <OnboardingOverlay />}
          </AnimatePresence>
          <Filter data={data} />

      <SummaryStatistics
        averageMetrics={averageMetrics}
        hasUploadedData={hasUploadedData}
        generateReport={generateReport}
      />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  Revenue vs Price
                  <ContextualHelp
                    id="help-revenue-price"
                    content="This chart shows the relationship between a startup's revenue and its asking price"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!hasUploadedData ? (
                  <EmptyStateMessage
                    title="No Data to Display"
                    message="Upload data from the File Management page to see the Revenue vs Price chart."
                  />
                ) : (
                  <RevenueVsPriceChart data={filteredData} />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Profit vs Price
                  <ContextualHelp
                    id="help-profit-price"
                    content="This chart shows the relationship between a startup's profit and its asking price"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!hasUploadedData ? (
                  <EmptyStateMessage
                    title="No Data to Display"
                    message="Upload data from the File Management page to see the Profit vs Price chart."
                  />
                ) : (
                  <ProfitVsPriceChart data={filteredData} />
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                Startup Details
                <ContextualHelp
                  id="help-startup-details"
                  content="This table shows detailed information for each startup matching your filters"
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!hasUploadedData ? (
                <EmptyStateMessage
                  title="No Startup Data Available"
                  message="Upload data from the File Management page to see detailed startup information."
                />
              ) : (
                <StartupDetailsTable data={sortedData} onSort={handleSort} sortConfig={sortConfig} />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Dashboard;