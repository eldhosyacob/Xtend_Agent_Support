"use client";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  LinearProgress,
  Avatar,
  AvatarGroup,
  Fade,
  Button,
  Divider,
  Stack,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp,
  TrendingDown,
  People,
  Inventory,
  ShoppingCart,
  Analytics,
  MonetizationOn,
  Notifications,
  MoreVert,
  Add,
  Warning,
  CheckCircle,
  AccountBalance,
  LocalShipping,
  Assessment,
  TrendingFlat,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';

// Enhanced Stats Card Component
const StatsCard = ({ title, value, change, icon, trend, color = 'primary', delay = 0 }) => {
  const isPositive = trend === 'up';
  const isFlat = trend === 'flat';
  
  const colorSchemes = {
    primary: {
      bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      light: 'rgba(102, 126, 234, 0.1)',
      accent: '#667eea'
    },
    success: {
      bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      light: 'rgba(79, 172, 254, 0.1)',
      accent: '#4facfe'
    },
    warning: {
      bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      light: 'rgba(240, 147, 251, 0.1)',
      accent: '#f093fb'
    },
    info: {
      bg: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
      light: 'rgba(78, 205, 196, 0.1)',
      accent: '#4ecdc4'
    }
  };

  const currentScheme = colorSchemes[color] || colorSchemes.primary;
  
  return (
    <Fade in timeout={1000 + delay}>
      <Card
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 4,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15)',
            border: `1px solid ${currentScheme.accent}40`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: currentScheme.bg,
          }
        }}
      >
        <CardContent sx={{ p: 3.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: 3,
                background: currentScheme.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: `0 8px 24px ${currentScheme.accent}40`
              }}
            >
              {icon}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isPositive && <ArrowUpward sx={{ color: '#10b981', fontSize: 18 }} />}
              {trend === 'down' && <ArrowDownward sx={{ color: '#ef4444', fontSize: 18 }} />}
              {isFlat && <TrendingFlat sx={{ color: '#6b7280', fontSize: 18 }} />}
              <Chip
                label={change}
                size="small"
                sx={{
                  background: isPositive ? 'rgba(16, 185, 129, 0.1)' : 
                             trend === 'down' ? 'rgba(239, 68, 68, 0.1)' : 
                             'rgba(107, 114, 128, 0.1)',
                  color: isPositive ? '#10b981' : 
                         trend === 'down' ? '#ef4444' : '#6b7280',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  border: 'none'
                }}
              />
            </Box>
          </Box>
          
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: '#1f2937',
              mb: 1,
              fontSize: '2.5rem',
              letterSpacing: '-0.02em'
            }}
          >
            {value}
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              color: '#6b7280',
              fontWeight: 600,
              fontSize: '0.95rem'
            }}
          >
            {title}
          </Typography>
        </CardContent>
      </Card>
    </Fade>
  );
};

// Financial Overview Card
const FinancialOverview = ({ delay = 0 }) => {
  return (
    <Fade in timeout={1000 + delay}>
      <Card
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 4,
          boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
          color: 'white',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '200px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            transform: 'translate(50px, -50px)',
          }
        }}
      >
        <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '1.4rem' }}>
              Financial Overview
            </Typography>
            <AccountBalance sx={{ fontSize: 28, opacity: 0.8 }} />
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 6 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                  $2.4M
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.9rem' }}>
                  Total Revenue
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  +18% vs last month
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                  $1.8M
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.9rem' }}>
                  Net Profit
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  +22% vs last month
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                  $650K
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.9rem' }}>
                  Operating Costs
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  -5% vs last month
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                  72%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.9rem' }}>
                  Profit Margin
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  +3% vs last month
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Fade>
  );
};

