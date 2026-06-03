import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  ListItemIcon
} from '@mui/material';
import {
  Article as PostIcon,
  Category as CategoryIcon,
  LocalOffer as TagIcon,
  Description as PageIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import Dashboard from './components/Dashboard';
import PostList from './components/posts/PostList';
import PostDetail from './components/posts/PostDetail';
import CategoryList from './components/categories/CategoryList';
import CategoryDetail from './components/categories/CategoryDetail';
import TagList from './components/tags/TagList';
import TagDetail from './components/tags/TagDetail';
import PageList from './components/pages/PageList';
import PageDetail from './components/pages/PageDetail';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

const drawerWidth = 240;

function App() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  if (location.pathname === '/login') {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  }

  const menuItems = [
    { text: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { text: 'Posts', path: '/posts', icon: <PostIcon /> },
    { text: 'Categories', path: '/categories', icon: <CategoryIcon /> },
    { text: 'Tags', path: '/tags', icon: <TagIcon /> },
    { text: 'Pages', path: '/pages', icon: <PageIcon /> }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{ color: 'inherit', textDecoration: 'none', flexGrow: 1, fontWeight: 700 }}
          >
            Blog Admin
          </Typography>
          {isAuthenticated && (
            <Button
              color="inherit"
              onClick={() => {
                void logout();
              }}
              startIcon={<LogoutIcon />}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: 'none'
          }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List sx={{ px: 2 }}>
            {menuItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <ListItem
                  key={item.text}
                  component={Link}
                  to={item.path}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.12)'
                    },
                    transition: 'background-color 0.2s'
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isActive ? 'primary.main' : 'inherit'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#ffffff' : '#cccccc'
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
      <main
        style={{ flexGrow: 1, padding: '24px', minHeight: '100vh', backgroundColor: '#f4f6f8' }}
      >
        <Toolbar />
        <Container maxWidth="lg">
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/posts" element={<PostList />} />
              <Route path="/posts/:slug" element={<PostDetail />} />
              <Route path="/categories" element={<CategoryList />} />
              <Route path="/categories/:slug" element={<CategoryDetail />} />
              <Route path="/tags" element={<TagList />} />
              <Route path="/tags/:slug" element={<TagDetail />} />
              <Route path="/pages" element={<PageList />} />
              <Route path="/pages/new" element={<PageDetail />} />
              <Route path="/pages/:slug" element={<PageDetail />} />
            </Route>
          </Routes>
        </Container>
      </main>
    </Box>
  );
}

export default App;
