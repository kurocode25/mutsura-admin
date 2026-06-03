import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2' // A calm blue
    },
    secondary: {
      main: '#dc004e' // A vibrant pink for contrast
    },
    background: {
      default: '#f4f6f8', // A very light grey for the background
      paper: '#ffffff' // White for paper elements
    }
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h4: {
      fontWeight: 600
    },
    h6: {
      fontWeight: 600
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#121212',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1c2536',
          color: '#ffffff'
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)'
          }
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: '#cccccc' // ライトグレー
        }
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#ffffff'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none'
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#1565c0'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f4f6f8'
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: '#637381'
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.02)'
          }
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#32CD32', // ライムグリーン
          '&:hover': {
            color: '#006400' // 濃い緑
          },
          '&:visited': {
            color: '#50C878' // エメラルドグリーン
          }
        }
      }
    }
  }
});

export default theme;
