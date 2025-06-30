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
  Divider,
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
  FilterList,
  Add,
  People,
  Person,
  Phone,
  Email,
  Home,
  Notes,
  CheckCircle,
  Cancel,
  LocationOn,
  Warning,
  CheckCircleOutline
} from "@mui/icons-material";

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

// Customer Card Component
const CustomerCard = ({ customer, delay = 0, onDelete, onEdit, onView }) => {
  // Get color theme for this customer
  const getCustomerColor = () => {
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
    const colorIndex = customer._id ? 
      parseInt(customer._id.slice(-1), 16) % 4 : 0;
    return colors[colorIndex];
  };

  const customerColor = getCustomerColor();

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
        {/* Customer Name Header - COLORED SECTION */}
        <Box
          sx={{
            position: 'relative',
            height: 180,
            background: `
              linear-gradient(135deg, 
                ${customerColor.background} 0%, 
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
              background: `radial-gradient(circle at center, ${customerColor.shadow}, transparent 70%)`,
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
            {customer.customerLogo ? (
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
                  src={process.env.NEXT_PUBLIC_APP_CDN_URL + '/HappyPaw/Customers/' + customer._id + '/' + customer.customerLogo}
                  alt={`${customer.customerName} logo`}
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
                  {customer.customerName?.charAt(0) || 'C'}
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
                {customer.customerName?.charAt(0) || 'C'}
              </Avatar>
            )}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#2F3E46',
                fontSize: '1.5rem',
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(255, 255, 255, 0.8)',
                lineHeight: 1.2,
                background: 'linear-gradient(135deg, #1a1a1a, #2F3E46)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {customer.customerName || 'Unnamed Customer'}
            </Typography>
          </Box>
          
          {/* Decorative corner elements */}
          <Box
            sx={{
              position: 'absolute',
              top: 15,
              right: 15,
              width: 40,
              height: 40,
              background: `radial-gradient(circle, ${customerColor.primary}20, transparent 70%)`,
              borderRadius: '50%',
              opacity: 0.6
            }}
          />
        </Box>

        {/* Card Content - NEUTRAL SECTION */}
        <CardContent sx={{ p: 3, height: 'calc(100% - 180px)', display: 'flex', flexDirection: 'column' }}>
          {/* Contact Information */}
          <Box sx={{ flexGrow: 1 }}>
            {customer.phoneNumber && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Phone sx={{ fontSize: '1rem', color: '#52796F', mr: 1 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: '#2F3E46',
                    fontWeight: 500,
                    fontSize: '0.875rem'
                  }}
                >
                  {customer.phoneNumber}
                </Typography>
              </Box>
            )}
            
            {customer.email && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Email sx={{ fontSize: '1rem', color: '#52796F', mr: 1 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: '#2F3E46',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    wordBreak: 'break-word'
                  }}
                >
                  {customer.email}
                </Typography>
              </Box>
            )}
            
            {customer.address && (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                <LocationOn sx={{ fontSize: '1rem', color: '#52796F', mr: 1, mt: 0.2 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: '#2F3E46',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {customer.address}
                </Typography>
              </Box>
            )}
            
            {customer.notes && (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                <Notes sx={{ fontSize: '1rem', color: '#52796F', mr: 1, mt: 0.2 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: '#2F3E46',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    opacity: 0.8,
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {customer.notes}
                </Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 2, borderColor: 'rgba(47, 62, 70, 0.15)', opacity: 0.8 }} />
          
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button
              variant="outlined"
              onClick={() => onView(customer)}
              sx={{
                flex: 1,
                borderRadius: 3,
                border: '1px solid rgba(82, 121, 111, 0.4)',
                color: '#52796F',
                fontWeight: 600,
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                fontSize: '0.8rem',
                boxShadow: '0 2px 8px rgba(82, 121, 111, 0.1)',
                '&:hover': {
                  border: '1px solid rgba(82, 121, 111, 0.6)',
                  background: 'rgba(255, 255, 255, 0.6)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(82, 121, 111, 0.2)'
                }
              }}
            >
              View Details
            </Button>
            <Button
              variant="outlined"
              onClick={() => onEdit(customer._id)}
              sx={{
                minWidth: '44px',
                width: '44px',
                height: '36px',
                borderRadius: 3,
                border: '1px solid rgba(33, 150, 243, 0.4)',
                color: '#2196f3',
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(33, 150, 243, 0.1)',
                '&:hover': {
                  border: '1px solid rgba(33, 150, 243, 0.6)',
                  background: 'rgba(255, 255, 255, 0.6)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)'
                }
              }}
            >
              <Edit sx={{ fontSize: '1.1rem' }} />
            </Button>
            <Button
              variant="outlined"
              onClick={() => onDelete(customer._id)}
              sx={{
                minWidth: '44px',
                width: '44px',
                height: '36px',
                borderRadius: 3,
                border: '1px solid rgba(244, 67, 54, 0.4)',
                color: '#f44336',
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(244, 67, 54, 0.1)',
                '&:hover': {
                  border: '1px solid rgba(244, 67, 54, 0.6)',
                  background: 'rgba(255, 255, 255, 0.6)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(244, 67, 54, 0.2)'
                }
              }}
            >
              <Delete sx={{ fontSize: '1.1rem' }} />
            </Button>
          </Box>
          
          {/* Customer ID */}
          <Typography
            variant="caption"
            sx={{
              color: '#52796F',
              fontWeight: 500,
              textAlign: 'center',
              opacity: 0.7,
              fontSize: '0.75rem',
              letterSpacing: '0.5px'
            }}
          >
            ID: {customer._id?.slice(-8) || 'N/A'}
          </Typography>
        </CardContent>
      </Card>
    </FloatingCard>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon, color, delay = 0 }) => {
  const getCardColors = (color) => {
    switch (color) {
      case '#2196f3': // Total Customers - Light Blue
        return {
          background: 'rgba(33, 150, 243, 0.12)',
          border: 'rgba(33, 150, 243, 0.25)',
          shadow: 'rgba(33, 150, 243, 0.15)'
        };
      case '#4caf50': // Active Customers - Light Green
        return {
          background: 'rgba(76, 175, 80, 0.12)',
          border: 'rgba(76, 175, 80, 0.25)',
          shadow: 'rgba(76, 175, 80, 0.15)'
        };
      case '#f44336': // With Email - Light Red
        return {
          background: 'rgba(244, 67, 54, 0.12)',
          border: 'rgba(244, 67, 54, 0.25)',
          shadow: 'rgba(244, 67, 54, 0.15)'
        };
      case '#ff9800': // Search Results - Light Orange
        return {
          background: 'rgba(255, 152, 0, 0.12)',
          border: 'rgba(255, 152, 0, 0.25)',
          shadow: 'rgba(255, 152, 0, 0.15)'
        };
      default:
        return {
          background: 'rgba(255, 255, 255, 0.25)',
          border: 'rgba(255, 255, 255, 0.2)',
          shadow: 'rgba(0, 0, 0, 0.1)'
        };
    }
  };

  const cardColors = getCardColors(color);

  return (
    <Fade in timeout={800 + delay}>
      <Card
        sx={{
          background: `linear-gradient(135deg, rgba(255, 255, 255, 0.6), ${cardColors.background})`,
          backdropFilter: 'blur(25px)',
          border: `1px solid ${cardColors.border}`,
          borderRadius: 4,
          boxShadow: `0 15px 45px ${cardColors.shadow}, inset 0 1px 0 rgba(255, 255, 255, 0.4)`,
          height: '100%',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at top right, ${cardColors.background}, transparent 70%)`,
            opacity: 0.6,
            pointerEvents: 'none'
          },
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 20px 55px ${cardColors.shadow}, inset 0 1px 0 rgba(255, 255, 255, 0.6)`,
            background: `linear-gradient(135deg, rgba(255, 255, 255, 0.7), ${cardColors.background})`,
            border: `1px solid ${cardColors.border}`,
            '&::before': {
              opacity: 0.8
            }
          }
        }}
      >
        <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                background: `linear-gradient(135deg, ${color}, rgba(255, 255, 255, 0.3))`,
                color: 'white',
                mr: 2,
                width: 48,
                height: 48,
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: `0 8px 25px ${cardColors.shadow}, inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
                fontSize: '1.2rem',
                transition: 'all 0.3s ease'
              }}
            >
              {icon}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#2F3E46',
                  fontSize: '1.8rem',
                  mb: 0.5,
                  textShadow: '0 2px 4px rgba(255, 255, 255, 0.8)'
                }}
              >
                {value}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#2F3E46',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  opacity: 0.85,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  textShadow: '0 1px 2px rgba(255, 255, 255, 0.6)'
                }}
              >
                {title}
              </Typography>
            </Box>
          </Box>
          
          {/* Subtle decorative element */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 32,
              height: 32,
              background: `radial-gradient(circle, ${cardColors.background}, transparent)`,
              borderRadius: '50%',
              opacity: 0.5
            }}
          />
        </CardContent>
      </Card>
    </Fade>
  );
};