// Inventory Alerts Card
const InventoryAlerts = ({ delay = 0 }) => {
  const alerts = [
    { product: 'iPhone 14 Pro', level: 'Low', quantity: 5, status: 'warning' },
    { product: 'MacBook Air M2', level: 'Critical', quantity: 2, status: 'error' },
    { product: 'AirPods Pro', level: 'Good', quantity: 45, status: 'success' },
    { product: 'iPad Pro', level: 'Low', quantity: 8, status: 'warning' },
  ];

  return (
    <Fade in timeout={1000 + delay}>
      <Card
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 4,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          height: '100%',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15)',
          }
        }}
      >
        <CardContent sx={{ p: 3.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937', fontSize: '1.3rem' }}>
              Inventory Alerts
            </Typography>
            <Chip
              label={`${alerts.filter(a => a.status !== 'success').length} Issues`}
              sx={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.75rem'
              }}
            />
          </Box>

          <Stack spacing={2.5}>
            {alerts.map((alert, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2.5,
                  borderRadius: 3,
                  background: alert.status === 'error' ? 'rgba(239, 68, 68, 0.05)' :
                             alert.status === 'warning' ? 'rgba(245, 158, 11, 0.05)' :
                             'rgba(16, 185, 129, 0.05)',
                  border: `1px solid ${
                    alert.status === 'error' ? 'rgba(239, 68, 68, 0.2)' :
                    alert.status === 'warning' ? 'rgba(245, 158, 11, 0.2)' :
                    'rgba(16, 185, 129, 0.2)'
                  }`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateX(4px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  }
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: alert.status === 'error' ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' :
                               alert.status === 'warning' ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' :
                               'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2.5,
                    color: 'white'
                  }}
                >
                  {alert.status === 'error' ? <Warning fontSize="small" /> :
                   alert.status === 'warning' ? <Inventory fontSize="small" /> :
                   <CheckCircle fontSize="small" />}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937', mb: 0.5 }}>
                    {alert.product}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.85rem' }}>
                    {alert.quantity} units remaining • {alert.level} stock
                  </Typography>
                </Box>
                <Chip
                  label={alert.level}
                  size="small"
                  sx={{
                    background: alert.status === 'error' ? '#ef4444' :
                               alert.status === 'warning' ? '#f59e0b' : '#10b981',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.7rem'
                  }}
                />
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Fade>
  );
};

