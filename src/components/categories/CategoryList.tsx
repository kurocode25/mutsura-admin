import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Link as MuiLink
} from '@mui/material';
import api from '../../api';

const CategoryList = () => {
  interface Category {
    id: string;
    name: { ja: string; en: string };
    slug: string;
  }

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get<Category[]>('/category');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        alert('サーバーでエラーが起きました');
      }
    };
    fetchCategories();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Button
        component={Link}
        to="/categories/new"
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
      >
        Create Category
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name (JA)</TableCell>
              <TableCell>Name (EN)</TableCell>
              <TableCell>Slug</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category: Category) => (
              <TableRow
                key={category.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <MuiLink component={Link} to={`/categories/${category.slug}`}>
                    {category.name.ja}
                  </MuiLink>
                </TableCell>
                <TableCell>{category.name.en}</TableCell>
                <TableCell>{category.slug}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CategoryList;
