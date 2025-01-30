import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
  alpha
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CollectionsIcon from '@mui/icons-material/Collections';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Homepage = () => {
  const theme = useTheme();

  const features = [
    {
      title: 'Gaming Trends',
      description: 'Track real-time gaming metrics, analyze user engagement patterns, and monitor performance trends across games.',
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      to: '/gamingtrend',
      color: theme.palette.primary.main,
      priority: 1
    },
    {
      title: 'Wallet Gaming',
      description: 'Monitor gaming wallets, track transaction metrics, and analyze user behavior across different games.',
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 40 }} />,
      to: '/walletgaming',
      color: theme.palette.secondary.main,
      priority: 2
    },
    {
      title: 'Gaming Collections',
      description: 'Discover trending gaming collections, monitor market performance, and track collection metrics.',
      icon: <CollectionsIcon sx={{ fontSize: 40 }} />,
      to: '/gamingcollection',
      color: '#4CAF50',
      priority: 3
    }
  ].sort((a, b) => a.priority - b.priority);

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)',
        pt: 8,
        pb: 12
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            textAlign: 'center',
            mb: 8
          }}
        >
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              mb: 3
            }}
          >
            <SportsEsportsIcon 
              sx={{ 
                fontSize: 56,
                color: theme.palette.primary.main
              }} 
            />
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 800,
                background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              GameCrunch
            </Typography>
          </Box>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.5rem', md: '2rem' },
              fontWeight: 600,
              color: 'text.primary',
              mb: 2
            }}
          >
            Web3 Gaming Analytics Platform
          </Typography>
          <Typography
            variant="h6"
            sx={{
              maxWidth: '800px',
              mx: 'auto',
              color: 'text.secondary',
              lineHeight: 1.6
            }}
          >
            Your comprehensive solution for tracking gaming metrics, analyzing trends, 
            and making data-driven decisions in the Web3 gaming space.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                component={Link}
                to={feature.to}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  background: '#ffffff',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                    '& .arrow-icon': {
                      transform: 'translateX(4px)',
                    }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: feature.color,
                  }
                }}
              >
                <CardContent sx={{ p: 4, flexGrow: 1 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      color: feature.color,
                      bgcolor: alpha(feature.color, 0.1),
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: 'text.primary'
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 3,
                      color: 'text.secondary',
                      lineHeight: 1.6
                    }}
                  >
                    {feature.description}
                  </Typography>
                  <Button
                    endIcon={<ArrowForwardIcon className="arrow-icon" />}
                    sx={{
                      color: feature.color,
                      '& .arrow-icon': {
                        transition: 'transform 0.2s ease'
                      }
                    }}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Homepage;
