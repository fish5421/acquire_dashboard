import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Upload, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900';
  };

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-screen">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <span className="text-gray-900 font-bold text-lg">Micro Startup Dashboard</span>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2 py-4">
          <li>
            <Link to="/" className={`flex items-center px-4 py-2 text-sm font-medium ${isActive('/')}`}>
              <Home className="mr-3 h-6 w-6" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/file-management" className={`flex items-center px-4 py-2 text-sm font-medium ${isActive('/file-management')}`}>
              <FileText className="mr-3 h-6 w-6" />
              File Management
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4 space-y-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Quick Actions</h3>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            className="w-full flex items-center justify-center"
            onClick={() => {/* TODO: Implement file upload logic */}}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            className="w-full flex items-center justify-center"
            onClick={() => {/* TODO: Implement report generation logic */}}
          >
            <BarChart2 className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Sidebar;