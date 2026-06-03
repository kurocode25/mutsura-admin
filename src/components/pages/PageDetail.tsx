import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import SimpleMdeEditor from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import { getPageAdmin, createPage, updatePage, deletePage } from '../../api';

const PageDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  interface Page {
    id?: string;
    title: { ja: string; en: string };
    slug: string;
    content: { ja: string; en: string };
    created_at?: Date;
    updated_at?: Date;
  }

  const [page, setPage] = useState<Page>({
    title: { ja: '', en: '' },
    slug: '',
    content: { ja: '', en: '' }
  });

  // Determine if this is a new page based on pathname
  const isNewPage = location.pathname === '/pages/new';

  // Safe date parsing helper
  const safeParseDate = (
    dateString: string | number | Date | null | undefined
  ): Date | undefined => {
    if (!dateString) return undefined;
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return undefined;
      }
      return date;
    } catch (error) {
      console.error('Error parsing date:', dateString, error);
      return undefined;
    }
  };

  useEffect(() => {
    const renderer = new marked.Renderer();
    renderer.code = ({ text, lang }) => {
      const language = lang ? (hljs.getLanguage(lang) ? lang : 'plaintext') : 'plaintext';
      return `<pre><code class="hljs language-${language}">${hljs.highlight(text, { language: language as string }).value}</code></pre>`;
    };
    marked.use({ renderer });

    if (!isNewPage && slug) {
      const fetchPage = async () => {
        try {
          const response = await getPageAdmin(slug);
          const data = response.data;
          console.log('=== Fetching page ===');
          console.log('Raw API response:', response);
          console.log('data object:', data);

          const pageData = {
            id: data.id,
            slug: data.slug,
            title: data.title || { ja: '', en: '' },
            content: data.content,
            created_at: safeParseDate(data.created_at),
            updated_at: safeParseDate(data.updated_at)
          };

          setPage(pageData);
        } catch (error: unknown) {
          console.error('Error fetching page:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch page';
          enqueueSnackbar(`Failed to fetch page: ${errorMessage}`, { variant: 'error' });
        }
      };
      fetchPage();
    }
  }, [slug, isNewPage, enqueueSnackbar]);

  // Log page state changes for debugging
  useEffect(() => {
    console.log('Page state updated:', page);
  }, [page]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setPage((prev: Page) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Page] as Record<string, string>),
          [child]: value
        }
      }));
    } else {
      setPage((prev: Page) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleContentChange = (value: string, name: string) => {
    const [parent, child] = name.split('.');
    setPage((prev: Page) => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof Page] as Record<string, string>),
        [child]: value
      }
    }));
  };

  const editorOptions = useMemo(() => {
    return {
      spellChecker: false,
      previewRender(plainText: string): string {
        return marked.parse(plainText) as string;
      }
    };
  }, []);

  const handleSave = async () => {
    try {
      // Only send the fields expected by the API (PageDTO)
      const pageData = {
        slug: page.slug,
        title: page.title,
        content: page.content
      };

      if (isNewPage) {
        console.log('Creating new page with:', pageData);
        await createPage(pageData);
        enqueueSnackbar('Page created successfully', { variant: 'success' });
        navigate('/pages');
      } else {
        if (!page.slug) {
          enqueueSnackbar('Slug is required for updating a page.', { variant: 'error' });
          return;
        }
        console.log('Updating page with slug:', page.slug);
        await updatePage(page.slug, pageData);
        enqueueSnackbar('Page updated successfully', { variant: 'success' });
        navigate('/pages');
      }
    } catch (error: unknown) {
      console.error('Error saving page:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save page';
      enqueueSnackbar(`Failed to save page: ${errorMessage}`, { variant: 'error' });
    }
  };

  const handleDelete = async () => {
    if (isNewPage || !page.slug || !window.confirm('Are you sure you want to delete this page?')) {
      return;
    }
    try {
      await deletePage(page.slug);
      enqueueSnackbar('Page deleted successfully', { variant: 'success' });
      navigate('/pages');
    } catch (error: unknown) {
      console.error('Error deleting page:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete page';
      enqueueSnackbar(`Failed to delete page: ${errorMessage}`, { variant: 'error' });
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {isNewPage ? 'Create Page' : 'Edit Page'}
      </Typography>
      <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
        <TextField
          label="Title (JA)"
          name="title.ja"
          value={page.title.ja}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Title (EN)"
          name="title.en"
          value={page.title.en}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Slug"
          name="slug"
          value={page.slug}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        {page.created_at && (
          <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mt: 1 }}>
            Created: {format(page.created_at, 'yyyy-MM-dd HH:mm')}
          </Typography>
        )}
        {page.updated_at && (
          <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mt: 1 }}>
            Updated: {format(page.updated_at, 'yyyy-MM-dd HH:mm')}
          </Typography>
        )}

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          Content (JA)
        </Typography>
        <SimpleMdeEditor
          key={`editor-ja-${page.slug}`}
          value={page.content.ja}
          onChange={(value) => handleContentChange(value, 'content.ja')}
          options={editorOptions}
        />

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          Content (EN)
        </Typography>
        <SimpleMdeEditor
          key={`editor-en-${page.slug}`}
          value={page.content.en}
          onChange={(value) => handleContentChange(value, 'content.en')}
          options={editorOptions}
        />

        <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          {!isNewPage && (
            <Button variant="contained" color="secondary" onClick={handleDelete}>
              Delete
            </Button>
          )}
          <Button variant="outlined" onClick={() => navigate('/pages')}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default PageDetail;
