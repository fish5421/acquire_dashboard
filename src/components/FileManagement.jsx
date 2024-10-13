import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from './FileUpload';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DashboardContext } from '../context/DashboardContext';

const FileManagement = ({ setIsLoading, fileMetadata, setFileMetadata }) => {
  const navigate = useNavigate();
  const { setData, updateFilterRanges } = useContext(DashboardContext);

  const handleFileUpload = async (processedData, metadata) => {
    console.log('Data processed:', processedData);
    setIsLoading(true);
    setData(processedData);
    updateFilterRanges(processedData);
    setFileMetadata(metadata);
    setIsLoading(false);
    navigate('/'); // Redirect to the Dashboard page after successful upload
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">File Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>Files and Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload onUpload={handleFileUpload} />
        </CardContent>
      </Card>

      {fileMetadata && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded File Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>File Name:</strong> {fileMetadata.name}</p>
              <p><strong>File Type:</strong> {fileMetadata.type}</p>
              <p><strong>File Size:</strong> {(fileMetadata.size / 1024).toFixed(2)} KB</p>
              <p><strong>Last Modified:</strong> {new Date(fileMetadata.lastModified).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileManagement;