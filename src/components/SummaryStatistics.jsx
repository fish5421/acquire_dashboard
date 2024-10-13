import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

const SummaryStatistics = ({ averageMetrics, hasUploadedData, generateReport }) => {
  console.log('SummaryStatistics rendered with:', { averageMetrics, hasUploadedData });

  const renderMetric = (key, value) => {
    console.log(`Rendering metric: ${key} = ${value}`);
    return (
      <div key={key}>
        <p className="text-sm font-medium text-gray-500">{`Avg ${key.replace('avg', '')}`}</p>
        <p className="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900">
          {key.includes('PriceTo')
            ? value // Already formatted in Dashboard.jsx
            : typeof value === 'number'
              ? formatCurrency(value)
              : value || 'N/A'}
        </p>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Summary Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {!hasUploadedData ? (
          <div className="flex flex-col items-center justify-center h-64 col-span-full">
            <h3 className="text-xl font-semibold mb-2">No Data Available</h3>
            <p className="text-gray-600 mb-4">Upload data from the File Management page to see summary statistics.</p>
          </div>
        ) : (
          <>
            {Object.entries(averageMetrics).map(([key, value]) => renderMetric(key, value))}
            <div className="flex items-center">
              <Button onClick={generateReport} disabled={!hasUploadedData}>
                Generate Report
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryStatistics;