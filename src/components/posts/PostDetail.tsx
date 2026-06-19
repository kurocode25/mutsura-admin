import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  FormLabel,
  type SelectChangeEvent
} from '@mui/material';
import SimpleMdeEditor from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import {
  getCategories,
  getTags,
  getAdminPost,
  createPost,
  updatePost,
  deletePost
} from '../../api';

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = error.response;
    if (response && typeof response === 'object' && 'data' in response) {
      const data = response.data;
      if (
        data &&
        typeof data === 'object' &&
        'message' in data &&
        typeof data.message === 'string'
      ) {
        return data.message;
      }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

const PostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  interface Post {
    id?: string;
    title: { ja: string; en: string };
    slug: string;
    content: { ja: string; en: string };
    category: { slug: string; name: { ja: string; en: string } };
    tags: { slug: string; name: { ja: string; en: string } }[];
    is_draft: boolean;
    has_english: boolean;
    published_at: Date | null;
    created_at?: Date;
    updated_at?: Date;
  }

  const [post, setPost] = useState<Post>({
    title: { ja: '', en: '' },
    slug: '',
    content: { ja: '', en: '' },
    category: { slug: '', name: { ja: '', en: '' } },
    tags: [],
    is_draft: true,
    has_english: false,
    published_at: null
  });
  const [allCategories, setAllCategories] = useState<
    { slug: string; name: { ja: string; en: string } }[]
  >([]);
  const [allTags, setAllTags] = useState<{ slug: string; name: { ja: string; en: string } }[]>([]);
  const isNewPost = slug === 'new';

  useEffect(() => {
    const renderer = new marked.Renderer();
    renderer.code = ({ text, lang }) => {
      const language = lang ? (hljs.getLanguage(lang) ? lang : 'plaintext') : 'plaintext';
      return `<pre><code class="hljs language-${language}">${hljs.highlight(text, { language: language as string }).value}</code></pre>`;
    };
    marked.use({ renderer });
    const fetchInitialData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([getCategories(), getTags()]);
        setAllCategories(categoriesRes.data);
        setAllTags(tagsRes.data);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        enqueueSnackbar('Failed to fetch categories or tags', { variant: 'error' });
      }
    };

    fetchInitialData();

    if (!isNewPost && slug) {
      const fetchPost = async () => {
        try {
          const response = await getAdminPost(slug);
          const data = response.data;
          setPost({
            ...data,
            tags: data.tags || [],
            published_at: data.published_at ? new Date(data.published_at) : null,
            created_at: data.created_at ? new Date(data.created_at) : undefined,
            updated_at: data.updated_at ? new Date(data.updated_at) : undefined
          });
        } catch (error: unknown) {
          console.error('Error fetching post:', error);
          const errorMessage = getErrorMessage(error, '記事の取得に失敗しました。');
          enqueueSnackbar(`Failed to fetch post: ${errorMessage}`, { variant: 'error' });
        }
      };
      fetchPost();
    }
  }, [slug, isNewPost, enqueueSnackbar]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setPost((prev: Post) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Post] as Record<string, string>),
          [child]: value
        }
      }));
    } else {
      setPost((prev: Post) => ({ ...prev, [name as keyof Post]: value }));
    }
  };

  const handleContentChange = (value: string, name: string) => {
    const [parent, child] = name.split('.');
    setPost((prev: Post) => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof Post] as Record<string, string>),
        [child]: value
      }
    }));
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const selectedCategory = allCategories.find((cat) => cat.slug === event.target.value);
    setPost((prev: Post) => ({
      ...prev,
      category: selectedCategory || { slug: '', name: { ja: '', en: '' } }
    }));
  };

  const handleTagChange = (event: SelectChangeEvent<string[]>) => {
    const selectedSlugs = event.target.value as string[];
    const selectedTags = allTags.filter((tag) => selectedSlugs.includes(tag.slug));
    setPost((prev: Post) => ({ ...prev, tags: selectedTags }));
  };

  const handleSave = async () => {
    try {
      let response;
      if (isNewPost) {
        response = await createPost(post);
      } else {
        if (!post.slug) {
          enqueueSnackbar('Slug is required for updating a post.', { variant: 'error' });
          return;
        }
        response = await updatePost(post.slug, post);
      }

      if (response.status === 200 || response.status === 201) {
        enqueueSnackbar('Post saved successfully', { variant: 'success' });
        navigate('/');
      } else {
        const errorData = response.data;
        console.error('Save failed:', errorData);
        enqueueSnackbar(`Save failed: ${JSON.stringify(errorData)}`, { variant: 'error' });
      }
    } catch (error) {
      console.error('Error saving post:', error);
      enqueueSnackbar('An error occurred on the server', { variant: 'error' });
    }
  };

  const handleDelete = async () => {
    if (isNewPost || !post.slug || !window.confirm('本当にこの記事を削除しますか？')) {
      return;
    }
    try {
      const response = await deletePost(post.slug);
      if (response.status === 204) {
        enqueueSnackbar('Post deleted successfully', { variant: 'success' });
        navigate('/');
      } else {
        enqueueSnackbar('Failed to delete post', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      enqueueSnackbar('An error occurred on the server', { variant: 'error' });
    }
  };

  const editorOptions = useMemo(() => {
    return {
      spellChecker: false,
      previewRender(plainText: string): string {
        return marked.parse(plainText) as string;
      }
    };
  }, []);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {isNewPost ? 'Create Post' : 'Edit Post'}
      </Typography>
      <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
        <TextField
          label="Title (JA)"
          name="title.ja"
          value={post.title.ja}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        {post.has_english && (
          <TextField
            label="Title (EN)"
            name="title.en"
            value={post.title.en}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        )}
        <TextField
          label="Slug"
          name="slug"
          value={post.slug}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Status</FormLabel>
          <FormControlLabel
            control={
              <Switch
                checked={!post.is_draft}
                onChange={(e) =>
                  setPost((prev: Post) => ({ ...prev, is_draft: !e.target.checked }))
                }
                name="is_draft"
              />
            }
            label="Published"
          />
          <FormControlLabel
            control={
              <Switch
                checked={post.has_english}
                onChange={(e) =>
                  setPost((prev: Post) => ({ ...prev, has_english: e.target.checked }))
                }
                name="has_english"
              />
            }
            label="English Version"
          />
        </FormControl>
        {post.published_at && (
          <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mt: 1 }}>
            Published: {format(post.published_at, 'yyyy/MM/dd HH:mm')}
          </Typography>
        )}
        {post.created_at && (
          <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mt: 1 }}>
            Created: {format(post.created_at, 'yyyy/MM/dd HH:mm')}
          </Typography>
        )}
        {post.updated_at && (
          <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mt: 1 }}>
            Updated: {format(post.updated_at, 'yyyy/MM/dd HH:mm')}
          </Typography>
        )}
        <FormControl fullWidth margin="normal">
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            value={post.category?.slug || ''}
            onChange={handleCategoryChange}
            input={<OutlinedInput label="Category" />}
          >
            {allCategories.map((cat) => (
              <MenuItem key={cat.slug} value={cat.slug}>
                {cat.name.ja}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id="tags-select-label">Tags</InputLabel>
          <Select
            labelId="tags-select-label"
            multiple
            value={(post.tags || []).map((t: { slug: string }) => t.slug)}
            onChange={handleTagChange}
            input={<OutlinedInput id="select-multiple-chip" label="Tags" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {allTags
                  .filter((t) => selected.includes(t.slug))
                  .map((tag) => (
                    <Chip key={tag.slug} label={tag.name.ja} />
                  ))}
              </Box>
            )}
          >
            {allTags.map((tag) => (
              <MenuItem key={tag.slug} value={tag.slug}>
                {tag.name.ja}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Content (JA)
        </Typography>
        <SimpleMdeEditor
          value={post.content.ja}
          onChange={(value) => handleContentChange(value, 'content.ja')}
          options={editorOptions}
        />
        {post.has_english && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Content (EN)
            </Typography>
            <SimpleMdeEditor
              value={post.content.en}
              onChange={(value) => handleContentChange(value, 'content.en')}
              options={editorOptions}
            />
          </>
        )}
        <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          {!isNewPost && (
            <Button variant="contained" color="secondary" onClick={handleDelete}>
              Delete
            </Button>
          )}
          <Button variant="outlined" onClick={() => navigate('/')}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default PostDetail;
