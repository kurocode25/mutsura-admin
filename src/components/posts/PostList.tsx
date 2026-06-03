import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Pagination,
  Box,
  Chip,
  TextField
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { getPosts, deletePost } from '../../api';

const PostList = () => {
  interface Post {
    id: string;
    title: string;
    slug: string;
    category: { slug: string; name: string };
    tags: { slug: string; name: string }[];
    is_draft: boolean;
    published_at: string;
    updated_at: string;
  }

  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page') || '1', 10);
  const searchTerm = query.get('q') || '';

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '30'
        });
        if (searchTerm) {
          params.append('q', searchTerm);
        }
        const response = await getPosts(params);
        const data = response.data;
        setPosts(data.posts);
        setTotalPages(data.pagination.total_pages);
      } catch (error) {
        console.error('Error fetching posts:', error);
        enqueueSnackbar('Failed to fetch posts', { variant: 'error' });
      }
    };
    fetchPosts();
    setSearchQuery(searchTerm);
  }, [page, searchTerm, enqueueSnackbar]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    const params = new URLSearchParams({ page: value.toString() });
    if (searchTerm) {
      params.append('q', searchTerm);
    }
    navigate({ search: params.toString() });
  };

  const handleSearch = () => {
    const params = new URLSearchParams({ page: '1' });
    if (searchQuery) {
      params.append('q', searchQuery);
    }
    navigate({ search: params.toString() });
  };

  const handleDelete = async (slug: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(slug);
        setPosts(posts.filter((post) => post.slug !== slug));
        enqueueSnackbar('Post deleted successfully', { variant: 'success' });
      } catch (error) {
        console.error('Error deleting post:', error);
        enqueueSnackbar('Failed to delete post', { variant: 'error' });
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            label="Search by Title"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </Box>
        <Button component={Link} to="/posts/new" variant="contained" color="primary">
          Create Post
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Published</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post: Post) => (
              <TableRow key={post.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {post.title}
                </TableCell>
                <TableCell>{post.category?.name}</TableCell>
                <TableCell>
                  {(post.tags || []).map((tag) => (
                    <Chip key={tag.slug} label={tag.name} size="small" sx={{ mr: 0.5 }} />
                  ))}
                </TableCell>
                <TableCell>
                  <Chip
                    label={post.is_draft ? 'Draft' : 'Published'}
                    color={post.is_draft ? 'default' : 'primary'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {post.published_at ? new Date(post.published_at).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell>{new Date(post.updated_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button component={Link} to={`/posts/${post.slug}`} size="small">
                    Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDelete(post.slug)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
      />
    </Box>
  );
};

export default PostList;
