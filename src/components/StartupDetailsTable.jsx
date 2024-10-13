import React, { useState, useEffect, useContext } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, calculateFinancialRatio } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardContext } from '@/context/DashboardContext';
import { Trash2, ArrowUpDown } from 'lucide-react';

const StartupDetailsTable = ({ data, onSort, sortConfig }) => {
  const { removeListingFromData } = useContext(DashboardContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(25);
  const [removingRows, setRemovingRows] = useState({});
  
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  // Helper function to parse numeric values
  const parseNumericValue = (value) => {
    if (typeof value === 'string') {
      const cleanedValue = value.replace(/[^0-9.-]+/g, "");
      const parsedValue = parseFloat(cleanedValue);
      return isNaN(parsedValue) ? null : parsedValue;
    }
    return typeof value === 'number' ? value : null;
  };

  // Helper function to calculate financial ratio for sorting
  const calculateRatioForSorting = (askingPrice, denominator) => {
    const num = parseNumericValue(askingPrice);
    const den = parseNumericValue(denominator);
    if (num === null || den === null || den === 0) {
      return null;
    }
    return num / den;
  };

  // Apply sorting and pagination
  useEffect(() => {
    if (sortConfig.key) {
      console.log('Sorted data (first 5 items):');
      data.slice(0, 5).forEach((item, index) => {
        console.log(`${index + 1}. ${sortConfig.key}: ${item[sortConfig.key]}`);
      });
    }
  }, [sortConfig, data]);

  const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(data.length / recordsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleRemoveListing = (index) => {
    setRemovingRows(prev => ({ ...prev, [index]: true }));
    setTimeout(() => {
      removeListingFromData(index);
      setRemovingRows(prev => {
        const newState = { ...prev };
        delete newState[index];
        return newState;
      });
    }, 300);
  };

  // Render sort indicator
  const renderSortIndicator = (column) => {
    if (sortConfig.key === column) {
      return <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortConfig.direction === 'ascending' ? 'transform rotate-180' : ''}`} />;
    }
    return null;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/6 cursor-pointer" onClick={() => onSort('Business Type')}>
              Business Type {renderSortIndicator('Business Type')}
            </TableHead>
            <TableHead className="w-1/8 text-right cursor-pointer" onClick={() => onSort('TTM Revenue')}>
              TTM Revenue {renderSortIndicator('TTM Revenue')}
            </TableHead>
            <TableHead className="w-1/8 text-right cursor-pointer" onClick={() => onSort('TTM Profit')}>
              TTM Profit {renderSortIndicator('TTM Profit')}
            </TableHead>
            <TableHead className="w-1/8 text-right cursor-pointer" onClick={() => onSort('Asking Price')}>
              Asking Price {renderSortIndicator('Asking Price')}
            </TableHead>
            <TableHead className="w-1/8 text-right cursor-pointer" onClick={() => onSort('Price to Revenue Multiple')}>
              Price to Revenue Multiple {renderSortIndicator('Price to Revenue Multiple')}
            </TableHead>
            <TableHead className="w-1/8 text-right cursor-pointer" onClick={() => onSort('Price to Profit Multiple')}>
              Price to Profit Multiple {renderSortIndicator('Price to Profit Multiple')}
            </TableHead>
            <TableHead className="w-1/12">Marketplace Card</TableHead>
            <TableHead className="w-1/12">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentRecords.map((item, index) => (
            <TableRow 
              key={item.id || index} 
              className={`transition-all duration-300 ${removingRows[index] ? 'opacity-0 h-0' : 'opacity-100'} ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
            >
              <TableCell className="font-medium">{item['Business Type']}</TableCell>
              <TableCell className="text-right">{formatCurrency(item['TTM Revenue'])}</TableCell>
              <TableCell className="text-right">{formatCurrency(item['TTM Profit'])}</TableCell>
              <TableCell className="text-right">{formatCurrency(item['Asking Price'])}</TableCell>
              <TableCell className="text-right">
                {calculateFinancialRatio(item['Asking Price'], item['TTM Revenue'])}
              </TableCell>
              <TableCell className="text-right">
                {calculateFinancialRatio(item['Asking Price'], item['TTM Profit'])}
              </TableCell>
              <TableCell>
                <a href={item['marketplace-card href']} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                  View
                </a>
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => handleRemoveListing(index)}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-red-100 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center mt-4">
        <ul className="flex space-x-2">
          {pageNumbers.map((number) => (
            <li key={number} onClick={() => paginate(number)} className={`cursor-pointer px-3 py-2 rounded-md ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {number}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <select 
          className="border border-gray-300 rounded-md px-3 py-2" 
          value={recordsPerPage}
          onChange={(e) => {
            const newRecordsPerPage = parseInt(e.target.value);
            setCurrentPage(1);
            setRecordsPerPage(newRecordsPerPage);
          }}
        >
          <option value="25">25 per page</option>
          <option value="50">50 per page</option>
          <option value="100">100 per page</option>
        </select>
      </div>
    </div>
  );
};

export default StartupDetailsTable;