import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import FileManagement from './components/FileManagement';
import Sidebar from './components/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';
import { DashboardProvider } from './context/DashboardContext';
import './index.css';

const Layout = ({ children }) => (
  <div className="flex h-screen bg-white">
    <Sidebar />
    <main className="flex-1 overflow-x-hidden overflow-y-auto">
      {children}
    </main>
  </div>
);

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [fileMetadata, setFileMetadata] = useState(null);

  return (
    <ErrorBoundary>
      <Router>
        <DashboardProvider>
          <div className="App">
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard isLoading={isLoading} />} />
                <Route path="/file-management" element={
                  <FileManagement 
                    setIsLoading={setIsLoading}
                    fileMetadata={fileMetadata}
                    setFileMetadata={setFileMetadata}
                  />
                } />
              </Routes>
            </Layout>
          </div>
        </DashboardProvider>
      </Router>
    </ErrorBoundary>
  );
}