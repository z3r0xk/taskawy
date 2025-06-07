import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Link,
  Grid,
  Typography,
  Chip,
  Alert,
  Snackbar,
  CardContent,
  Fade,
  Tooltip,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Fab,
  Badge,
  LinearProgress,
  useTheme,
  Divider,
  InputAdornment,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LinkIcon from '@mui/icons-material/Link';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FolderIcon from '@mui/icons-material/Folder';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { styled } from '@mui/material/styles';

interface Todo {
  id: string;
  title: string;
  url: string;
  dueDate: Date;
  completed: boolean;
}

interface TodoSection {
  id: string;
  title: string;
  todos: Todo[];
  pdfFile?: File;
  pdfUrl?: string;
  isExpanded?: boolean;
}

// Interface for storing data in localStorage
interface StoredSection {
  id: string;
  title: string;
  todos: Todo[];
  isExpanded?: boolean;
}

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
  borderRadius: theme.shape.borderRadius,
  overflow: 'visible',
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(135deg, rgba(20,20,20,0.8) 0%, rgba(30,30,30,0.8) 100%)'
    : 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(245,245,245,0.8) 100%)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.mode === 'dark' ? '#2a2a2a' : 'rgba(0,0,0,0.12)'}`,
}));

const TaskCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateX(8px)',
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(0, 255, 157, 0.1)' 
      : 'rgba(0, 204, 125, 0.1)',
  },
  background: theme.palette.mode === 'dark' 
    ? 'rgba(20,20,20,0.6)'
    : 'rgba(255,255,255,0.6)',
  backdropFilter: 'blur(5px)',
  border: `1px solid ${theme.palette.mode === 'dark' ? '#2a2a2a' : 'rgba(0,0,0,0.12)'}`,
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
}));

const FloatingAddButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  zIndex: 1000,
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.grey[theme.palette.mode === 'dark' ? 800 : 200],
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
  },
}));

export default function TodoList() {
  const theme = useTheme();
  const [sections, setSections] = useState<TodoSection[]>(() => {
    // Load sections from localStorage on initial render
    const storedData = localStorage.getItem('todoSections');
    if (storedData) {
      const parsedData: StoredSection[] = JSON.parse(storedData);
      // Convert stored date strings back to Date objects
      return parsedData.map(section => ({
        ...section,
        todos: section.todos.map(todo => ({
          ...todo,
          dueDate: new Date(todo.dueDate)
        }))
      }));
    }
    return [];
  });
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [url, setUrl] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [title, setTitle] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [isNewSectionDialogOpen, setIsNewSectionDialogOpen] = useState(false);

  // Save to localStorage whenever sections change
  useEffect(() => {
    // Store only the necessary data (exclude File objects and blob URLs)
    const dataToStore: StoredSection[] = sections.map(section => ({
      id: section.id,
      title: section.title,
      todos: section.todos,
      isExpanded: section.isExpanded
    }));
    localStorage.setItem('todoSections', JSON.stringify(dataToStore));
  }, [sections]);

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const isDuplicateSection = (title: string) => {
    return sections.some(section => section.title.toLowerCase() === title.toLowerCase());
  };

  const isDuplicateTask = (sectionId: string, url: string, taskTitle: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return false;
    return section.todos.some(
      todo => 
        todo.url.toLowerCase() === url.toLowerCase() ||
        todo.title.toLowerCase() === taskTitle.toLowerCase()
    );
  };

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    
    if (isDuplicateSection(newSectionTitle)) {
      showSnackbar('A section with this title already exists', 'error');
      return;
    }

    const newSection: TodoSection = {
      id: Date.now().toString(),
      title: newSectionTitle,
      todos: [],
      isExpanded: true,
    };
    setSections([...sections, newSection]);
    setCurrentSection(newSection.id);
    setNewSectionTitle('');
    setPdfFile(null);
    showSnackbar('Section created successfully', 'success');
  };

  const handleAddTodo = async () => {
    if (!url.trim() || !dueDate || !currentSection) return;

    // Clean the URL input - remove any newlines and extra spaces
    const cleanUrl = url.trim();
    
    // Basic URL validation
    try {
      new URL(cleanUrl);
    } catch (e) {
      showSnackbar('Please enter a valid URL', 'error');
      return;
    }

    try {
      const response = await fetch(cleanUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const pageTitle = title.trim() || doc.title || cleanUrl;

      if (isDuplicateTask(currentSection, cleanUrl, pageTitle)) {
        showSnackbar('A task with this URL or title already exists in this section', 'error');
        return;
      }

      const newTodo: Todo = {
        id: crypto.randomUUID(),
        title: pageTitle,
        url: cleanUrl,
        dueDate,
        completed: false,
      };

      setSections(sections.map(section => 
        section.id === currentSection
          ? { ...section, todos: [...section.todos, newTodo] }
          : section
      ));

      // Clear the form
      setUrl('');
      setTitle('');
      setDueDate(null);
      showSnackbar('Task added successfully', 'success');
    } catch (error) {
      console.error('Error fetching URL:', error);
      showSnackbar('Error fetching URL. Please check the URL and try again.', 'error');
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, sectionId: string) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === 'application/pdf') {
        // Create a blob URL for the PDF
        const pdfUrl = URL.createObjectURL(file);
        setSections(sections.map(section =>
          section.id === sectionId
            ? { ...section, pdfFile: file, pdfUrl }
            : section
        ));
        showSnackbar('Summary PDF uploaded successfully', 'success');
      } else {
        showSnackbar('Please upload a PDF file', 'error');
      }
    }
  };

  // Add cleanup function for blob URLs
  const cleanupPdfUrl = (section: TodoSection) => {
    if (section.pdfUrl) {
      URL.revokeObjectURL(section.pdfUrl);
    }
  };

  const handleToggleComplete = (sectionId: string, todoId: string) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            todos: section.todos.map(todo =>
              todo.id === todoId
                ? { ...todo, completed: !todo.completed }
                : todo
            ),
          }
        : section
    ));
  };

  const handleDeleteTodo = (sectionId: string, todoId: string) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            todos: section.todos.filter(todo => todo.id !== todoId),
          }
        : section
    ));
    showSnackbar('Task deleted successfully', 'success');
  };

  const handleDeleteSection = (sectionId: string) => {
    const sectionToDelete = sections.find(s => s.id === sectionId);
    if (sectionToDelete?.pdfUrl) {
      cleanupPdfUrl(sectionToDelete);
    }
    setSections(sections.filter(section => section.id !== sectionId));
    if (currentSection === sectionId) {
      setCurrentSection(null);
    }
    showSnackbar('Section deleted successfully', 'success');
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(event.target.value);
    setDueDate(date);
  };

  const handleToggleSection = (sectionId: string) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? { ...section, isExpanded: !section.isExpanded }
        : section
    ));
  };

  const getCompletionPercentage = (section: TodoSection) => {
    if (section.todos.length === 0) return 0;
    const completedTasks = section.todos.filter(todo => todo.completed).length;
    return (completedTasks / section.todos.length) * 100;
  };

  const getUpcomingTasksCount = (section: TodoSection) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return section.todos.filter(todo => !todo.completed && new Date(todo.dueDate) >= today).length;
  };

  // Cleanup URLs when component unmounts
  React.useEffect(() => {
    return () => {
      sections.forEach(section => {
        if (section.pdfUrl) {
          URL.revokeObjectURL(section.pdfUrl);
        }
      });
    };
  }, []);

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg, #00ff9d 30%, #00cc7d 90%)'
                  : 'linear-gradient(45deg, #00cc7d 30%, #009960 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Task Dashboard
            </Typography>
            <Button
              variant="contained"
              onClick={() => setIsNewSectionDialogOpen(true)}
              startIcon={<AddIcon />}
              sx={{
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg, #00ff9d 30%, #00cc7d 90%)'
                  : 'linear-gradient(45deg, #00cc7d 30%, #009960 90%)',
                color: '#000',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(0, 255, 157, 0.3)',
                },
              }}
            >
              New Section
            </Button>
          </Box>
        </Grid>

        {sections.map((section) => (
          <Grid item xs={12} key={section.id}>
            <StyledCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      {section.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <ProgressBar 
                          variant="determinate" 
                          value={getCompletionPercentage(section)}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                          {`${Math.round(getCompletionPercentage(section))}% completed`}
                        </Typography>
                      </Box>
                      <Badge 
                        badgeContent={getUpcomingTasksCount(section)} 
                        color="primary"
                        sx={{ 
                          '& .MuiBadge-badge': { 
                            fontSize: '0.9rem', 
                            height: '22px', 
                            minWidth: '22px',
                            background: theme.palette.mode === 'dark'
                              ? 'linear-gradient(45deg, #00ff9d 30%, #00cc7d 90%)'
                              : 'linear-gradient(45deg, #00cc7d 30%, #009960 90%)',
                            color: '#000',
                          }
                        }}
                      >
                        <Chip
                          size="small"
                          label={`${section.todos.length} tasks`}
                          sx={{ 
                            backgroundColor: theme.palette.mode === 'dark' 
                              ? 'rgba(255,255,255,0.05)' 
                              : 'rgba(0,0,0,0.05)',
                            borderRadius: '12px',
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        />
                      </Badge>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant={currentSection === section.id ? "contained" : "outlined"}
                      onClick={() => setCurrentSection(section.id)}
                      size="small"
                      sx={{ 
                        borderRadius: '12px',
                        textTransform: 'none',
                        minWidth: '100px',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {currentSection === section.id ? 'Selected' : 'Select'}
                    </Button>
                    <IconButton
                      onClick={() => handleToggleSection(section.id)}
                      size="small"
                      sx={{ 
                        color: theme.palette.text.secondary,
                        '&:hover': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      {section.isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteSection(section.id)}
                      size="small"
                      sx={{
                        color: theme.palette.error.main,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 51, 102, 0.1)',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Collapse in={section.isExpanded}>
                  {section.todos.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <input
                        accept="application/pdf"
                        style={{ display: 'none' }}
                        id={`section-pdf-${section.id}`}
                        type="file"
                        onChange={(e) => handleFileChange(e, section.id)}
                      />
                      <Stack direction="row" spacing={2} alignItems="center">
                        <label htmlFor={`section-pdf-${section.id}`}>
                          <Button
                            variant="outlined"
                            component="span"
                            startIcon={<PictureAsPdfIcon />}
                            size="small"
                            sx={{ 
                              borderRadius: '12px',
                              textTransform: 'none',
                              fontFamily: "'JetBrains Mono', monospace",
                            }}
                          >
                            {section.pdfFile ? 'Change Summary' : 'Add Summary'}
                          </Button>
                        </label>
                        {section.pdfUrl && (
                          <Link 
                            href={section.pdfUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              color: theme.palette.primary.main,
                              textDecoration: 'none',
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: '0.9rem',
                              '&:hover': {
                                textDecoration: 'underline',
                              },
                            }}
                          >
                            View Summary
                            <OpenInNewIcon sx={{ fontSize: '1rem' }} />
                          </Link>
                        )}
                      </Stack>
                    </Box>
                  )}

                  {section.todos.map((todo) => (
                    <TaskCard key={todo.id}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography 
                            variant="subtitle1"
                            sx={{ 
                              mb: 0.5,
                              fontFamily: "'JetBrains Mono', monospace",
                              fontWeight: 600,
                              textDecoration: todo.completed ? 'line-through' : 'none',
                              color: todo.completed ? theme.palette.text.secondary : theme.palette.text.primary,
                            }}
                          >
                            {todo.title}
                          </Typography>
                          <Link
                            href={todo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              color: theme.palette.primary.main,
                              textDecoration: 'none',
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: '0.9rem',
                              mb: 1,
                              '&:hover': {
                                textDecoration: 'underline',
                              },
                            }}
                          >
                            <LinkIcon sx={{ fontSize: '1rem' }} />
                            {todo.url}
                          </Link>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              color: theme.palette.text.secondary,
                              fontFamily: "'JetBrains Mono', monospace",
                            }}
                          >
                            <CalendarTodayIcon sx={{ fontSize: '1rem' }} />
                            {new Date(todo.dueDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            onClick={() => handleToggleComplete(section.id, todo.id)}
                            size="small"
                            sx={{
                              color: todo.completed ? theme.palette.success.main : theme.palette.text.secondary,
                              '&:hover': {
                                backgroundColor: todo.completed 
                                  ? 'rgba(0, 255, 157, 0.1)'
                                  : 'rgba(255, 255, 255, 0.1)',
                              },
                            }}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteTodo(section.id, todo.id)}
                            size="small"
                            sx={{
                              color: theme.palette.error.main,
                              '&:hover': {
                                backgroundColor: 'rgba(255, 51, 102, 0.1)',
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </TaskCard>
                  ))}
                </Collapse>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {currentSection && (
        <Box sx={{ 
          position: 'fixed',
          bottom: theme.spacing(4),
          right: theme.spacing(4),
          zIndex: 1000,
        }}>
          <StyledCard sx={{ width: '300px', p: 2 }}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="URL"
                value={url}
                onChange={(e) => {
                  const cleanInput = e.target.value.replace(/[\r\n]+/g, '');
                  setUrl(cleanInput);
                }}
                variant="outlined"
                size="small"
                placeholder="https://example.com"
                helperText="Enter a single URL"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Title (Optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant="outlined"
                size="small"
                placeholder="Task title"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AssignmentIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
                onChange={handleDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                size="small"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleAddTodo}
                disabled={!url.trim() || !dueDate}
                startIcon={<AddIcon />}
                sx={{
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, #00ff9d 30%, #00cc7d 90%)'
                    : 'linear-gradient(45deg, #00cc7d 30%, #009960 90%)',
                  color: '#000',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(0, 255, 157, 0.3)',
                  },
                }}
              >
                Add Task
              </Button>
            </Stack>
          </StyledCard>
        </Box>
      )}

      <Dialog
        open={isNewSectionDialogOpen}
        onClose={() => setIsNewSectionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, rgba(20,20,20,0.8) 0%, rgba(30,30,30,0.8) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(245,245,245,0.8) 100%)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.palette.mode === 'dark' ? '#2a2a2a' : 'rgba(0,0,0,0.12)'}`,
          }
        }}
      >
        <DialogTitle sx={{ 
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 600,
        }}>
          Create New Section
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Section Title"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FolderIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setIsNewSectionDialogOpen(false)}
            sx={{ 
              fontFamily: "'JetBrains Mono', monospace",
              textTransform: 'none',
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handleAddSection();
              setIsNewSectionDialogOpen(false);
            }}
            disabled={!newSectionTitle.trim()}
            sx={{
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #00ff9d 30%, #00cc7d 90%)'
                : 'linear-gradient(45deg, #00cc7d 30%, #009960 90%)',
              color: '#000',
              fontFamily: "'JetBrains Mono', monospace",
              textTransform: 'none',
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 