// Recent Orders Card
const RecentOrders = ({ delay = 0 }) => {
  const orders = [
    { id: '#ORD-2024-001', customer: 'John Smith', amount: '$1,254', status: 'Delivered', time: '2 hours ago' },
    { id: '#ORD-2024-002', customer: 'Sarah Johnson', amount: '$892', status: 'Processing', time: '4 hours ago' },
    { id: '#ORD-2024-003', customer: 'Mike Wilson', amount: '$2,150', status: 'Shipped', time: '6 hours ago' },
    { id: '#ORD-2024-004', customer: 'Emma Davis', amount: '$675', status: 'Pending', time: '8 hours ago' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return '#10b981';
      case 'Shipped': return '#3b82f6';
      case 'Processing': return '#f59e0b';
      case 'Pending': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <Fade in timeout={1000 + delay}>
      <Card
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 4,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          height: '100%',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15)',
          }
        }}
      >
        <CardContent sx={{ p: 3.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937', fontSize: '1.3rem' }}>
              Recent Orders
            </Typography>
            <Button
              variant="outlined"
              size="small"
              sx={{
                borderColor: '#4facfe',
                color: '#4facfe',
                fontWeight: 600,
                '&:hover': {
                  background: 'rgba(79, 172, 254, 0.1)',
                  borderColor: '#4facfe',
                }
              }}
            >
              View All
            </Button>
          </Box>

          <Stack spacing={2.5}>
            {orders.map((order, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2.5,
                  borderRadius: 3,
                  background: 'rgba(248, 250, 252, 0.8)',
                  border: '1px solid rgba(226, 232, 240, 0.8)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateX(4px)',
                    background: 'rgba(241, 245, 249, 0.9)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  }
                }}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                    mr: 2.5,
                    fontWeight: 700
                  }}
                >
                  {order.customer.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937', mb: 0.5 }}>
                    {order.id}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.85rem' }}>
                    {order.customer} • {order.time}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right', mr: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: '#1f2937', mb: 0.5 }}>
                    {order.amount}
                  </Typography>
                  <Chip
                    label={order.status}
                    size="small"
                    sx={{
                      background: `${getStatusColor(order.status)}20`,
                      color: getStatusColor(order.status),
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      border: `1px solid ${getStatusColor(order.status)}40`
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Box sx={{ 
      p: 4, 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      position: 'relative'
    }}>
      {/* Enhanced Header */}
      <Box sx={{ mb: 5 }}>
        <Fade in timeout={800}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: '#1f2937',
                mb: 1,
                fontSize: '3rem',
                letterSpacing: '-0.02em',
                textShadow: '0 4px 8px rgba(31, 41, 55, 0.1)'
              }}
            >
              ERP Dashboard
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#6b7280',
                fontWeight: 500,
                opacity: 0.9,
                fontSize: '1.1rem'
              }}
            >
              Real-time insights into your business operations
            </Typography>
          </Box>
        </Fade>
      </Box>

      {/* Enhanced Stats Cards */}
      <Grid container spacing={4} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatsCard
            title="Total Revenue"
            value="$2.4M"
            change="+18.5%"
            trend="up"
            color="primary"
            icon={<MonetizationOn sx={{ fontSize: 28 }} />}
            delay={0}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatsCard
            title="Active Orders"
            value="1,847"
            change="+12.3%"
            trend="up"
            color="success"
            icon={<ShoppingCart sx={{ fontSize: 28 }} />}
            delay={100}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatsCard
            title="Total Customers"
            value="15,629"
            change="+8.7%"
            trend="up"
            color="info"
            icon={<People sx={{ fontSize: 28 }} />}
            delay={200}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatsCard
            title="Inventory Items"
            value="3,247"
            change="-2.1%"
            trend="down"
            color="warning"
            icon={<Inventory sx={{ fontSize: 28 }} />}
            delay={300}
          />
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={4}>
        {/* Financial Overview */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <FinancialOverview delay={400} />
        </Grid>

        {/* Sales Analytics Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Fade in timeout={500}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 4,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                height: 400,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15)',
                }
              }}
            >
              <CardContent sx={{ p: 4, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937', fontSize: '1.4rem' }}>
                    Sales Analytics
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label="This Quarter" variant="outlined" sx={{ fontWeight: 600 }} />
                    <IconButton
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                        }
                      }}
                    >
                      <Assessment fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                
                <Box
                  sx={{
                    height: 280,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                    borderRadius: 3,
                    border: '2px dashed rgba(102, 126, 234, 0.3)',
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Assessment sx={{ fontSize: 80, color: '#667eea', mb: 2, opacity: 0.8 }} />
                    <Typography variant="h5" sx={{ color: '#1f2937', fontWeight: 700, mb: 1 }}>
                      Advanced Analytics
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#6b7280', maxWidth: 300 }}>
                      Interactive sales charts and performance metrics will be displayed here
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        {/* Inventory Alerts */}
        <Grid size={{ xs: 12, md: 6 }}>
          <InventoryAlerts delay={600} />
        </Grid>

        {/* Recent Orders */}
        <Grid size={{ xs: 12, md: 6 }}>
          <RecentOrders delay={700} />
        </Grid>
      </Grid>

      {/* Enhanced Quick Actions */}
      <Box sx={{ mt: 5 }}>
        <Fade in timeout={800}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
              borderRadius: 4,
              boxShadow: '0 20px 40px rgba(31, 41, 55, 0.4)',
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 50%, #667eea 100%)',
              }
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: 'white',
                    fontSize: '1.4rem'
                  }}
                >
                  Quick Actions
                </Typography>
                <AvatarGroup max={4}>
                  <Avatar sx={{ 
                    width: 40, height: 40, 
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    boxShadow: '0 4px 15px rgba(79, 172, 254, 0.4)'
                  }}>
                    <People fontSize="small" />
                  </Avatar>
                  <Avatar sx={{ 
                    width: 40, height: 40, 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                  }}>
                    <Inventory fontSize="small" />
                  </Avatar>
                  <Avatar sx={{ 
                    width: 40, height: 40, 
                    background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                    boxShadow: '0 4px 15px rgba(78, 205, 196, 0.4)'
                  }}>
                    <Analytics fontSize="small" />
                  </Avatar>
                </AvatarGroup>
              </Box>

              <Grid container spacing={2}>
                {[
                  { label: 'Add New Product', icon: <Add /> },
                  { label: 'View Orders', icon: <ShoppingCart /> },
                  { label: 'Manage Users', icon: <People /> },
                  { label: 'Analytics Report', icon: <Analytics /> }
                ].map((action, index) => (
                  <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.2)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 15px rgba(255, 255, 255, 0.3)'
                        }
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #4facfe, #667eea)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                          color: 'white'
                        }}
                      >
                        {action.icon}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: 'white'
                        }}
                      >
                        {action.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Fade>
      </Box>
    </Box>
  );
}