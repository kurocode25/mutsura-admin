import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import api, { getTag } from '../../api'; // Import api and getTag

const getErrorDetail = (error: unknown): unknown => {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = error.response;
    if (response && typeof response === 'object' && 'data' in response) {
      return response.data;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '不明なエラーが発生しました。';
};

const TagDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  interface Tag {
    name: { ja: string; en: string };
    slug: string;
  }

  const [tag, setTag] = useState<Tag>({
    name: { ja: '', en: '' },
    slug: ''
  });
  const isNewTag = slug === 'new';

  useEffect(() => {
    if (!isNewTag) {
      const fetchTag = async () => {
        try {
          const response = await getTag(slug!); // Use getTag
          setTag(response.data);
        } catch (error) {
          console.error('Error fetching tag:', error);
          alert('タグの取得に失敗しました。');
        }
      };
      fetchTag();
    }
  }, [slug, isNewTag]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setTag((prev: Tag) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Tag] as Record<string, string>),
          [child]: value
        }
      }));
    } else {
      setTag((prev: Tag) => ({ ...prev, [name as keyof Tag]: value }));
    }
  };

  const handleSave = async () => {
    try {
      if (isNewTag) {
        await api.post('/tag', tag); // Use api instance for POST
      } else {
        await api.put(`/tag/${tag.slug}`, tag); // Use api instance for PUT
      }
      alert('タグが保存されました。');
      navigate('/tags');
    } catch (error: unknown) {
      const errorDetail = getErrorDetail(error);
      console.error('Save failed:', errorDetail);
      alert(`保存に失敗しました: ${JSON.stringify(errorDetail)}`);
    }
  };

  const handleDelete = async () => {
    if (isNewTag || !window.confirm('本当にこのタグを削除しますか？')) {
      return;
    }
    try {
      await api.delete(`/tag/${tag.slug}`); // Use api instance for DELETE
      alert('タグが削除されました。');
      navigate('/tags');
    } catch (error) {
      console.error('Error deleting tag:', error);
      alert('サーバーでエラーが起きました');
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {isNewTag ? 'Create Tag' : 'Edit Tag'}
      </Typography>
      <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
        <TextField
          label="Name (JA)"
          name="name.ja"
          value={tag.name.ja}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Name (EN)"
          name="name.en"
          value={tag.name.en}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Slug"
          name="slug"
          value={tag.slug}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          {!isNewTag && (
            <Button variant="contained" color="secondary" onClick={handleDelete}>
              Delete
            </Button>
          )}
          <Button variant="outlined" onClick={() => navigate('/tags')}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default TagDetail;
