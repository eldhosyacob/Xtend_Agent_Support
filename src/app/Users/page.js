"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthAxios from "@/hooks/useAuthAxios";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  Paper,
  Fade,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip
} from "@mui/material";
import {
  Search,
  Edit,
  Delete,
  Visibility,
  Add,
  People,
  Person,
  Email,
  AdminPanelSettings,
  CheckCircle,
  Cancel,
  Warning
} from "@mui/icons-material";
import "./page.scss";

// Define a fallback image URL
const FALLBACK_IMAGE_URL = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3Ctext x="50" y="50" font-family="Arial" font-size="14" fill="%23999" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';

// Floating Animation Component
const FloatingCard = ({ children, delay = 0 }) => {
  return (
    <Fade in timeout={800 + delay}>
      <Box>
        {children}
      </Box>
    </Fade>
  );
};

// User Card Component
const UserCard = ({ user, delay = 0, onDelete, onEdit, onView }) => {
  // Get color theme for this user
  const getUserColor = () => {
    const colors = [
      {
        primary: '#2196f3',
        background: 'rgba(33, 150, 243, 0.12)',
        border: 'rgba(33, 150, 243, 0.25)',
        shadow: 'rgba(33, 150, 243, 0.15)'
      },
      {
        primary: '#4caf50',
        background: 'rgba(76, 175, 80, 0.12)',
        border: 'rgba(76, 175, 80, 0.25)',
        shadow: 'rgba(76, 175, 80, 0.15)'
      },
      {
        primary: '#f44336',
        background: 'rgba(244, 67, 54, 0.12)',
        border: 'rgba(244, 67, 54, 0.25)',
        shadow: 'rgba(244, 67, 54, 0.15)'
      },
      {
        primary: '#ff9800',
        background: 'rgba(255, 152, 0, 0.12)',
        border: 'rgba(255, 152, 0, 0.25)',
        shadow: 'rgba(255, 152, 0, 0.15)'
      }
    ];
    const colorIndex = user._id ? 
      parseInt(user._id.slice(-1), 16) % 4 : 0;
    return colors[colorIndex];
  };

  const userColor = getUserColor();

  return (
    <FloatingCard delay={delay}>
      <Card
        sx={{
          height: '100%',
          background: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(25px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: 4,
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
            background: 'rgba(255, 255, 255, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
          }
        }}
      >
        {/* User Name Header - COLORED SECTION */}
        <Box
          sx={{
            position: 'relative',
            height: 180,
            background: `
              linear-gradient(135deg, 
                ${userColor.background} 0%, 
                rgba(255, 255, 255, 0.4) 100%
              )
            `,
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at center, ${userColor.shadow}, transparent 70%)`,
              opacity: 0.4
            }
          }}
        >
          <Box
            sx={{
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
              p: 3,
            }}
          >
            {user?.profileImage ? (
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 200,
                  overflow: 'hidden',
                  mx: 'auto',
                  mb: 2,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={process.env.NEXT_PUBLIC_APP_CDN_URL + "/HappyPaw/Users/" + user._id + "/" + user.profileImage}
                  alt={`${user.fullName} profile`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <Avatar
                  sx={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(82, 121, 111, 0.8), rgba(47, 62, 70, 0.9))',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: 'white',
                    display: 'none'
                  }}
                >
                  {user.fullName?.charAt(0) || 'U'}
                </Avatar>
              </Box>
            ) : (
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  background: 'linear-gradient(135deg, rgba(82, 121, 111, 0.8), rgba(47, 62, 70, 0.9))',
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'white',
                  mx: 'auto',
                  mb: 2,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                }}
              >
                {user.fullName?.charAt(0) || 'U'}
              </Avatar>
            )}
            
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 1, 
                color: '#2F3E46', 
                fontWeight: 700,
                textShadow: '0 2px 4px rgba(255, 255, 255, 0.8)',
                background: 'linear-gradient(135deg, #1a1a1a, #2F3E46)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '1.1rem'
              }}
            >
              {user.fullName}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#2F3E46', 
                fontWeight: 600,
                opacity: 0.9,
                fontSize: '0.8rem',
                letterSpacing: '0.5px',
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.6)'
              }}
            >
              {user.email}
            </Typography>
          </Box>
          
          {/* Decorative floating elements */}
          <Box
            sx={{
              position: 'absolute',
              top: 15,
              right: 15,
              width: 30,
              height: 30,
              background: `radial-gradient(circle, ${userColor.shadow}, transparent 70%)`,
              borderRadius: '50%',
              opacity: 0.6,
              animation: 'float 3s ease-in-out infinite',
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-5px)' }
              }
            }}
          />
        </Box>

        {/* User Information Content */}
        <CardContent sx={{ p: 3, pt: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ color: '#52796F', fontWeight: 600, mb: 1 }}>
              Roles
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {user.roles.map((role) => (
                <Chip
                  key={role._id}
                  label={role.label}
                  size="small"
                  sx={{
                    background: 'linear-gradient(135deg, rgba(82, 121, 111, 0.1), rgba(47, 62, 70, 0.05))',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(82, 121, 111, 0.2)',
                    color: '#52796F',
                    fontWeight: 500,
                    fontSize: '0.7rem',
                    borderRadius: 2,
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(82, 121, 111, 0.15), rgba(47, 62, 70, 0.08))',
                    }
                  }}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ color: '#52796F', fontWeight: 600, mb: 1 }}>
              Status
            </Typography>
            <Chip
              label={user.isActive === true ? "Active" : "Inactive"}
              size="small"
              sx={{
                background: user.isActive === true 
                  ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(76, 175, 80, 0.1))'
                  : 'linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(244, 67, 54, 0.1))',
                color: user.isActive === true ? '#4caf50' : '#f44336',
                fontWeight: 600,
                fontSize: '0.75rem',
                border: `1px solid ${user.isActive === true ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`,
                borderRadius: 2,
                backdropFilter: 'blur(10px)'
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ color: '#52796F', fontWeight: 600, mb: 1 }}>
              Joined
            </Typography>
            <Typography variant="body2" sx={{ color: '#2F3E46', fontWeight: 500 }}>
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>
          </Box>

          {/* Action Buttons */}
          {!user.roles.some(role => role.label === "Super Admin") && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              gap: 1, 
              mt: 3,
              pt: 2,
              borderTop: '1px solid rgba(82, 121, 111, 0.1)'
            }}>
              <Button
                onClick={() => onView(user)}
                size="small"
                startIcon={<Visibility sx={{ fontSize: '1.2rem' }} />}
                sx={{
                  minWidth: 'auto',
                  background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(33, 150, 243, 0.05))',
                  color: '#2196f3',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(33, 150, 243, 0.2)',
                  borderRadius: '8px',
                  px: 2,
                  py: 0.75,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.15), rgba(33, 150, 243, 0.08))',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.15)'
                  }
                }}
              >
                View
              </Button>
              <Button
                onClick={() => onEdit(user._id)}
                size="small"
                startIcon={<Edit sx={{ fontSize: '1.2rem' }} />}
                sx={{
                  minWidth: 'auto',
                  background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05))',
                  color: '#4caf50',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(76, 175, 80, 0.2)',
                  borderRadius: '8px',
                  px: 2,
                  py: 0.75,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.15), rgba(76, 175, 80, 0.08))',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.15)'
                  }
                }}
              >
                Edit
              </Button>
              <Button
                onClick={() => onDelete(user._id)}
                size="small"
                startIcon={<Delete sx={{ fontSize: '1.2rem' }} />}
                sx={{
                  minWidth: 'auto',
                  background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(244, 67, 54, 0.05))',
                  color: '#f44336',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(244, 67, 54, 0.2)',
                  borderRadius: '8px',
                  px: 2,
                  py: 0.75,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.15), rgba(244, 67, 54, 0.08))',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(244, 67, 54, 0.15)'
                  }
                }}
              >
                Delete
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </FloatingCard>
  );
};

// Stats Card Component  
const StatsCard = ({ title, value, icon, color, delay = 0 }) => {
  const getCardColors = (color) => {
    const colorMap = {
      '#2196f3': {
        background: 'rgba(33, 150, 243, 0.12)',
        border: 'rgba(33, 150, 243, 0.25)',
        shadow: 'rgba(33, 150, 243, 0.15)'
      },
      '#4caf50': {
        background: 'rgba(76, 175, 80, 0.12)',
        border: 'rgba(76, 175, 80, 0.25)',
        shadow: 'rgba(76, 175, 80, 0.15)'
      },
      '#f44336': {
        background: 'rgba(244, 67, 54, 0.12)',
        border: 'rgba(244, 67, 54, 0.25)',
        shadow: 'rgba(244, 67, 54, 0.15)'
      },
      '#ff9800': {
        background: 'rgba(255, 152, 0, 0.12)',
        border: 'rgba(255, 152, 0, 0.25)',
        shadow: 'rgba(255, 152, 0, 0.15)'
      }
    };
    return colorMap[color] || colorMap['#2196f3'];
  };

  const cardColors = getCardColors(color);

  return (
    <FloatingCard delay={delay}>
      <Card
        sx={{
          height: '100%',
          background: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(25px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: 4,
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
          position: 'relative',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 20px 50px ${cardColors.shadow}, inset 0 1px 0 rgba(255, 255, 255, 0.5)`,
            background: 'rgba(255, 255, 255, 0.75)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${cardColors.background}, rgba(255, 255, 255, 0.2))`,
            opacity: 0.6,
            pointerEvents: 'none'
          }
        }}
      >
        <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: 200,
                background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: `0 8px 25px ${cardColors.shadow}`,
              }}
            >
              {icon}
            </Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                color: '#2F3E46',
                textShadow: '0 2px 4px rgba(255, 255, 255, 0.8)'
              }}
            >
              {value}
            </Typography>
          </Box>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: '#52796F', 
              fontWeight: 600,
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {title}
          </Typography>
        </CardContent>
      </Card>
    </FloatingCard>
  );
};

