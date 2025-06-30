'use client'
import { logout } from '@/redux/authSlice';
import { hasAccess } from '@/utils/roleAccess';
import {
  Close as CloseIcon,
  ExitToApp,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Menu as MenuIcon,
  Settings,
  Search as SearchIcon,
  Notifications,
  Fullscreen,
  FullscreenExit,
  Refresh
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  CircularProgress,
  Collapse,
  CssBaseline,
  Divider,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  AppBar as MuiAppBar,
  Drawer as MuiDrawer,
  Toolbar,
  Typography,
  Chip,
  Tooltip,
  Badge,
  Fade,
  Grow
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useRouter } from 'nextjs-toploader/app';
import * as React from 'react';
import { useEffect, useState } from 'react';


import { useDispatch, useSelector } from 'react-redux';
import { getMenuItems } from './menuItems';

const drawerWidth = 315;

// Style for the drawer - expanded and collapsed states
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  background: 'linear-gradient(180deg, rgba(47, 62, 70, 0.98) 0%, rgba(47, 62, 70, 0.95) 50%, rgba(82, 121, 111, 0.92) 100%)',
  backdropFilter: 'blur(25px)',
  border: 'none',
  borderRight: '1px solid rgba(255, 214, 165, 0.15)',
  boxShadow: '8px 0 32px rgba(47, 62, 70, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.02)',
  height: '100vh',
  position: 'fixed',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, rgba(255, 214, 165, 0.02) 0%, rgba(82, 121, 111, 0.05) 100%)',
    pointerEvents: 'none',
  }
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: 0,
  background: 'linear-gradient(180deg, rgba(47, 62, 70, 0.98) 0%, rgba(47, 62, 70, 0.95) 50%, rgba(82, 121, 111, 0.92) 100%)',
  backdropFilter: 'blur(25px)',
  border: 'none',
  borderRight: '1px solid rgba(255, 214, 165, 0.15)',
  height: '100vh',
  position: 'fixed',
});

// Style for the drawer
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': {
      ...openedMixin(theme),
      overflowY: 'auto',
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': {
      ...closedMixin(theme),
      overflowY: 'hidden',
    },
  }),
  // Hide drawer on mobile screens using CSS
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

// Enhanced Header AppBar styling
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: 'linear-gradient(135deg, rgba(47, 62, 70, 0.98) 0%, rgba(82, 121, 111, 0.95) 100%)',
  backdropFilter: 'blur(30px)',
  borderBottom: '1px solid rgba(255, 214, 165, 0.15)',
  boxShadow: '0 8px 32px rgba(47, 62, 70, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
    width: '100%',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255, 214, 165, 0.03) 0%, rgba(82, 121, 111, 0.08) 100%)',
    pointerEvents: 'none',
  }
}));

// Enhanced Search styling
const SearchContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  maxWidth: 450,
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 300,
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const SearchBar = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 16,
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 214, 165, 0.2)',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.12)',
    border: '1px solid rgba(255, 214, 165, 0.4)',
    transform: 'translateY(-1px)',
    boxShadow: '0 8px 25px rgba(255, 214, 165, 0.15)',
  },
  '&:focus-within': {
    background: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid #FFD6A5',
    boxShadow: '0 0 0 3px rgba(255, 214, 165, 0.2), 0 8px 25px rgba(255, 214, 165, 0.25)',
    transform: 'translateY(-2px)',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'rgba(255, 214, 165, 0.8)',
  zIndex: 1,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#FAF3E0',
  width: '100%',
  fontWeight: 500,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    paddingRight: theme.spacing(8),
    width: '100%',
    fontSize: '0.9rem',
    fontWeight: 500,
    '&::placeholder': {
      color: 'rgba(255, 214, 165, 0.7)',
      opacity: 1,
      fontWeight: 400,
    },
  },
}));

const QuickSearchShortcut = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: 12,
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'rgba(255, 214, 165, 0.15)',
  border: '1px solid rgba(255, 214, 165, 0.3)',
  borderRadius: 6,
  padding: '4px 8px',
  fontSize: '0.75rem',
  color: 'rgba(255, 214, 165, 0.9)',
  fontWeight: 600,
  letterSpacing: '0.5px',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
}));

// Enhanced Badge styles
const ModernBadge = styled('span')(({ color = '#FFD6A5' }) => ({
  fontSize: '0.625rem',
  background: `linear-gradient(135deg, ${color}, #52796F)`,
  color: '#2F3E46',
  fontWeight: '700',
  padding: '3px 8px',
  borderRadius: '8px',
  marginLeft: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  boxShadow: '0 2px 8px rgba(255, 214, 165, 0.3)',
  backdropFilter: 'blur(10px)',
}));

