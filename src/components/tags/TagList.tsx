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

const TagList = () => {
  interface Tag {
    id: string;
    name: { ja: string; en: string };
    slug: string;
  }

  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get<Tag[]>('/tag');
        setTags(response.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
        alert('サーバーでエラーが起きました');
      }
    };
    fetchTags();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Button component={Link} to="/tags/new" variant="contained" color="primary" sx={{ mb: 2 }}>
        Create Tag
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
            {tags.map((tag: Tag) => (
              <TableRow key={tag.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  <MuiLink component={Link} to={`/tags/${tag.slug}`}>
                    {tag.name.ja}
                  </MuiLink>
                </TableCell>
                <TableCell>{tag.name.en}</TableCell>
                <TableCell>{tag.slug}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TagList;
