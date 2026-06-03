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
  Box
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';
import { getPages, deletePage } from '../../api';

const PageList = () => {
  interface Page {
    id: string;
    slug: string;
    title: { ja: string; en: string };
    created_at: string;
    updated_at: string;
  }

  const [pages, setPages] = useState<Page[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await getPages();
        setPages(response.data);
      } catch (error) {
        console.error('Error fetching pages:', error);
        enqueueSnackbar('Failed to fetch pages', { variant: 'error' });
      }
    };
    fetchPages();
  }, [enqueueSnackbar]);

  const handleDelete = async (slug: string) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      try {
        await deletePage(slug);
        setPages(pages.filter((page) => page.slug !== slug));
        enqueueSnackbar('Page deleted successfully', { variant: 'success' });
      } catch (error) {
        console.error('Error deleting page:', error);
        enqueueSnackbar('Failed to delete page', { variant: 'error' });
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
    } catch {
      return '-';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button component={Link} to="/pages/new" variant="contained" color="primary">
          Create Page
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="pages table">
          <TableHead>
            <TableRow>
              <TableCell>Slug</TableCell>
              <TableCell>Title (Japanese)</TableCell>
              <TableCell>Title (English)</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pages.map((page: Page) => (
              <TableRow key={page.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {page.slug}
                </TableCell>
                <TableCell>{page.title?.ja || '-'}</TableCell>
                <TableCell>{page.title?.en || '-'}</TableCell>
                <TableCell>{formatDate(page.created_at)}</TableCell>
                <TableCell>{formatDate(page.updated_at)}</TableCell>
                <TableCell>
                  <Button component={Link} to={`/pages/${page.slug}`} size="small">
                    Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDelete(page.slug)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PageList;