// Enhanced Circular icon button styling
const EnhancedIconButton = styled(IconButton)(({ theme, variant = 'default' }) => ({
  backgroundColor: variant === 'primary' 
    ? 'rgba(255, 214, 165, 0.15)' 
    : 'rgba(255, 255, 255, 0.08)',
  border: '1px solid rgba(255, 214, 165, 0.2)',
  color: '#FAF3E0',
  width: 44,
  height: 44,
  borderRadius: '12px',
  backdropFilter: 'blur(15px)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: variant === 'primary' 
      ? 'rgba(255, 214, 165, 0.25)' 
      : 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 214, 165, 0.4)',
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: '0 8px 25px rgba(255, 214, 165, 0.3)',
  },
  '&:active': {
    transform: 'translateY(-1px) scale(0.98)',
  },
}));

// Main content container
const MainContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  flexGrow: 1,
  marginTop: 70, // Matched to header height
  background: 'transparent',
  height: 'auto',
  transition: theme.transitions.create(['margin-left', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  marginLeft: open ? drawerWidth : 0,
  width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2, 0),
    width: '100%',
    marginLeft: 0,
    marginTop: 70, // Matched to header height
  },
}));

// Time and Status component
const TimeStatusChip = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Don't render during SSR to avoid hydration mismatch
  if (!isClient) {
    return (
      <Chip
        label="--:--"
        size="small"
        sx={{
          background: 'rgba(255, 214, 165, 0.12)',
          color: '#FFD6A5',
          border: '1px solid rgba(255, 214, 165, 0.3)',
          fontWeight: 600,
          fontSize: '0.75rem',
          backdropFilter: 'blur(10px)',
          '& .MuiChip-label': {
            px: 1.5,
          },
        }}
      />
    );
  }

  return (
    <Chip
      label={currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      size="small"
      sx={{
        background: 'rgba(255, 214, 165, 0.12)',
        color: '#FFD6A5',
        border: '1px solid rgba(255, 214, 165, 0.3)',
        fontWeight: 600,
        fontSize: '0.75rem',
        backdropFilter: 'blur(10px)',
        '& .MuiChip-label': {
          px: 1.5,
        },
      }}
    />
  );
};

