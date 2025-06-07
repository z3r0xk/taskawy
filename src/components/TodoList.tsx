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

interface MultipleTasksInput {
  urls: string;
  dueDate: Date | null;
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
  borderRadius: theme.spacing(2),
  overflow: 'visible',
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
  const [isMultipleTasksDialogOpen, setIsMultipleTasksDialogOpen] = useState(false);
  const [isNewSectionDialogOpen, setIsNewSectionDialogOpen] = useState(false);
  const [multipleTasksInput, setMultipleTasksInput] = useState<MultipleTasksInput>({
    urls: '',
    dueDate: null,
  });

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
    if (!url || !dueDate || !currentSection) return;

    try {
      const response = await fetch(url);
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const pageTitle = title || doc.title || url;

      if (isDuplicateTask(currentSection, url, pageTitle)) {
        showSnackbar('A task with this URL or title already exists in this section', 'error');
        return;
      }

      const newTodo: Todo = {
        id: Date.now().toString(),
        title: pageTitle,
        url,
        dueDate,
        completed: false,
      };

      setSections(sections.map(section => 
        section.id === currentSection
          ? { ...section, todos: [...section.todos, newTodo] }
          : section
      ));

      setUrl('');
      setDueDate(null);
      setTitle('');
      showSnackbar('Task added successfully', 'success');
    } catch (error) {
      console.error('Error fetching URL:', error);
      showSnackbar('Error fetching URL. Please check the URL and try again.', 'error');
    }
  };

  const handleAddMultipleTasks = async () => {
    if (!multipleTasksInput.urls || !multipleTasksInput.dueDate || !currentSection) return;

    const urls = multipleTasksInput.urls.split('\n').filter(url => url.trim());
    const successfulAdds: string[] = [];
    const failedAdds: string[] = [];

    for (const url of urls) {
      try {
        const response = await fetch(url.trim());
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const pageTitle = doc.title || url;

        if (isDuplicateTask(currentSection, url, pageTitle)) {
          failedAdds.push(url);
          continue;
        }

        const newTodo: Todo = {
          id: Date.now().toString() + Math.random(),
          title: pageTitle,
          url: url.trim(),
          dueDate: multipleTasksInput.dueDate,
          completed: false,
        };

        setSections(sections.map(section => 
          section.id === currentSection
            ? { ...section, todos: [...section.todos, newTodo] }
            : section
        ));

        successfulAdds.push(url);
      } catch (error) {
        console.error('Error fetching URL:', error);
        failedAdds.push(url);
      }
    }

    setIsMultipleTasksDialogOpen(false);
    setMultipleTasksInput({ urls: '', dueDate: null });

    if (successfulAdds.length > 0) {
      showSnackbar(`Successfully added ${successfulAdds.length} tasks`, 'success');
    }
    if (failedAdds.length > 0) {
      showSnackbar(`Failed to add ${failedAdds.length} tasks`, 'error');
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
    <Box sx={{ pb: 10 }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {sections.map((section) => (
        <Fade in={true} key={section.id}>
          <StyledCard sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton
                  onClick={() => handleToggleSection(section.id)}
                  size="small"
                  sx={{ mr: 1 }}
                >
                  {section.isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 500 }}>
                    {section.title}
                  </Typography>
                  <Badge 
                    badgeContent={getUpcomingTasksCount(section)} 
                    color="primary"
                    sx={{ '& .MuiBadge-badge': { fontSize: '0.9rem', height: '22px', minWidth: '22px' } }}
                  >
                    <Chip
                      size="small"
                      label={`${section.todos.length} tasks`}
                      sx={{ backgroundColor: theme.palette.background.default }}
                    />
                  </Badge>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant={currentSection === section.id ? "contained" : "outlined"}
                    onClick={() => setCurrentSection(section.id)}
                    size="small"
                    sx={{ 
                      borderRadius: '20px',
                      textTransform: 'none',
                      minWidth: '100px'
                    }}
                  >
                    {currentSection === section.id ? 'Selected' : 'Select'}
                  </Button>
                  <Tooltip title="Delete Section">
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteSection(section.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>

              <Box sx={{ px: 1, mb: 2 }}>
                <ProgressBar 
                  variant="determinate" 
                  value={getCompletionPercentage(section)}
                  sx={{ mb: 1 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {`${Math.round(getCompletionPercentage(section))}% completed`}
                </Typography>
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
                            borderRadius: '20px',
                            textTransform: 'none'
                          }}
                        >
                          {section.pdfFile ? 'Change Summary' : 'Add Summary'}
                        </Button>
                      </label>
                      {section.pdfFile && section.pdfUrl && (
                        <Stack direction="row" spacing={1}>
                          <Link
                            href={section.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <Chip
                              icon={<PictureAsPdfIcon />}
                              label={section.pdfFile.name}
                              variant="outlined"
                              color="primary"
                              onDelete={() => {
                                cleanupPdfUrl(section);
                                setSections(sections.map(s =>
                                  s.id === section.id
                                    ? { ...s, pdfFile: undefined, pdfUrl: undefined }
                                    : s
                                ));
                              }}
                              deleteIcon={
                                <Stack direction="row" spacing={0.5}>
                                  <DeleteIcon />
                                  <Divider orientation="vertical" flexItem />
                                  <OpenInNewIcon />
                                </Stack>
                              }
                              sx={{ 
                                borderRadius: '20px',
                                '& .MuiChip-deleteIcon': {
                                  display: 'flex',
                                  order: 2,
                                  mr: 0,
                                  ml: 1
                                }
                              }}
                            />
                          </Link>
                        </Stack>
                      )}
                    </Stack>
                  </Box>
                )}

                <List sx={{ pt: 0 }}>
                  {section.todos.map((todo) => (
                    <ListItem
                      key={todo.id}
                      sx={{
                        mb: 1,
                        bgcolor: theme.palette.background.default,
                        borderRadius: theme.spacing(2),
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateX(8px)',
                          bgcolor: theme.palette.action.hover,
                        },
                      }}
                      secondaryAction={
                        <Stack direction="row" spacing={1}>
                          <Tooltip title={todo.completed ? "Mark as Incomplete" : "Mark as Complete"}>
                            <IconButton
                              edge="end"
                              onClick={() => handleToggleComplete(section.id, todo.id)}
                              color={todo.completed ? "success" : "default"}
                              size="small"
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Task">
                            <IconButton
                              edge="end"
                              onClick={() => handleDeleteTodo(section.id, todo.id)}
                              color="error"
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      }
                    >
                      <ListItemText
                        primary={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Link
                              href={todo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                textDecoration: todo.completed ? 'line-through' : 'none',
                                color: todo.completed ? 'text.disabled' : 'primary.main',
                                fontWeight: 500,
                              }}
                            >
                              {todo.title}
                            </Link>
                            <Chip
                              size="small"
                              icon={<CalendarTodayIcon sx={{ fontSize: '0.9rem' }} />}
                              label={new Date(todo.dueDate).toLocaleDateString()}
                              variant="outlined"
                              sx={{ 
                                borderRadius: '12px',
                                height: '24px',
                                '& .MuiChip-label': { px: 1, fontSize: '0.75rem' }
                              }}
                            />
                          </Stack>
                        }
                        secondary={
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              mt: 0.5
                            }}
                          >
                            <LinkIcon sx={{ fontSize: '0.9rem' }} />
                            {todo.url}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </CardContent>
          </StyledCard>
        </Fade>
      ))}

      <FloatingAddButton 
        color="primary" 
        onClick={() => setIsNewSectionDialogOpen(true)}
        variant="extended"
      >
        <AddIcon sx={{ mr: 1 }} />
        New Section
      </FloatingAddButton>

      {/* New Section Dialog */}
      <Dialog
        open={isNewSectionDialogOpen}
        onClose={() => setIsNewSectionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Section</DialogTitle>
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
          <Button onClick={() => setIsNewSectionDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              handleAddSection();
              setIsNewSectionDialogOpen(false);
            }}
            disabled={!newSectionTitle.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Multiple Tasks Dialog */}
      <Dialog
        open={isMultipleTasksDialogOpen}
        onClose={() => setIsMultipleTasksDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Multiple Tasks</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="URLs (One per line)"
              value={multipleTasksInput.urls}
              onChange={(e) => setMultipleTasksInput({ ...multipleTasksInput, urls: e.target.value })}
              variant="outlined"
              placeholder="https://example1.com&#10;https://example2.com&#10;https://example3.com"
              sx={{ mb: 2 }}
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
              label="Due Date"
              type="date"
              value={multipleTasksInput.dueDate ? multipleTasksInput.dueDate.toISOString().split('T')[0] : ''}
              onChange={(e) => setMultipleTasksInput({ ...multipleTasksInput, dueDate: new Date(e.target.value) })}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsMultipleTasksDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddMultipleTasks}
            variant="contained"
            disabled={!multipleTasksInput.urls.trim() || !multipleTasksInput.dueDate}
          >
            Add Tasks
          </Button>
        </DialogActions>
      </Dialog>

      {currentSection && (
        <FloatingAddButton 
          color="secondary" 
          onClick={() => setIsMultipleTasksDialogOpen(true)}
          sx={{ bottom: theme.spacing(16) }}
          variant="extended"
        >
          <AddIcon sx={{ mr: 1 }} />
          Add Tasks
        </FloatingAddButton>
      )}
    </Box>
  );
} 