// Custom Themed Dialog Components
const ThemedDialog = ({ open, onClose, title, content, actions, icon, iconColor = '#52796F' }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          pb: 2,
          color: '#2F3E46',
          fontWeight: 600,
          textShadow: '0 1px 2px rgba(255, 255, 255, 0.6)'
        }}
      >
        {icon && (
          <Avatar
            sx={{
              background: `linear-gradient(135deg, ${iconColor}, rgba(82, 121, 111, 0.8))`,
              color: 'white',
              width: 48,
              height: 48,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)'
            }}
          >
            {icon}
          </Avatar>
        )}
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2F3E46' }}>
          {title}
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ pb: 2 }}>
        <Typography
          variant="body1"
          sx={{
            color: '#2F3E46',
            lineHeight: 1.6,
            fontSize: '1rem',
            opacity: 0.9,
            fontWeight: 500
          }}
        >
          {content}
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 2, gap: 1 }}>
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
          borderRadius: 3,
          border: '1px solid rgba(82, 121, 111, 0.3)',
          color: '#52796F',
          fontWeight: 600,
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          px: 3,
          '&:hover': {
            border: '1px solid rgba(82, 121, 111, 0.5)',
            background: 'rgba(255, 255, 255, 0.3)',
          }
        }}
      >
        Cancel
      </Button>
      <Button
        onClick={handleConfirm}
        variant="contained"
        sx={{
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f44336, #d32f2f)',
          color: 'white',
          fontWeight: 600,
          px: 3,
          boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          '&:hover': {
            background: 'linear-gradient(135deg, #d32f2f, #b71c1c)',
            boxShadow: '0 6px 16px rgba(244, 67, 54, 0.4)',
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
        return { icon: <CheckCircleOutline />, color: '#4caf50' };
      case 'error':
        return { icon: <Cancel />, color: '#f44336' };
      default:
        return { icon: <CheckCircleOutline />, color: '#4caf50' };
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

export default function Customers() {
  const authAxios = useAuthAxios();
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewDialog, setViewDialog] = useState({ open: false, customer: null });

  // Dialog states
  const [confirmDialog, setConfirmDialog] = useState({ open: false, customerId: null });
  const [alertDialog, setAlertDialog] = useState({ open: false, title: '', message: '', type: 'success' });

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await authAxios({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_API_URL}/customers/customer_list`,
      });
      if (response) {
        setCustomers(response.data.customers || []);
      }
      setIsLoading(false);
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      customer.customerName?.toLowerCase().includes(search) ||
      customer.email?.toLowerCase().includes(search) ||
      customer.phoneNumber?.toLowerCase().includes(search) ||
      customer.address?.toLowerCase().includes(search) ||
      customer.notes?.toLowerCase().includes(search)
    );
  });

  const customersWithEmail = customers.filter(customer => customer.email).length;
  const customersWithPhone = customers.filter(customer => customer.phoneNumber).length;

  const showAlert = (title, message, type = 'success') => {
    setAlertDialog({ open: true, title, message, type });
  };

  const showConfirm = (customerId) => {
    setConfirmDialog({ open: true, customerId });
  };

  const handleDeleteCustomer = async (customerId) => {
    const response = await authAxios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_API_URL}/customers/customer_delete`,
      data: {
        customerId: customerId
      }
    });
    
    if (!response) return;
    
    if (response.data.status === "Success") {
      setCustomers(prevCustomers => prevCustomers.filter(customer => customer._id !== customerId));
      showAlert("Success", "Customer deleted successfully", "success");
    } else {
      showAlert("Error", "Failed to delete customer", "error");
    }
  };

  const handleEditCustomer = (customerId) => {
    router.push(`/Customers/edit/${customerId}`);
  };

  const handleViewCustomer = (customer) => {
    setViewDialog({ open: true, customer });
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
                  Customers Directory
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
                  Manage your customer relationships with comprehensive contact management
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
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                      <TextField
                        placeholder="Search customers by name, email, phone, or address..."
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
                        onClick={() => router.push('/Customers/add')}
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
                        Add Customer
                      </Button>
                    </Box>
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
              title="Total Customers"
              value={customers.length}
              icon={<People />}
              color="#2196f3"
              delay={0}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="With Email"
              value={customersWithEmail}
              icon={<Email />}
              color="#4caf50"
              delay={100}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="With Phone"
              value={customersWithPhone}
              icon={<Phone />}
              color="#f44336"
              delay={200}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Search Results"
              value={filteredCustomers.length}
              icon={<FilterList />}
              color="#ff9800"
              delay={300}
            />
          </Grid>
        </Grid>

        {/* Customers Grid */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: '#52796F' }}>
              Loading customers...
            </Typography>
          </Box>
        ) : filteredCustomers.length === 0 ? (
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
                {searchTerm ? 'No customers found' : 'No customers available'}
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
                {searchTerm 
                  ? 'Try adjusting your search terms or filters'
                  : 'Start by adding your first customer to the system'
                }
              </Typography>
            </Box>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredCustomers.map((customer, index) => (
              <Grid key={customer._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <CustomerCard 
                  customer={customer} 
                  delay={index * 100} 
                  onDelete={showConfirm}
                  onEdit={handleEditCustomer}
                  onView={handleViewCustomer}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Customer Details Dialog */}
      <Dialog 
        open={viewDialog.open} 
        onClose={() => setViewDialog({ open: false, customer: null })}
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
          Customer Details
        </DialogTitle>
        <DialogContent>
          {viewDialog.customer && (
            <Box sx={{ pt: 2 }}>
              {/* Customer Logo and Name Section */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 4,
                p: 4,
                background: `
                  linear-gradient(135deg, 
                    ${(() => {
                      const colors = [
                        'rgba(33, 150, 243, 0.12)', // Blue - Total Customers
                        'rgba(76, 175, 80, 0.12)',  // Green - With Email
                        'rgba(244, 67, 54, 0.12)',  // Red - With Phone
                        'rgba(255, 152, 0, 0.12)'   // Orange - Search Results
                      ];
                      const colorIndex = viewDialog.customer._id ? 
                        parseInt(viewDialog.customer._id.slice(-1), 16) % 4 : 0;
                      return colors[colorIndex];
                    })()}, 
                    rgba(255, 255, 255, 0.4)
                  ),
                  rgba(255, 255, 255, 0.4)
                `,
                backdropFilter: 'blur(25px)',
                borderRadius: 4,
                border: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `
                    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), transparent 60%)
                  `,
                  borderRadius: 'inherit',
                  pointerEvents: 'none'
                },
                '&:hover': {
                  transform: 'scale(1.05) rotate(2deg)',
                  boxShadow: `
                    0 12px 40px ${(() => {
                      const colors = [
                        'rgba(33, 150, 243, 0.4)', // Blue
                        'rgba(76, 175, 80, 0.4)',  // Green
                        'rgba(244, 67, 54, 0.4)',  // Red
                        'rgba(255, 152, 0, 0.4)'   // Orange
                      ];
                      const colorIndex = viewDialog.customer._id ? 
                        parseInt(viewDialog.customer._id.slice(-1), 16) % 4 : 0;
                      return colors[colorIndex];
                    })()},
                    0 8px 24px ${(() => {
                      const colors = [
                        'rgba(33, 150, 243, 0.3)', // Blue
                        'rgba(76, 175, 80, 0.3)',  // Green
                        'rgba(244, 67, 54, 0.3)',  // Red
                        'rgba(255, 152, 0, 0.3)'   // Orange
                      ];
                      const colorIndex = viewDialog.customer._id ? 
                        parseInt(viewDialog.customer._id.slice(-1), 16) % 4 : 0;
                      return colors[colorIndex];
                    })()},
                    inset 0 1px 0 rgba(255, 255, 255, 0.4)
                  `
                }
              }}>
                {viewDialog.customer.customerLogo ? (
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
                      src={process.env.NEXT_PUBLIC_APP_CDN_URL + '/HappyPaw/Customers/' + viewDialog.customer._id + '/' + viewDialog.customer.customerLogo}
                      alt={`${viewDialog.customer.customerName} logo`}
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
                      {viewDialog.customer.customerName?.charAt(0) || 'C'}
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
                    {viewDialog.customer.customerName?.charAt(0) || 'C'}
                  </Avatar>
                )}
                <Box sx={{ position: 'relative', zIndex: 1 }}>
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
                {viewDialog.customer.customerName}
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
                    Customer ID: {viewDialog.customer._id?.slice(-8) || 'N/A'}
                  </Typography>
                </Box>
                
                {/* Decorative floating elements */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    width: 60,
                    height: 60,
                    background: `radial-gradient(circle, ${(() => {
                      const colors = [
                        'rgba(33, 150, 243, 0.2)', // Blue
                        'rgba(76, 175, 80, 0.2)',  // Green
                        'rgba(244, 67, 54, 0.2)',  // Red
                        'rgba(255, 152, 0, 0.2)'   // Orange
                      ];
                      const colorIndex = viewDialog.customer._id ? 
                        parseInt(viewDialog.customer._id.slice(-1), 16) % 4 : 0;
                      return colors[colorIndex];
                    })()}, transparent 70%)`,
                    borderRadius: '50%',
                    opacity: 0.6,
                    animation: 'float 3s ease-in-out infinite',
                    '@keyframes float': {
                      '0%, 100%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-10px)' }
                    }
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 15,
                    left: 30,
                    width: 40,
                    height: 40,
                    background: `radial-gradient(circle, ${(() => {
                      const colors = [
                        'rgba(33, 150, 243, 0.15)', // Blue
                        'rgba(76, 175, 80, 0.15)',  // Green
                        'rgba(244, 67, 54, 0.15)',  // Red
                        'rgba(255, 152, 0, 0.15)'   // Orange
                      ];
                      const colorIndex = viewDialog.customer._id ? 
                        parseInt(viewDialog.customer._id.slice(-1), 16) % 4 : 0;
                      return colors[colorIndex];
                    })()}, transparent 70%)`,
                    borderRadius: '50%',
                    opacity: 0.5,
                    animation: 'float 4s ease-in-out infinite reverse',
                  }}
                />
              </Box>
              
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#52796F', fontWeight: 600, mb: 1 }}>
                      Phone Number
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2F3E46' }}>
                      {viewDialog.customer.phoneNumber || 'Not provided'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#52796F', fontWeight: 600, mb: 1 }}>
                      Email
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2F3E46' }}>
                      {viewDialog.customer.email || 'Not provided'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#52796F', fontWeight: 600, mb: 1 }}>
                      Address
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2F3E46' }}>
                      {viewDialog.customer.address || 'Not provided'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#52796F', fontWeight: 600, mb: 1 }}>
                      Notes
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2F3E46' }}>
                      {viewDialog.customer.notes || 'No notes available'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setViewDialog({ open: false, customer: null })}
            variant="outlined"
            sx={{
              borderRadius: 3,
              border: '1px solid rgba(82, 121, 111, 0.3)',
              color: '#52796F',
              fontWeight: 600,
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                border: '1px solid rgba(82, 121, 111, 0.5)',
                background: 'rgba(255, 255, 255, 0.3)',
              }
            }}
          >
            Close
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Edit />}
            onClick={() => {
              setViewDialog({ open: false, customer: null });
              handleEditCustomer(viewDialog.customer._id);
            }}
            sx={{
              borderRadius: 3,
              background: 'linear-gradient(135deg, #52796F, rgba(82, 121, 111, 0.8))',
              color: 'white',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(82, 121, 111, 0.3)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2F3E46, #52796F)',
                boxShadow: '0 6px 16px rgba(82, 121, 111, 0.4)',
              }
            }}
          >
            Edit Customer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Custom Dialogs */}
      <CustomConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, customerId: null })}
        onConfirm={() => handleDeleteCustomer(confirmDialog.customerId)}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
      />

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