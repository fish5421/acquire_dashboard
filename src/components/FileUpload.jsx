import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import Papa from 'papaparse';

const FileUpload = ({ onUpload }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files));
    setError(null);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setFiles(Array.from(event.dataTransfer.files));
    setError(null);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const processCSV = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => {
          reject(error);
        },
        header: true,
        skipEmptyLines: true,
      });
    });
  };

  const handleUpload = async () => {
    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const processedData = [];
      let lastFileMetadata = null;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(Math.round((i / files.length) * 100));

        if (file.type === 'text/csv') {
          const data = await processCSV(file);
          processedData.push(...data);

          lastFileMetadata = {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified,
          };
        } else {
          throw new Error(`Unsupported file type: ${file.type}. Please upload CSV files only.`);
        }
      }

      const newUploadedFile = {
        name: lastFileMetadata.name,
        dateUploaded: new Date().toLocaleDateString(),
        lastUpdated: new Date().toLocaleDateString(),
        uploadedBy: 'Current User',
      };

      setUploadedFiles((prev) => [...prev, newUploadedFile]);
      onUpload(processedData, lastFileMetadata);

      setUploadProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUploading(false);
      setFiles([]);
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message);
      setUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Files and assets</h2>
      <p className="mb-4">Documents and attachments that have been uploaded as part of this project.</p>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('fileInput').click()}
      >
        <input
          data-testid="file-input"
          id="fileInput"
          type="file"
          multiple
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="mt-1">Click to upload or drag and drop</p>
        <p className="text-xs text-gray-500">CSV files only, maximum file size 50 MB</p>
      </div>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Selected files:</h3>
          <ul className="list-disc pl-5">
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
      {uploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
          </div>
          <p className="text-center mt-2">{uploadProgress}% Uploaded</p>
        </div>
      )}
      {!uploading && uploadProgress === 100 && (
        <p className="text-center mt-2">100% Uploaded</p>
      )}
      <Button className="mt-4" onClick={handleUpload} disabled={files.length === 0 || uploading} data-testid="upload-button">
        {uploading ? 'Uploading...' : 'Upload File'}
      </Button>
      {uploadedFiles.length > 0 && (
        <Table className="mt-8">
          <TableHeader>
            <TableRow>
              <TableHead>File name</TableHead>
              <TableHead>Date uploaded</TableHead>
              <TableHead>Last updated</TableHead>
              <TableHead>Uploaded by</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uploadedFiles.map((file, index) => (
              <TableRow key={index}>
                <TableCell>{file.name}</TableCell>
                <TableCell>{file.dateUploaded}</TableCell>
                <TableCell>{file.lastUpdated}</TableCell>
                <TableCell>{file.uploadedBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
};

export default FileUpload;