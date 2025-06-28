import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Paper,
  TextField,
  useTheme,
} from '@mui/material';
import {
  Delete,
  CloudUpload,
  Edit,
  Save,
  Close,
} from '@mui/icons-material';
import api from 'routes/Enpoint';
import {toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const FileManager = () => {
  const userDetails = useSelector((state => state.userDetails));
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [editingIdx, setEditingIdx] = useState(null);
  const [newName, setNewName] = useState('');
  const userToken = localStorage.getItem('token');
  const theme = useTheme();

  const config = {
    headers: { Authorization: `Bearer ${userToken}` },
  };

  const fetchFiles = async () => {
    try {
      const res = await api.get('/gallery', config);
      const fileData = Array.isArray(res.data) ? res.data : res.data.data || [];
      setFiles(fileData);
    } catch {
      toast.error('Failed to load files');
      setFiles([]);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect( () => {
      if(!userDetails?.accessModuleData.includes("View-gallery")){
        navigate('/dashboard')
      }
    },[])

  const handleUpload = async (e) => {
    const formData = new FormData();
    Array.from(e.target.files).forEach((file) => {
      formData.append('file', file);
    });

    try {
      const response = await api.post('/gallery', formData, {
        ...config,
        headers: { 'Content-Type': 'multipart/form-data', ...config.headers },
      });

      toast.success(`${response.data.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      fetchFiles();
    } catch {
      toast.error('Upload failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/gallery/${id}`, config);
      toast.success('File deleted');
      fetchFiles();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleRename = async (id) => {
    try {
      await api.put(
        `/gallery/rename/${id}`,
        { name: newName },
        config
      );
      toast.success('File renamed');
      setEditingIdx(null);
      setNewName('');
      fetchFiles();
    } catch {
      toast.error('Rename failed');
    }
  };

  const setNewOrder = async (newOrderFile) => {
    try {
      await api.put(
        `/gallery/re-order`,
        { files: newOrderFile },
        config
      );
      toast.success('Reorder completed');
      fetchFiles();
    } catch {
      toast.error('Reorder failed');
    }
  }
  return (
    
    <Box
      sx={{
        p: 4,
        maxWidth: 1200,
        mx: 'auto',
        fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="center"
        mb={4}
        justifyContent="space-between"
      >
        <Typography
          variant="h4"
          fontWeight={700}
          color={theme.palette.primary.main}
          sx={{ userSelect: 'none' }}
        >
          📁 File Manager
        </Typography>

        { userDetails?.accessModuleData.includes("Add-gallery") &&
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUpload />}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '1rem',
            py: 1.5,
            px: 3,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
            boxShadow: `0 4px 15px ${theme.palette.primary.main}88`,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              boxShadow: `0 6px 20px ${theme.palette.primary.dark}aa`,
              transform: 'scale(1.05)',
            },
          }}
          aria-label="Upload Files"
        >
          Upload Files
          <input type="file" hidden multiple onChange={handleUpload} />
        </Button>
      }
      </Stack>

      {files.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 4,
          }}
        >
          {files.map((file, idx) => {
            const isEditing = editingIdx === file.id;
            const baseName =
              file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      

            return (
              <Paper
                key={file.id}
                elevation={8}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('draggedIdx', idx.toString());
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const draggedIdx = Number(e.dataTransfer.getData('draggedIdx'));
                  if (draggedIdx === file.id) return;

                  const reorderedFiles = [...files];
                  const [draggedItem] = reorderedFiles.splice(draggedIdx, 1);
                  reorderedFiles.splice(idx, 0, draggedItem);

                  setFiles(reorderedFiles);

                  setNewOrder(reorderedFiles)
                }}

                sx={{
                  position: 'relative',
                  borderRadius: 3,
                  overflow: 'hidden',
                  cursor: 'default',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 1.5,
                  transition:
                    'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
                  backgroundColor: theme.palette.background.paper,
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow:
                      '0 12px 30px rgba(33, 150, 243, 0.3), 0 8px 18px rgba(33, 150, 243, 0.2)',
                  },
                  '&:hover .overlay': {
                    opacity: 1,
                    visibility: 'visible',
                  },
                }}
                aria-label={`File card: ${file.name}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setEditingIdx(file.id);
                    setNewName(baseName);
                  }
                }}
              >
              
              <Box
                component="img"
                src={`${process.env.REACT_APP_IMAGE_BASE_URL}${file.image}`}
                alt={file.name}
                onError={() => console.error('Image not found:', `${process.env.REACT_APP_IMAGE_BASE_URL}${file.image}`)}
                onLoad={() => console.log('Image loaded:', `${process.env.REACT_APP_IMAGE_BASE_URL}${file.image}`)}
                loading="lazy"
                sx={{
                  width: '100%',
                  height: 130,
                  objectFit: 'cover',
                  borderRadius: 2,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                  userSelect: 'none',
                }}
              />
                

                <Box sx={{ width: '100%', mt: 1.2, px: 1 }}>
                  {isEditing  ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TextField
                        size="small"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRename(file.id);
                          if (e.key === 'Escape') {
                            setEditingIdx(null);
                            setNewName('');
                          }
                        }}
                        autoFocus
                        fullWidth
                        sx={{
                          '& .MuiInputBase-root': {
                            borderRadius: 2,
                            backgroundColor: theme.palette.grey[50],
                          },
                        }}
                        aria-label={`Rename file input for ${file.name}`}
                      />
                      <Tooltip title="Save">
                        <IconButton
                          color="success"
                          size="small"
                          onClick={() => handleRename(file.id)}
                          aria-label="Save renamed file"
                        >
                          <Save fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cancel">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => {
                            setEditingIdx(null);
                            setNewName('');
                          }}
                          aria-label="Cancel renaming"
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  ) : (
                    <Tooltip title={file.name}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ cursor: 'pointer', userSelect: 'text' }}
                        onClick={() => {
                          setEditingIdx(file.id);
                          setNewName(baseName);
                        }}
                      >
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            mr: 1,
                          }}
                        >
                          {file.name}
                        </Typography>
                        { userDetails?.accessModuleData.includes("Edit-gallery") &&
                        <Tooltip title="Edit file name">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingIdx(file.id);
                              setNewName(baseName);
                            }}
                            aria-label="Edit file name"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>    
                       }
                      </Stack>
                    </Tooltip>
                  )}
                </Box>
            
                {/* Delete overlay button */}
                 { userDetails?.accessModuleData.includes("Edit-gallery") &&
                  <Box
                    className="overlay"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 32,
                      height: 32,
                      bgcolor: 'rgba(255, 80, 80, 0.85)',
                      opacity: 0,
                      visibility: 'hidden',
                      transition: 'opacity 0.25s ease, visibility 0.25s ease',
                      borderRadius: 2,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'rgba(255, 60, 60, 1)',
                      },
                    }}
                  >
                
                    <IconButton
                      aria-label={`Delete ${file.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.id);
                      }}
                      size="small"
                      sx={{ color: 'white', p: 0 }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                }
              </Paper>
            );
          })}
        </Box>
      ) : (
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          mt={10}
          fontStyle="italic"
        >
          No files found — Upload some to get started.
        </Typography>
      )}
    </Box>
  );
};

export default FileManager;