// Custom Dialog Components
const ThemedDialog = ({ open, onClose, title, content, actions, icon, iconColor = '#52796F' }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(255, 255, 255, 0.55)',
          backdropFilter: 'blur(25px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: 4,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
        }
      }}
      BackdropProps={{
        sx: {
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(12px)'
        }
      }}
    >
      <DialogTitle sx={{ 
        color: '#2F3E46', 
        fontWeight: 600, 
        textShadow: '0 1px 2px rgba(255, 255, 255, 0.6)',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${iconColor}, ${iconColor}cc)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}
        >
          {icon}
        </Box>
        {title}
      </DialogTitle>
      <DialogContent sx={{ color: '#2F3E46' }}>
        {content}
      </DialogContent>
      <DialogActions>
        {actions}
      </DialogActions>
    </Dialog>
  );
};

const CustomConfirmDialog = ({ open, onClose, onConfirm, title, message }) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const actions = (
    <>
      <Button
        onClick={onClose}
        variant="outlined"
        sx={{
          borderRadius: 2,
          border: '1px solid rgba(82, 121, 111, 0.4)',
          color: '#52796F',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))',
          backdropFilter: 'blur(15px)',
          fontWeight: 600,
          px: 3,
          '&:hover': {
            border: '1px solid rgba(82, 121, 111, 0.6)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
          }
        }}
      >
        Cancel
      </Button>
      <Button
        onClick={handleConfirm}
        variant="contained"
        sx={{
          borderRadius: 2,
          background: 'linear-gradient(135deg, #f44336, rgba(244, 67, 54, 0.8))',
          color: 'white',
          fontWeight: 600,
          px: 4,
          boxShadow: '0 4px 12px rgba(244, 67, 54, 0.4)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(244, 67, 54, 0.6)',
            transform: 'translateY(-1px)',
          }
        }}
      >
        Delete
      </Button>
    </>
  );

  return (
    <ThemedDialog
      open={open}
      onClose={onClose}
      title={title}
      content={message}
      actions={actions}
      icon={<Warning />}
      iconColor="#f44336"
    />
  );
};

