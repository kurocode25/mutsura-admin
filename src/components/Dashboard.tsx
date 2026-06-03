import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Paper,
  alpha
} from '@mui/material';
import {
  Article as PostIcon,
  Category as CategoryIcon,
  LocalOffer as TagIcon,
  Description as PageIcon,
  ChevronRight as ArrowIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const dashboardItems = [
  {
    title: '記事管理',
    description: 'ブログ記事の作成、編集、削除を行います。最新の情報を発信しましょう。',
    path: '/posts',
    icon: <PostIcon sx={{ fontSize: 40 }} />,
    color: '#1976d2'
  },
  {
    title: 'カテゴリー管理',
    description: '記事を整理するためのカテゴリーを管理します。構造的なブログ作りをサポートします。',
    path: '/categories',
    icon: <CategoryIcon sx={{ fontSize: 40 }} />,
    color: '#2e7d32'
  },
  {
    title: 'タグ管理',
    description: '記事にキーワードを紐付けます。読者が興味のある記事を見つけやすくなります。',
    path: '/tags',
    icon: <TagIcon sx={{ fontSize: 40 }} />,
    color: '#ed6c02'
  },
  {
    title: '固定ページ管理',
    description: 'プロフィールや利用規約など、更新頻度の低い重要なページを管理します。',
    path: '/pages',
    icon: <PageIcon sx={{ fontSize: 40 }} />,
    color: '#9c27b0'
  }
];

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          ダッシュボード
        </Typography>
        <Typography variant="body1" color="text.secondary">
          ブログのコンテンツを効率的に管理するためのコントロールパネルです。
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {dashboardItems.map((item) => (
          <Grid key={item.path} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.15)'
                }
              }}
            >
              <CardActionArea
                component={RouterLink}
                to={item.path}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch'
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 64,
                      height: 64,
                      borderRadius: 3,
                      mb: 3,
                      backgroundColor: alpha(item.color, 0.1),
                      color: item.color
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                    {item.description}
                  </Typography>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', color: item.color, mt: 'auto' }}
                  >
                    <Typography variant="button" sx={{ fontWeight: 700 }}>
                      管理する
                    </Typography>
                    <ArrowIcon sx={{ ml: 0.5, fontSize: 18 }} />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper
        sx={{
          mt: 6,
          p: 5,
          background: 'linear-gradient(135deg, #1c2536 0%, #111827 100%)',
          color: 'white',
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            クイックスタート
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, mb: 4, maxWidth: 600 }}>
            新しい記事を作成して、世界中にあなたのアイデアを共有しましょう。
            管理画面から簡単に編集や公開設定が行えます。
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <CardActionArea
              component={RouterLink}
              to="/posts/new"
              sx={{
                width: 'auto',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                backgroundColor: 'primary.main',
                '&:hover': { backgroundColor: 'primary.dark' }
              }}
            >
              <Typography variant="button" sx={{ color: 'white', fontWeight: 600 }}>
                記事を作成する
              </Typography>
            </CardActionArea>
          </Box>
        </Box>
        {/* Decorative element */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            zIndex: 0
          }}
        />
      </Paper>
    </Box>
  );
};

export default Dashboard;
