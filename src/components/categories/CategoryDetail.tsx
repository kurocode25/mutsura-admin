import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import api, { getCategory } from '../../api'; // Import api and getCategory

const getResponseData = (error: unknown): unknown => {
  if (!error || typeof error !== 'object' || !('response' in error)) {
    return undefined;
  }

  const response = error.response;
  if (!response || typeof response !== 'object' || !('data' in response)) {
    return undefined;
  }

  return response.data;
};

const CategoryDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  interface Category {
    name: { ja: string; en: string };
    slug: string;
  }

  const [category, setCategory] = useState<Category>({
    name: { ja: '', en: '' },
    slug: ''
  });
  const isNewCategory = slug === 'new';

  useEffect(() => {
    if (!isNewCategory) {
      const fetchCategory = async () => {
        try {
          const response = await getCategory(slug!); // Use getCategory
          setCategory(response.data);
        } catch (error) {
          console.error('Error fetching category:', error);
          alert('カテゴリーの取得に失敗しました。');
        }
      };
      fetchCategory();
    }
  }, [slug, isNewCategory]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCategory((prev: Category) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Category] as Record<string, string>),
          [child]: value
        }
      }));
    } else {
      setCategory((prev: Category) => ({ ...prev, [name as keyof Category]: value }));
    }
  };

  const handleSave = async () => {
    try {
      if (isNewCategory) {
        await api.post('/category', category); // Use api instance for POST
      } else {
        await api.put(`/category/${category.slug}`, category); // Use api instance for PUT
      }
      alert('カテゴリーが保存されました。');
      navigate('/categories');
    } catch (error: unknown) {
      let errorMessage = '不明なエラーが発生しました。';
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response
      ) {
        errorMessage = JSON.stringify(getResponseData(error));
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('Save failed:', error);
      alert(`保存に失敗しました: ${errorMessage}`);
    }
  };

  const handleDelete = async () => {
    if (isNewCategory || !window.confirm('本当にこのカテゴリーを削除しますか？')) {
      return;
    }
    try {
      await api.delete(`/category/${category.slug}`); // Use api instance for DELETE
      alert('カテゴリーが削除されました。');
      navigate('/categories');
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('サーバーでエラーが起きました');
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {isNewCategory ? 'Create Category' : 'Edit Category'}
      </Typography>
      <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
        <TextField
          label="Name (JA)"
          name="name.ja"
          value={category.name.ja}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Name (EN)"
          name="name.en"
          value={category.name.en}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Slug"
          name="slug"
          value={category.slug}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          {!isNewCategory && (
            <Button variant="contained" color="secondary" onClick={handleDelete}>
              Delete
            </Button>
          )}
          <Button variant="outlined" onClick={() => navigate('/categories')}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CategoryDetail;