const CustomAlertDialog = ({ open, onClose, title, message, type = 'success' }) => {
  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return { icon: <CheckCircle />, color: '#4caf50' };
      case 'error':
        return { icon: <Cancel />, color: '#f44336' };
      default:
        return { icon: <CheckCircle />, color: '#4caf50' };
    }
  };

  const { icon, color } = getIconAndColor();

  const actions = (
    <Button
      onClick={onClose}
      variant="contained"
      sx={{
        borderRadius: 2,
        background: `linear-gradient(135deg, ${color}, rgba(82, 121, 111, 0.8))`,
        color: 'white',
        fontWeight: 600,
        px: 4,
        boxShadow: `0 4px 12px ${color}40`,
        '&:hover': {
          boxShadow: `0 6px 16px ${color}60`,
          transform: 'translateY(-1px)',
        }
      }}
    >
      OK
    </Button>
  );

  return (
    <ThemedDialog
      open={open}
      onClose={onClose}
      title={title}
      content={message}
      actions={actions}
      icon={icon}
      iconColor={color}
    />
  );
};

export default function Users() {
  const authAxios = useAuthAxios();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [viewDialog, setViewDialog] = useState({ open: false, user: null });

  // Dialog states
  const [confirmDialog, setConfirmDialog] = useState({ open: false, userId: null });
  const [alertDialog, setAlertDialog] = useState({ open: false, title: '', message: '', type: 'success' });

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await authAxios({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/user_list`,
      });
      if (response) {
        setUsers(response.data.users || []);
        setRoles(response.data.roles || []);
      }
      setIsLoading(false);
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    let matchesSearch = true;
    let matchesRole = true;

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      matchesSearch = (
        user.fullName?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search)
      );
    }

    // Apply role filter
    if (selectedRoles.length > 0) {
      matchesRole = user.roles?.some(role => selectedRoles.includes(role._id));
    }

    return matchesSearch && matchesRole;
  });

  const usersWithEmail = users.filter(user => user.email).length;
  const activeUsers = users.filter(user => user.isActive === true).length;
  const adminUsers = users.filter(user => user.roles?.some(role => role.label?.includes('Admin'))).length;

  const showAlert = (title, message, type = 'success') => {
    setAlertDialog({ open: true, title, message, type });
  };

  const showConfirm = (userId) => {
    setConfirmDialog({ open: true, userId });
  };

  const handleDeleteUser = async (userId) => {
    const response = await authAxios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_API_URL}/users/user_delete`,
      data: {
        userId: userId
      }
    });
    
    if (!response) return;
    
    if (response.data.status === "Success") {
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      showAlert("Success", "User deleted successfully", "success");
    } else {
      showAlert("Error", "Failed to delete user", "error");
    }
  };

  const handleEditUser = (userId) => {
    router.push(`/Users/UserCreateEdit/${userId}`);
  };

  const handleViewUser = (user) => {
    setViewDialog({ open: true, user });
  };

  const handleRoleChange = (roleId) => {
    setSelectedRoles(prev => {
      if (prev.includes(roleId)) {
        return prev.filter(id => id !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedRoles([]);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, 
            rgba(255, 255, 255, 0.95) 0%, 
            rgba(240, 248, 255, 0.8) 25%, 
            rgba(230, 250, 240, 0.8) 50%, 
            rgba(255, 250, 235, 0.8) 75%, 
            rgba(250, 245, 255, 0.95) 100%
          ),
          url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%2352796F' fill-opacity='0.02' fill-rule='evenodd'/%3E%3C/svg%3E")
        `,
        backgroundSize: 'cover, 100px 100px',
        backgroundPosition: 'center, 0 0',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2352796F" fill-opacity="0.04"%3E%3Ccircle cx="30" cy="30" r="1.5"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"),
            url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%232F3E46" fill-opacity="0.02"%3E%3Cpath d="M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `,
          backgroundSize: '60px 60px, 40px 40px',
          backgroundPosition: '0 0, 30px 30px',
          opacity: 1,
          pointerEvents: 'none'
        }
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
        <Fade in timeout={600}>
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                borderRadius: 4,
                p: 4,
                mb: 3,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(82, 121, 111, 0.05), transparent 70%)',
                  opacity: 0.6,
                  pointerEvents: 'none'
                }
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #000000, #0a0a0a)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    textShadow: '0 2px 4px rgba(255, 255, 255, 0.8)'
                  }}
                >
                  Users Directory
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#52796F',
                    fontWeight: 500,
                    mb: 3,
                    opacity: 0.9,
                    fontSize: '1.1rem'
                  }}
                >
                  Manage system users and their permissions
                </Typography>
                
                {/* Enhanced Search and Filter */}
                <Paper
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
                    backdropFilter: 'blur(25px)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    borderRadius: 4,
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(47, 62, 70, 0.02), transparent 60%)',
                      opacity: 0.8,
                      pointerEvents: 'none'
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: '#2F3E46',
                        fontWeight: 600,
                        mb: 2,
                        fontSize: '1rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      Search & Filter
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
                      <TextField
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{
                          flex: 1,
                          minWidth: 300,
                          '& .MuiOutlinedInput-root': {
                            background: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(15px)',
                            borderRadius: 3,
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(82, 121, 111, 0.5)'
                              },
                              boxShadow: '0 6px 20px rgba(82, 121, 111, 0.1)'
                            },
                            '&.Mui-focused': {
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#52796F'
                              },
                              boxShadow: '0 8px 25px rgba(82, 121, 111, 0.15)'
                            }
                          }
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search sx={{ color: '#52796F', fontSize: '1.2rem' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() => router.push('/Users/UserCreateEdit')}
                        sx={{
                          borderRadius: 3,
                          border: '1px solid rgba(82, 121, 111, 0.4)',
                          color: '#52796F',
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))',
                          backdropFilter: 'blur(15px)',
                          fontWeight: 600,
                          px: 3,
                          py: 1,
                          boxShadow: '0 4px 15px rgba(82, 121, 111, 0.1)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            border: '1px solid rgba(82, 121, 111, 0.6)',
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(82, 121, 111, 0.2)'
                          }
                        }}
                      >
                        Add User
                      </Button>
                    </Box>

                    {/* Role Filters */}
                    {roles.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 2, color: '#2F3E46', fontWeight: 600 }}>
                          Filter by Role
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {roles.map((role) => (
                            <Chip
                              key={role._id}
                              label={role.label}
                              variant={selectedRoles.includes(role._id) ? "filled" : "outlined"}
                              onClick={() => handleRoleChange(role._id)}
                              size="small"
                              sx={{
                                borderRadius: 2,
                                ...(selectedRoles.includes(role._id) ? {
                                  background: 'linear-gradient(135deg, #52796F, rgba(82, 121, 111, 0.8))',
                                  color: 'white',
                                  border: '1px solid rgba(82, 121, 111, 0.4)'
                                } : {
                                  background: 'rgba(255, 255, 255, 0.6)',
                                  border: '1px solid rgba(82, 121, 111, 0.3)',
                                  color: '#52796F'
                                }),
                                '&:hover': {
                                  transform: 'translateY(-1px)',
                                  boxShadow: '0 4px 12px rgba(82, 121, 111, 0.15)'
                                }
                              }}
                            />
                          ))}
                        </Box>
                        
                        {(searchTerm || selectedRoles.length > 0) && (
                          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" sx={{ color: '#52796F', fontWeight: 500 }}>
                              {filteredUsers.length} users found
                            </Typography>
                            <Button
                              variant="text"
                              onClick={clearFilters}
                              size="small"
                              sx={{
                                color: '#52796F',
                                textTransform: 'none',
                                fontWeight: 500
                              }}
                            >
                              Clear Filters
                            </Button>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Box>
              
              {/* Decorative Elements */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -40,
                  right: -40,
                  width: 120,
                  height: 120,
                  background: 'radial-gradient(circle, rgba(82, 121, 111, 0.1), transparent 70%)',
                  borderRadius: '50%',
                  opacity: 0.6
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -20,
                  left: -20,
                  width: 80,
                  height: 80,
                  background: 'radial-gradient(circle, rgba(47, 62, 70, 0.08), transparent 70%)',
                  borderRadius: '50%',
                  opacity: 0.4
                }}
              />
            </Box>
          </Box>
        </Fade>

        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Total Users"
              value={users.length}
              icon={<People />}
              color="#2196f3"
              delay={0}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Active Users"
              value={activeUsers}
              icon={<Person />}
              color="#4caf50"
              delay={100}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="With Email"
              value={usersWithEmail}
              icon={<Email sx={{ color: 'white', fontSize: '1.5rem' }} />}
              color="#f44336"
              delay={200}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Admin Users"
              value={adminUsers}
              icon={<AdminPanelSettings sx={{ color: 'white', fontSize: '1.5rem' }} />}
              color="#ff9800"
              delay={300}
            />
          </Grid>
        </Grid>

        {/* Users Grid */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: '#52796F' }}>
              Loading users...
            </Typography>
          </Box>
        ) : filteredUsers.length === 0 ? (
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              borderRadius: 4,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at center, rgba(82, 121, 111, 0.06), transparent 70%)',
                opacity: 0.8,
                pointerEvents: 'none'
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  background: 'linear-gradient(135deg, rgba(82, 121, 111, 0.1), rgba(47, 62, 70, 0.05))',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 10px 30px rgba(82, 121, 111, 0.1)'
                }}
              >
                <People sx={{ fontSize: 60, color: '#52796F', opacity: 0.7 }} />
              </Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  background: 'linear-gradient(135deg, #1a1a1a, #2F3E46)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2, 
                  fontWeight: 600,
                  textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)' 
                }}
              >
                {searchTerm || selectedRoles.length > 0 ? 'No users found' : 'No users available'}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#52796F', 
                  opacity: 0.8,
                  fontWeight: 500,
                  fontSize: '1rem'
                }}
              >
                {searchTerm || selectedRoles.length > 0
                  ? 'Try adjusting your search terms or filters'
                  : 'Start by adding your first user to the system'
                }
              </Typography>
            </Box>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredUsers.map((user, index) => (
              <Grid key={user._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <UserCard 
                  user={user} 
                  delay={index * 100} 
                  onDelete={showConfirm}
                  onEdit={handleEditUser}
                  onView={handleViewUser}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* User Details Dialog */}
      <Dialog 
        open={viewDialog.open} 
        onClose={() => setViewDialog({ open: false, user: null })}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.55)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: 4,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          }
        }}
        BackdropProps={{
          sx: {
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(12px)'
          }
        }}
      >
        <DialogTitle sx={{ color: '#2F3E46', fontWeight: 600, textShadow: '0 1px 2px rgba(255, 255, 255, 0.6)' }}>
          User Details
        </DialogTitle>
        <DialogContent>
          {viewDialog.user && (
            <Box sx={{ pt: 2 }}>
              {/* User Profile Section */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 4,
                p: 4,
                background: `
                  linear-gradient(135deg, 
                    ${(() => {
                      const colors = [
                        'rgba(33, 150, 243, 0.12)', 
                        'rgba(76, 175, 80, 0.12)',  
                        'rgba(244, 67, 54, 0.12)',  
                        'rgba(255, 152, 0, 0.12)'   
                      ];
                      const colorIndex = viewDialog.user._id ? 
                        parseInt(viewDialog.user._id.slice(-1), 16) % 4 : 0;
                      return colors[colorIndex];
                    })()}, 
                    rgba(255, 255, 255, 0.4)
                  )
                `,
                backdropFilter: 'blur(25px)',
                borderRadius: 4,
                border: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
              }}>
                {viewDialog.user.profileImage ? (
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: 200,
                      overflow: 'hidden',
                      mr: 4,
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img
                      src={process.env.NEXT_PUBLIC_APP_CDN_URL + '/HappyPaw/Users/' + viewDialog.user._id + '/' + viewDialog.user.profileImage}
                      alt={`${viewDialog.user.fullName} profile`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <Avatar
                      sx={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(82, 121, 111, 0.8), rgba(47, 62, 70, 0.9))',
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: 'white',
                        display: 'none'
                      }}
                    >
                      {viewDialog.user.fullName?.charAt(0) || 'U'}
                    </Avatar>
                  </Box>
                ) : (
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      background: 'linear-gradient(135deg, rgba(82, 121, 111, 0.8), rgba(47, 62, 70, 0.9))',
                      fontSize: '2rem',
                      fontWeight: 700,
                      color: 'white',
                      mr: 4,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    {viewDialog.user.fullName?.charAt(0) || 'U'}
                  </Avatar>
                )}
                <Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      mb: 1, 
                      color: '#2F3E46', 
                      fontWeight: 700,
                      textShadow: '0 2px 4px rgba(255, 255, 255, 0.8)',
                      background: 'linear-gradient(135deg, #1a1a1a, #2F3E46)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {viewDialog.user.fullName}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#2F3E46', 
                      fontWeight: 600,
                      opacity: 0.9,
                      fontSize: '0.95rem',
                      letterSpacing: '0.5px',
                      textShadow: '0 1px 2px rgba(255, 255, 255, 0.6)'
                    }}
                  >
                    User ID: {viewDialog.user._id?.slice(-8) || 'N/A'}
                  </Typography>
                </Box>
              </Box>
              
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#52796F', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Email sx={{ fontSize: 'small' }} />
                      Email
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#2F3E46', fontWeight: 500 }}>
                      {viewDialog.user.email || 'Not provided'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#52796F', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person />
                      Status
                    </Typography>
                    <Chip
                      label={viewDialog.user.isActive === true ? "Active" : "Inactive"}
                      size="small"
                      sx={{
                        background: viewDialog.user.isActive === true 
                          ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(76, 175, 80, 0.1))'
                          : 'linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(244, 67, 54, 0.1))',
                        color: viewDialog.user.isActive === true ? '#4caf50' : '#f44336',
                        fontWeight: 600,
                        border: `1px solid ${viewDialog.user.isActive === true ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`,
                        borderRadius: 2,
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#52796F', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AdminPanelSettings />
                      Roles
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {viewDialog.user.roles?.map((role) => (
                        <Chip
                          key={role._id}
                          label={role.label}
                          size="small"
                          sx={{
                            background: 'linear-gradient(135deg, rgba(82, 121, 111, 0.1), rgba(47, 62, 70, 0.05))',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(82, 121, 111, 0.2)',
                            color: '#52796F',
                            fontWeight: 500,
                            borderRadius: 2,
                          }}
                        />
                      )) || <Typography variant="body2" color="textSecondary">No roles assigned</Typography>}
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#52796F', fontWeight: 600, mb: 1 }}>
                      Member Since
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#2F3E46', fontWeight: 500 }}>
                      {new Date(viewDialog.user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'long'
                      })}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setViewDialog({ open: false, user: null })}
            variant="contained"
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(135deg, #52796F, rgba(82, 121, 111, 0.8))',
              color: 'white',
              fontWeight: 600,
              px: 4,
              boxShadow: '0 4px 12px rgba(82, 121, 111, 0.4)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(82, 121, 111, 0.6)',
                transform: 'translateY(-1px)',
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <CustomConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, userId: null })}
        onConfirm={() => handleDeleteUser(confirmDialog.userId)}
        title="Delete User"
        message={`Are you sure you want to delete this user? This action cannot be undone and will permanently remove all user data including profile images.`}
      />

      {/* Alert Dialog */}
      <CustomAlertDialog
        open={alertDialog.open}
        onClose={() => setAlertDialog({ open: false, title: '', message: '', type: 'success' })}
        title={alertDialog.title}
        message={alertDialog.message}
        type={alertDialog.type}
      />
    </Box>
  );
}