// Main component
function HeaderSidebarContent({ children }) {
  // States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [avatarText, setAvatarText] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [openItems, setOpenItems] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Hooks
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  // Derived state
  const isMenuOpen = Boolean(anchorEl);

  // Menu initialization function - only called on client 
  const initializeMenuState = () => {
    const initialState = {};
    menuItems.forEach(item => {
      if (item.hasSubmenu && item.submenuItems.some(subItem => isPathActive(subItem.href))) {
        initialState[item.id] = true;
      }
    });
    setOpenItems(initialState);
  };

  // Set up client-side only rendering to prevent hydration errors
  useEffect(() => {
    setIsHydrated(true);
    
    const handleResize = () => {
      const mobile = window.innerWidth < 600;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    if (user?.fullName) {
      setAvatarText(user.fullName.charAt(0).toUpperCase());
      setDisplayName(user.fullName);
    } else if (user?.email) {
      setDisplayName(user.email);
    }

    initializeMenuState();

    // Keyboard shortcuts
    const handleKeyPress = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('input[placeholder*="Search"]')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [user?.fullName, user?.email]);

  // Event handlers
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    dispatch(logout());
    router.push('/Login');
  };

  const handleAccountSettings = () => {
    handleMenuClose();
    router.push('/ProfileSettings');
  };

  const handleToggle = (item) => {
    setOpenItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // Helper functions
  const isPathActive = (path) => {
    if (pathname === path) {
      if (searchParams && searchParams.toString()) {
        return false;
      }
      return true;
    }

    if (path !== '/' && !path.includes('/', 1)) {
      return false;
    }

    return pathname?.startsWith(`${path}/`);
  };

  const hasActiveSubmenuItem = (submenuItems) => {
    return submenuItems?.some(item => isPathActive(item.href));
  };

  const userHasAccess = (path) => {
    if (!user?.roles) return false;
    if (user.roles.includes('Super Admin')) return true;
    return hasAccess(path, user.roles);
  };

  const shouldShowMenuItem = (item) => {
    if (!isHydrated || !user?.roles) return true;
    
    if (user?.roles?.includes('Super Admin')) return true;

    if (item.hasSubmenu) {
      return item.submenuItems.some(subItem => userHasAccess(subItem.href));
    }
    return userHasAccess(item.href);
  };

  // Get menu items data
  const menuItems = getMenuItems(pathname, searchParams);

  // Render full content
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />

      {/* Sidebar */}
      {isMobile ? (
        <>
          {/* Standalone backdrop for mobile */}
          {sidebarOpen && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1200,
                cursor: 'pointer'
              }}
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Custom mobile drawer without modal */}
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              height: '100vh',
              minHeight: '100dvh',
              width: drawerWidth,
              background: 'linear-gradient(180deg, rgba(250, 243, 224, 0.98) 0%, rgba(255, 255, 255, 0.95) 50%, rgba(250, 243, 224, 0.92) 100%)',
              backdropFilter: 'blur(25px)',
              zIndex: 1300,
              boxShadow: '8px 0 32px rgba(47, 62, 70, 0.2), 0 0 0 1px rgba(255, 214, 165, 0.1)',
              transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(180deg, rgba(255, 214, 165, 0.03) 0%, rgba(82, 121, 111, 0.08) 100%)',
                pointerEvents: 'none',
              }
            }}
          >
            {/* Logo and Close Button */}
            <Box sx={{ 
              p: 3, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 1,
              background: 'linear-gradient(135deg, rgba(255, 214, 165, 0.08) 0%, rgba(82, 121, 111, 0.05) 100%)',
              backdropFilter: 'blur(10px)',
              borderBottom: '1px solid rgba(255, 214, 165, 0.15)',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img src="/images/intenso.png" alt="IntensoCore" style={{ width: '32px', height: '32px', marginRight: '12px' }} />
                <Typography variant="subtitle1" sx={{ 
                  fontSize: '20px', 
                  fontWeight: 700, 
                  color: '#2F3E46',
                }}>
                  IntensoCore ERP
                </Typography>
              </Box>
              <IconButton
                onClick={() => setSidebarOpen(false)}
                sx={{
                  p: 1.5,
                  borderRadius: '12px',
                  background: 'rgba(255, 214, 165, 0.1)',
                  border: '1px solid rgba(255, 214, 165, 0.2)',
                  color: '#52796F',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 214, 165, 0.2)',
                    transform: 'translateY(-1px) scale(1.05)',
                    boxShadow: '0 4px 15px rgba(255, 214, 165, 0.3)',
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Divider sx={{ mx: 2, borderColor: 'rgba(255, 214, 165, 0.2)', opacity: 0.7 }} />

            {/* Menu Section */}
            <Box sx={{ px: 2, py: 2, position: 'relative', zIndex: 1 }}>
              <Typography sx={{
                fontSize: '0.6875rem', 
                fontWeight: 700, 
                color: 'rgba(82, 121, 111, 0.8)',
                textTransform: 'uppercase', 
                letterSpacing: '0.1rem', 
                mb: 2,
                px: 1.5,
                py: 0.5,
                background: 'rgba(255, 214, 165, 0.08)',
                borderRadius: 2,
                border: '1px solid rgba(255, 214, 165, 0.15)',
              }}>
                NAVIGATION
              </Typography>

              <List sx={{ p: 0 }}>
                {menuItems
                  .filter(item => shouldShowMenuItem(item))
                  .map((item) => {
                    const isActive = item.hasSubmenu
                      ? hasActiveSubmenuItem(item.submenuItems)
                      : isPathActive(item.href);

                    return (
                      <React.Fragment key={item.id}>
                        {/* Main menu item */}
                        <ListItem disablePadding sx={{ mb: 0.5 }}>
                          {item.hasSubmenu ? (
                            <ListItemButton
                              onClick={() => handleToggle(item.id)}
                              sx={{
                                borderRadius: 2, 
                                py: 1.5,
                                mx: 1,
                                mb: 0.5,
                                background: isActive 
                                  ? 'rgba(255, 214, 165, 0.2)' 
                                  : 'transparent',
                                backdropFilter: isActive ? 'blur(10px)' : 'none',
                                border: isActive 
                                  ? '1px solid rgba(255, 214, 165, 0.4)' 
                                  : '1px solid transparent',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  background: 'rgba(255, 214, 165, 0.15)',
                                  backdropFilter: 'blur(10px)',
                                  border: '1px solid rgba(255, 214, 165, 0.3)',
                                  transform: 'translateX(4px)',
                                }
                              }}
                            >
                              <ListItemIcon sx={{ 
                                minWidth: 40, 
                                color: isActive ? '#FFD6A5' : '#FAF3E0',
                                transition: 'all 0.3s ease'
                              }}>
                                {item.icon}
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography sx={{
                                      fontSize: '0.875rem',
                                      fontWeight: isActive ? 700 : 500,
                                      color: isActive ? '#FFD6A5' : '#FAF3E0'
                                    }}>
                                      {item.text}
                                    </Typography>
                                    {item.badge && typeof item.badge === 'string' && <ModernBadge>{item.badge}</ModernBadge>}
                                    {item.badge && typeof item.badge === 'object' && (
                                      <ModernBadge color={item.badge.color}>{item.badge.text}</ModernBadge>
                                    )}
                                  </Box>
                                }
                              />
                              {openItems[item.id]
                                ? <KeyboardArrowUp fontSize="small" sx={{ color: '#FFD6A5' }} />
                                : <KeyboardArrowDown fontSize="small" sx={{ color: '#FAF3E0' }} />
                              }
                            </ListItemButton>
                          ) : (
                            <ListItemButton
                              component={Link}
                              href={item.href}
                              onClick={closeSidebar}
                              sx={{
                                borderRadius: 2, 
                                py: 1.5,
                                mx: 1,
                                mb: 0.5,
                                background: isActive 
                                  ? 'rgba(255, 214, 165, 0.2)' 
                                  : 'transparent',
                                backdropFilter: isActive ? 'blur(10px)' : 'none',
                                border: isActive 
                                  ? '1px solid rgba(255, 214, 165, 0.4)' 
                                  : '1px solid transparent',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  background: 'rgba(255, 214, 165, 0.15)',
                                  backdropFilter: 'blur(10px)',
                                  border: '1px solid rgba(255, 214, 165, 0.3)',
                                  transform: 'translateX(4px)',
                                }
                              }}
                            >
                              <ListItemIcon sx={{ 
                                minWidth: 40, 
                                color: isActive ? '#FFD6A5' : '#FAF3E0',
                                transition: 'all 0.3s ease'
                              }}>
                                {item.icon}
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography sx={{
                                      fontSize: '0.875rem',
                                      fontWeight: isActive ? 700 : 500,
                                      color: isActive ? '#FFD6A5' : '#FAF3E0'
                                    }}>
                                      {item.text}
                                    </Typography>
                                    {item.badge && typeof item.badge === 'string' && <ModernBadge>{item.badge}</ModernBadge>}
                                    {item.badge && typeof item.badge === 'object' && (
                                      <ModernBadge color={item.badge.color}>{item.badge.text}</ModernBadge>
                                    )}
                                  </Box>
                                }
                              />
                            </ListItemButton>
                          )}
                        </ListItem>

                        {/* Submenu items */}
                        {item.hasSubmenu && (
                          <Collapse in={openItems[item.id]} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                            {item.submenuItems
                              .filter(subItem => !isHydrated || !user?.roles || user?.roles?.includes('Super Admin') || userHasAccess(subItem.href))
                              .map((subItem, index) => {
                                  // Check if item has custom isActive function, otherwise use isPathActive
                                  const subItemIsActive = subItem.isActive
                                    ? subItem.isActive()
                                    : isPathActive(subItem.href);

                                  // If item should be hidden (like Edit User when not editing), skip rendering
                                  if (subItem.text === 'Edit User' && !subItemIsActive) {
                                    return null;
                                  }

                                  return (
                                    <ListItem key={index} disablePadding sx={{ mb: 0.5, display: 'flex', justifyContent: 'center' }}>
                                      <ListItemButton
                                        component={Link}
                                        href={subItem.href}
                                        onClick={closeSidebar}
                                        sx={{
                                          py: 1.2, 
                                          borderRadius: 1.5,
                                          ml: 3,
                                          pl: 2,
                                          pr: 2,
                                          width: 'calc(100% - 24px)',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'flex-start',
                                          background: subItemIsActive 
                                            ? 'rgba(255, 214, 165, 0.15)' 
                                            : 'transparent',
                                          backdropFilter: subItemIsActive ? 'blur(10px)' : 'none',
                                          border: subItemIsActive 
                                            ? '1px solid rgba(255, 214, 165, 0.3)' 
                                            : '1px solid transparent',
                                          transition: 'all 0.3s ease',
                                          '&:hover': {
                                            background: 'rgba(255, 214, 165, 0.12)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255, 214, 165, 0.2)',
                                            transform: 'translateX(2px)',
                                          }
                                        }}
                                      >
                                        <ListItemIcon sx={{
                                          minWidth: 36,
                                          color: subItemIsActive ? '#FFD6A5' : 'rgba(250, 243, 224, 0.8)'
                                        }}>
                                          {subItem.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                          primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                              <Typography sx={{
                                                fontSize: '0.875rem',
                                                fontWeight: subItemIsActive ? 600 : 500,
                                                color: subItemIsActive ? '#FFD6A5' : 'rgba(250, 243, 224, 0.8)'
                                              }}>
                                                {subItem.text}
                                              </Typography>
                                              {subItem.badge && (
                                                <ModernBadge color={subItem.badge.color || '#FFD6A5'}>
                                                  {typeof subItem.badge === 'string' ? subItem.badge : subItem.badge.text}
                                                </ModernBadge>
                                              )}
                                            </Box>
                                          }
                                        />
                                      </ListItemButton>
                                    </ListItem>
                                  );
                                })}
                            </List>
                          </Collapse>
                        )}
                      </React.Fragment>
                    );
                  })}
              </List>
            </Box>

            {/* Support Section */}
            <Box sx={{ mt: 'auto', px: 2, pb: 3, position: 'relative', zIndex: 1 }}>
              <Divider sx={{ mx: 1, mb: 2, borderColor: 'rgba(255, 214, 165, 0.3)', opacity: 0.8 }} />
              <Typography sx={{
                fontSize: '0.6875rem', 
                fontWeight: 700, 
                color: 'rgba(255, 214, 165, 0.9)',
                textTransform: 'uppercase', 
                letterSpacing: '0.1rem', 
                mb: 1.5,
                px: 1.5,
                py: 0.5,
                background: 'rgba(255, 214, 165, 0.12)',
                borderRadius: 2,
                border: '1px solid rgba(255, 214, 165, 0.25)',
                textAlign: 'center',
              }}>
                SUPPORT
              </Typography>
              <Box sx={{ 
                textAlign: 'center', 
                px: 2,
                py: 1.5,
                borderRadius: 2,
                background: 'rgba(255, 214, 165, 0.08)',
                border: '1px solid rgba(255, 214, 165, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255, 214, 165, 0.15)',
                  border: '1px solid rgba(255, 214, 165, 0.35)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(255, 214, 165, 0.2)',
                }
              }}>
                <Typography sx={{ 
                  fontSize: '0.75rem', 
                  color: 'rgba(255, 214, 165, 0.95)',
                  fontWeight: 600,
                  mb: 0.5,
                }}>
                  Need help?
                </Typography>
                <Typography sx={{ 
                  fontSize: '0.7rem', 
                  color: 'rgba(255, 214, 165, 0.8)',
                  fontWeight: 400,
                }}>
                  Contact support
                </Typography>
              </Box>
            </Box>
          </Box>
        </>
      ) : (
        <Drawer
          variant="permanent"
          open={sidebarOpen}
          sx={(theme) => ({
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            ...(sidebarOpen && {
              ...openedMixin(theme),
              '& .MuiDrawer-paper': openedMixin(theme),
            }),
            ...(!sidebarOpen && {
              ...closedMixin(theme),
              '& .MuiDrawer-paper': closedMixin(theme),
            }),
          })}
        >
          {/* Logo */}
          <Box sx={{ 
            p: 3, 
            display: 'flex', 
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
            background: 'linear-gradient(135deg, rgba(255, 214, 165, 0.08) 0%, rgba(82, 121, 111, 0.05) 100%)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 214, 165, 0.15)',
          }}>
            <img src="/images/intenso.png" alt="IntensoCore" style={{ width: '50px', height: '50px', marginRight: '16px' }} />
            <Typography variant="subtitle1" sx={{ 
              fontSize: '22px', 
              fontWeight: 700, 
              color: '#FAF3E0',
              textShadow: '0 2px 4px rgba(255, 214, 165, 0.4)',
            }}>
              IntensoCore ERP
            </Typography>
          </Box>

          <Divider sx={{ mx: 2, borderColor: 'rgba(255, 214, 165, 0.25)', opacity: 0.8 }} />

          {/* Menu Section */}
          <Box sx={{ px: 2, py: 2, position: 'relative', zIndex: 1 }}>
            <Typography sx={{
              fontSize: '0.6875rem', 
              fontWeight: 700, 
              color: 'rgba(82, 121, 111, 0.8)',
              textTransform: 'uppercase', 
              letterSpacing: '0.1rem', 
              mb: 2,
              px: 1.5,
              py: 0.5,
              background: 'rgba(255, 214, 165, 0.08)',
              borderRadius: 2,
              border: '1px solid rgba(255, 214, 165, 0.15)',
            }}>
              NAVIGATION
            </Typography>

            <List sx={{ p: 0 }}>
              {menuItems
                .filter(item => shouldShowMenuItem(item))
                .map((item) => {
                  const isActive = item.hasSubmenu
                    ? hasActiveSubmenuItem(item.submenuItems)
                    : isPathActive(item.href);

                  return (
                    <React.Fragment key={item.id}>
                      {/* Main menu item */}
                      <ListItem disablePadding sx={{ mb: 0.5 }}>
                        {item.hasSubmenu ? (
                          <ListItemButton
                            onClick={() => handleToggle(item.id)}
                            sx={{
                              borderRadius: 2, 
                              py: 1.5,
                              mx: 1,
                              mb: 0.5,
                              background: isActive 
                                ? 'rgba(255, 214, 165, 0.2)' 
                                : 'transparent',
                              backdropFilter: isActive ? 'blur(10px)' : 'none',
                              border: isActive 
                                ? '1px solid rgba(255, 214, 165, 0.4)' 
                                : '1px solid transparent',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                background: 'rgba(255, 214, 165, 0.15)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 214, 165, 0.3)',
                                transform: 'translateX(4px)',
                              }
                            }}
                          >
                            <ListItemIcon sx={{ 
                              minWidth: 40, 
                              color: isActive ? '#FFD6A5' : '#FAF3E0',
                              transition: 'all 0.3s ease'
                            }}>
                              {item.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography sx={{
                                    fontSize: '0.875rem',
                                    fontWeight: isActive ? 700 : 500,
                                    color: isActive ? '#FFD6A5' : '#FAF3E0'
                                  }}>
                                    {item.text}
                                  </Typography>
                                  {item.badge && typeof item.badge === 'string' && <ModernBadge>{item.badge}</ModernBadge>}
                                  {item.badge && typeof item.badge === 'object' && (
                                    <ModernBadge color={item.badge.color}>{item.badge.text}</ModernBadge>
                                  )}
                                </Box>
                              }
                            />
                            {openItems[item.id]
                              ? <KeyboardArrowUp fontSize="small" sx={{ color: '#FFD6A5' }} />
                              : <KeyboardArrowDown fontSize="small" sx={{ color: '#FAF3E0' }} />
                            }
                          </ListItemButton>
                        ) : (
                          <ListItemButton
                            component={Link}
                            href={item.href}
                            onClick={closeSidebar}
                            sx={{
                              borderRadius: 2, 
                              py: 1.5,
                              mx: 1,
                              mb: 0.5,
                              background: isActive 
                                ? 'rgba(255, 214, 165, 0.2)' 
                                : 'transparent',
                              backdropFilter: isActive ? 'blur(10px)' : 'none',
                              border: isActive 
                                ? '1px solid rgba(255, 214, 165, 0.4)' 
                                : '1px solid transparent',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                background: 'rgba(255, 214, 165, 0.15)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 214, 165, 0.3)',
                                transform: 'translateX(4px)',
                              }
                            }}
                          >
                            <ListItemIcon sx={{ 
                              minWidth: 40, 
                              color: isActive ? '#FFD6A5' : '#FAF3E0',
                              transition: 'all 0.3s ease'
                            }}>
                              {item.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography sx={{
                                    fontSize: '0.875rem',
                                    fontWeight: isActive ? 700 : 500,
                                    color: isActive ? '#FFD6A5' : '#FAF3E0'
                                  }}>
                                    {item.text}
                                  </Typography>
                                  {item.badge && typeof item.badge === 'string' && <ModernBadge>{item.badge}</ModernBadge>}
                                  {item.badge && typeof item.badge === 'object' && (
                                    <ModernBadge color={item.badge.color}>{item.badge.text}</ModernBadge>
                                  )}
                                </Box>
                              }
                            />
                          </ListItemButton>
                        )}
                      </ListItem>

                      {/* Submenu items */}
                      {item.hasSubmenu && (
                        <Collapse in={openItems[item.id]} timeout="auto" unmountOnExit>
                          <List component="div" disablePadding>
                          {item.submenuItems
                            .filter(subItem => !isHydrated || !user?.roles || user?.roles?.includes('Super Admin') || userHasAccess(subItem.href))
                            .map((subItem, index) => {
                                // Check if item has custom isActive function, otherwise use isPathActive
                                const subItemIsActive = subItem.isActive
                                  ? subItem.isActive()
                                  : isPathActive(subItem.href);

                                // If item should be hidden (like Edit User when not editing), skip rendering
                                if (subItem.text === 'Edit User' && !subItemIsActive) {
                                  return null;
                                }

                                return (
                                  <ListItem key={index} disablePadding sx={{ mb: 0.5, display: 'flex', justifyContent: 'center' }}>
                                    <ListItemButton
                                      component={Link}
                                      href={subItem.href}
                                      onClick={closeSidebar}
                                      sx={{
                                        py: 1.2, 
                                        borderRadius: 1.5,
                                        ml: 3,
                                        pl: 2,
                                        pr: 2,
                                        width: 'calc(100% - 24px)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        background: subItemIsActive 
                                          ? 'rgba(255, 214, 165, 0.15)' 
                                          : 'transparent',
                                        backdropFilter: subItemIsActive ? 'blur(10px)' : 'none',
                                        border: subItemIsActive 
                                          ? '1px solid rgba(255, 214, 165, 0.3)' 
                                          : '1px solid transparent',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                          background: 'rgba(255, 214, 165, 0.12)',
                                          backdropFilter: 'blur(10px)',
                                          border: '1px solid rgba(255, 214, 165, 0.2)',
                                          transform: 'translateX(2px)',
                                        }
                                      }}
                                    >
                                      <ListItemIcon sx={{
                                        minWidth: 36,
                                        color: subItemIsActive ? '#FFD6A5' : 'rgba(250, 243, 224, 0.8)'
                                      }}>
                                        {subItem.icon}
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={
                                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography sx={{
                                              fontSize: '0.875rem',
                                              fontWeight: subItemIsActive ? 600 : 500,
                                              color: subItemIsActive ? '#FFD6A5' : 'rgba(250, 243, 224, 0.8)'
                                            }}>
                                              {subItem.text}
                                            </Typography>
                                            {subItem.badge && (
                                              <ModernBadge color={subItem.badge.color || '#FFD6A5'}>
                                                {typeof subItem.badge === 'string' ? subItem.badge : subItem.badge.text}
                                              </ModernBadge>
                                            )}
                                          </Box>
                                        }
                                      />
                                    </ListItemButton>
                                  </ListItem>
                                );
                              })}
                          </List>
                        </Collapse>
                      )}
                    </React.Fragment>
                  );
                })}
            </List>
          </Box>

          {/* Support Section */}
          <Box sx={{ mt: 'auto', px: 2, pb: 3, position: 'relative', zIndex: 1 }}>
            <Divider sx={{ mx: 1, mb: 2, borderColor: 'rgba(255, 214, 165, 0.3)', opacity: 0.8 }} />
            <Typography sx={{
              fontSize: '0.6875rem', 
              fontWeight: 700, 
              color: 'rgba(255, 214, 165, 0.9)',
              textTransform: 'uppercase', 
              letterSpacing: '0.1rem', 
              mb: 1.5,
              px: 1.5,
              py: 0.5,
              background: 'rgba(255, 214, 165, 0.12)',
              borderRadius: 2,
              border: '1px solid rgba(255, 214, 165, 0.25)',
              textAlign: 'center',
            }}>
              SUPPORT
            </Typography>
            <Box sx={{ 
              textAlign: 'center', 
              px: 2,
              py: 1.5,
              borderRadius: 2,
              background: 'rgba(255, 214, 165, 0.08)',
              border: '1px solid rgba(255, 214, 165, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(255, 214, 165, 0.15)',
                border: '1px solid rgba(255, 214, 165, 0.35)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(255, 214, 165, 0.2)',
              }
            }}>
              <Typography sx={{ 
                fontSize: '0.75rem', 
                color: 'rgba(255, 214, 165, 0.95)',
                fontWeight: 600,
                mb: 0.5,
              }}>
                Need help?
              </Typography>
              <Typography sx={{ 
                fontSize: '0.7rem', 
                color: 'rgba(255, 214, 165, 0.8)',
                fontWeight: 400,
              }}>
                Contact support
              </Typography>
            </Box>
          </Box>
        </Drawer>
      )}

      {/* Header */}
      <AppBar position="fixed" open={!isMobile && sidebarOpen}>
        <Toolbar sx={{ height: 70, px: 3 }}>
          {/* Hamburger Menu */}
          <EnhancedIconButton
            size="small"
            sx={{ mr: 2 }}
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <MenuIcon fontSize="small" />
          </EnhancedIconButton>

          {/* Search Bar */}
          <SearchContainer>
            <SearchBar>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search or type command..."
                inputProps={{ 'aria-label': 'search' }}
              />
              <QuickSearchShortcut>⌘K</QuickSearchShortcut>
            </SearchBar>
          </SearchContainer>

          <Box sx={{ flexGrow: 1 }} />

          {/* Quick Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 3 }}>
            {/* Time Display */}
            <TimeStatusChip />
            
            {/* Notifications */}
            <Tooltip title="Notifications" arrow>
              <EnhancedIconButton size="small">
                <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', minWidth: 16, height: 16 } }}>
                  <Notifications fontSize="small" />
                </Badge>
              </EnhancedIconButton>
            </Tooltip>

            {/* Refresh */}
            <Tooltip title="Refresh Page" arrow>
              <EnhancedIconButton size="small" onClick={handleRefresh}>
                <Refresh fontSize="small" />
              </EnhancedIconButton>
            </Tooltip>

            {/* Fullscreen Toggle */}
            <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"} arrow>
              <EnhancedIconButton size="small" onClick={toggleFullscreen}>
                {isFullscreen ? <FullscreenExit fontSize="small" /> : <Fullscreen fontSize="small" />}
              </EnhancedIconButton>
            </Tooltip>
          </Box>

          {/* User Profile */}
          <Grow in={true} timeout={800}>
            <Box
              sx={{
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                borderRadius: 2, 
                px: 1.5, 
                py: 1,
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-1px)',
                  '& .user-avatar': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 15px rgba(255, 214, 165, 0.4)',
                  },
                  '& .user-name': {
                    color: '#FFD6A5',
                  },
                  '& .dropdown-arrow': {
                    transform: 'translateX(2px)',
                  }
                }
              }}
              onClick={handleProfileMenuOpen}
            >
              <Avatar 
                className="user-avatar"
                sx={{ 
                  width: 40, 
                  height: 40, 
                  border: '2px solid rgba(255, 214, 165, 0.5)',
                  background: 'linear-gradient(135deg, #52796F, #2F3E46)',
                  color: '#FAF3E0',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease',
                }}
              >
                {avatarText || 'U'}
              </Avatar>
              <Box sx={{ ml: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography 
                  className="user-name"
                  sx={{ 
                    fontSize: '0.9rem', 
                    fontWeight: 600, 
                    color: '#FAF3E0',
                    lineHeight: 1.2,
                    transition: 'color 0.3s ease',
                  }}
                >
                  {displayName || 'User'}
                </Typography>
                <Typography sx={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 400, 
                  color: 'rgba(255, 214, 165, 0.7)',
                  textTransform: 'capitalize',
                }}>
                  {user?.roles?.[0] || 'User'}
                </Typography>
              </Box>
              <KeyboardArrowDown 
                className="dropdown-arrow"
                fontSize="small" 
                sx={{ 
                  color: 'rgba(255, 214, 165, 0.8)', 
                  fontSize: '1.4rem', 
                  ml: 1,
                  transition: 'all 0.3s ease',
                  transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }} 
              />
            </Box>
          </Grow>

          {/* Enhanced User Menu */}
          <Menu
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                background: 'linear-gradient(135deg, rgba(250, 243, 224, 0.95) 0%, rgba(255, 214, 165, 0.9) 100%)',
                backdropFilter: 'blur(25px)',
                border: '1px solid rgba(255, 214, 165, 0.3)',
                boxShadow: '0 20px 40px rgba(47, 62, 70, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                mt: 1.5,
                borderRadius: 4,
                minWidth: 220,
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 22,
                  width: 12,
                  height: 12,
                  bgcolor: 'rgba(250, 243, 224, 0.95)',
                  transform: 'translateY(-50%) rotate(45deg)',
                  border: '1px solid rgba(255, 214, 165, 0.3)',
                  borderBottom: 'none',
                  borderRight: 'none',
                },
                '& .MuiMenuItem-root': {
                  px: 2.5,
                  py: 1.8,
                  borderRadius: 2.5,
                  mx: 1.5,
                  my: 0.5,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(255, 214, 165, 0.25) 0%, rgba(82, 121, 111, 0.15) 100%)',
                    backdropFilter: 'blur(15px)',
                    transform: 'translateX(4px) scale(1.02)',
                    boxShadow: '0 4px 15px rgba(255, 214, 165, 0.2)',
                  }
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            MenuListProps={{
              autoFocusItem: false,
              disablePadding: true,
              sx: { py: 1 }
            }}
            disableAutoFocusItem
          >
            <MenuItem onClick={handleAccountSettings}>
              <ListItemIcon>
                <Settings fontSize="small" sx={{ color: '#52796F' }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ 
                    fontSize: '0.9rem', 
                    color: '#2F3E46',
                    fontWeight: 500
                  }}>
                    Account Settings
                  </Typography>
                }
              />
            </MenuItem>
            <Divider sx={{ mx: 1.5, my: 0.5, borderColor: 'rgba(255, 214, 165, 0.3)' }} />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <ExitToApp fontSize="small" sx={{ color: '#52796F' }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ 
                    fontSize: '0.9rem', 
                    color: '#2F3E46',
                    fontWeight: 500
                  }}>
                    Sign Out
                  </Typography>
                }
              />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <MainContent open={sidebarOpen}>
        {children}
      </MainContent>
    </Box>
  );
}

export default function HeaderSidebar({ children }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeaderSidebarContent>{children}</HeaderSidebarContent>
    </Suspense>
  );
}
