import { useState } from 'react';
import axios from 'axios';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  LinearProgress,
  Paper,
  Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/convert', formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${file.name.replace('.pdf', '')}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setFile(null);
    } catch (err) {
      setError('Error converting file. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Please drop a PDF file');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: '#1976d2' }}>
          PDF to Word Converter
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Box
            sx={{
              border: '2px dashed #1976d2',
              borderRadius: 2,
              p: 3,
              mb: 3,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#f5f5f5'
              }
            }}
            onClick={() => document.querySelector('input[type="file"]').click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {file ? (
              <>
                <PictureAsPdfIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
                <Typography>{file.name}</Typography>
              </>
            ) : (
              <>
                <CloudUploadIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
                <Typography>Drag and drop your PDF here or click to browse</Typography>
              </>
            )}
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </Box>

          {loading && <LinearProgress sx={{ mb: 2 }} />}
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={!file || loading}
            startIcon={<CloudUploadIcon />}
            sx={{
              height: 48,
              textTransform: 'none',
              fontSize: '1.1rem'
            }}
          >
            {loading ? 'Converting...' : 'Convert to Word'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default App;