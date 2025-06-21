import * as React from 'react';
import {
  Box, Typography,
} from '@mui/material';
import { ReactFileManager } from '@thelicato/react-file-manager';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import api from 'routes/Enpoint';
import 'react-toastify/dist/ReactToastify.css';

const GalleryPage = () => {
  const [fileSystem, setFileSystem] = useState([]);
  const userToken = localStorage.getItem('token');

  const fetchFileSystem = async () => {
    try {
      const response = await api.get('/gallery', {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setFileSystem(response.data);
    } catch (error) {
      toast.error("Failed to load files");
    }
  };

  const handleUpload = async (files, currentDir) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('file', file));
      formData.append('directory', currentDir);

      await api.post('/gallery/upload', formData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success("File(s) uploaded successfully");
      fetchFileSystem();
    } catch (error) {
      toast.error("Upload failed");
    }
  };

  const handleDelete = async (item) => {
    try {
      await api.delete(`/gallery/${item.id}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      toast.success("Deleted successfully");
      fetchFileSystem();
    } catch (error) {
      toast.error("Deletion failed");
    }
  };

  useEffect(() => {
    fetchFileSystem();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <ToastContainer />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Gallery File Manager</Typography>
      </Box>

      <ReactFileManager
        fs={fileSystem}
        onUpload={handleUpload}
        onDelete={handleDelete}
        onRefresh={fetchFileSystem}
      />
    </Box>
  );
};

export default GalleryPage;
