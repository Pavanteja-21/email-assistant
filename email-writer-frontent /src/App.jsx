import {
  Box,
  Container,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/email/generate', {
        emailContent,
        tone,
      });
      setGeneratedReply(
        typeof response.data === 'string'
          ? response.data
          : JSON.stringify(response.data)
      );
    } catch (error) {
      setGeneratedReply('⚠️ Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
    setCopied(true);
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 6,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          textAlign: 'center',
          p: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: 'white',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        }}
      >
        <Typography variant="h3" fontWeight="bold">
          ✨ Email Reply Generator
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
          Instantly craft professional, casual, or friendly replies
        </Typography>
      </Box>

      {/* Input Form */}
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 4,
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255,255,255,0.9)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
        }}
      >
        <Typography variant="h6" gutterBottom>
          📝 Paste Your Email
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Original Email Content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 3 }}
        />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Tone</InputLabel>
          <Select
            value={tone}
            label="Tone"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={!emailContent || loading}
          sx={{
            py: 1.5,
            fontWeight: 'bold',
            fontSize: '1rem',
            borderRadius: 3,
            background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
            boxShadow: '0 4px 14px rgba(124,58,237,0.4)',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.03)',
              background: 'linear-gradient(90deg, #4338ca, #6d28d9)',
            },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : '🚀 Generate Reply'}
        </Button>
      </Paper>

      {/* Reply Section with animation */}
      <AnimatePresence>
        {generatedReply && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4 }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 4,
                backgroundColor: 'rgba(249,250,251,0.95)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
              }}
            >
              <Typography variant="h6" gutterBottom>
                ✅ Your AI-Generated Reply
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                value={generatedReply}
                InputProps={{ readOnly: true }}
                sx={{
                  mb: 2,
                  borderRadius: 3,
                  backgroundColor: 'white',
                }}
              />
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  onClick={handleCopy}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: '#eef2ff',
                    },
                  }}
                >
                  📋 Copy to Clipboard
                </Button>
                <Button
                  variant="text"
                  color="error"
                  onClick={() => setGeneratedReply('')}
                >
                  Clear
                </Button>
              </Stack>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Snackbar */}
      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ borderRadius: 3 }}>
          ✅ Copied to Clipboard!
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
