"use client";
import useAuthAxios from "@/hooks/useAuthAxios";
import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
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
  ShoppingCart,
  Inventory,
  AttachMoney,
  Warning,
  CheckCircleOutline,
  Cancel,
  CheckCircle,
  Public,
  Business
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

// Brand Card Component
const BrandCard = ({ brand, delay = 0, onDelete, onEdit, onView }) => {
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
        {/* Brand Logo */}
        <Box
          sx={{
            position: 'relative',
            height: 180,
            background: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(15px)',
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
              background: 'linear-gradient(135deg, rgba(82, 121, 111, 0.08), rgba(47, 62, 70, 0.04))',
              opacity: 0.6
            }
          }}
        >
          {brand.brandLogo ? (
            <CardMedia
              component="img"
              height="180"
              image={`${process.env.NEXT_PUBLIC_APP_CDN_URL}/HappyPaw/Brands/${brand._id}/${brand.brandLogo}`}
              alt={brand.brandName}
              sx={{
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
                position: 'relative',
                zIndex: 1,
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            />
          ) : (
            <Avatar
              sx={{
                width: 80,
                height: 80,
                background: 'linear-gradient(135deg, rgba(82, 121, 111, 0.8), rgba(47, 62, 70, 0.9))',
                fontSize: '2rem',
                fontWeight: 700,
                color: 'white',
                position: 'relative',
                zIndex: 1,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
              }}
            >
              {brand.brandName?.charAt(0) || 'B'}
            </Avatar>
          )}
          
          {/* Status Badge */}
          <Chip
            label={brand.active === true ? 'Active' : 'Inactive'}
            icon={brand.active === true ? <CheckCircle /> : <Cancel />}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 2,
              background: brand.active === true 
                ? 'rgba(76, 175, 80, 0.95)' 
                : 'rgba(244, 67, 54, 0.95)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.75rem',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              '& .MuiSvgIcon-root': {
                fontSize: '1rem'
              }
            }}
          />
        </Box>

        <CardContent sx={{ p: 3, height: 'calc(100% - 180px)', display: 'flex', flexDirection: 'column' }}>
          {/* Brand Name */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#2F3E46',
              mb: 1,
              fontSize: '1.1rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)'
            }}
          >
            {brand.brandName || 'Unnamed Brand'}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              color: '#2F3E46',
              mb: 2,
              flexGrow: 1,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.5,
              opacity: 0.8,
              fontWeight: 500
            }}
          >
            {brand.description || 'No description available'}
          </Typography>

          <Divider sx={{ my: 2, borderColor: 'rgba(47, 62, 70, 0.15)', opacity: 0.8 }} />

          {/* Website Information */}
          <Box sx={{ space: '8px' }}>
            {brand.websiteURL && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Public sx={{ fontSize: '1rem', color: '#52796F', mr: 1 }} />
                <Typography
                  variant="caption"
                  component="a"
                  href={brand.websiteURL.startsWith('http') ? brand.websiteURL : `https://${brand.websiteURL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: '#2F3E46',
                    fontSize: '0.75rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                    textDecoration: 'none',
                    opacity: 0.7,
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline',
                      color: '#52796F',
                      opacity: 1
                    }
                  }}
                >
                  {brand.websiteURL}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => onView(brand)}
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
              onClick={() => onEdit(brand._id)}
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
              onClick={() => onDelete(brand._id)}
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
        </CardContent>
      </Card>
    </FloatingCard>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon, color, delay = 0 }) => {
  // Define light glass colors for each card type
  const getCardColors = (color) => {
    switch (color) {
      case '#2196f3': // Total Brands - Light Blue
        return {
          background: 'rgba(33, 150, 243, 0.12)',
          border: 'rgba(33, 150, 243, 0.25)',
          shadow: 'rgba(33, 150, 243, 0.15)'
        };
      case '#4caf50': // Active Brands - Light Green
        return {
          background: 'rgba(76, 175, 80, 0.12)',
          border: 'rgba(76, 175, 80, 0.25)',
          shadow: 'rgba(76, 175, 80, 0.15)'
        };
      case '#f44336': // Inactive Brands - Light Red
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

export default function Brands() {
  const authAxios = useAuthAxios();
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewDialog, setViewDialog] = useState({ open: false, brand: null });

  // Dialog states
  const [confirmDialog, setConfirmDialog] = useState({ open: false, brandId: null });
  const [alertDialog, setAlertDialog] = useState({ open: false, title: '', message: '', type: 'success' });

  // Derived states for statistics
  const activeBrands = brands.filter(brand => brand.active === true);
  const inactiveBrands = brands.filter(brand => brand.active === false);

  const showAlert = (title, message, type = 'success') => {
    setAlertDialog({ open: true, title, message, type });
  };

  const showConfirm = (brandId) => {
    setConfirmDialog({ open: true, brandId });
  };

  useEffect(() => {
    brand_list_initial_data();
  }, []);

  useEffect(() => {
    filterBrands();
  }, [brands, searchTerm]);

  const brand_list_initial_data = async () => {
    setLoading(true);
    const response = await authAxios({
      method: "GET",
      url: process.env.NEXT_PUBLIC_API_URL + "/brands/brand_list",
    });
    if (!response) return;
    console.log("Response:", response.data);
    if (response) {
      setBrands(response.data.brands);
    }
    setLoading(false);
  };

  const filterBrands = () => {
    let filtered = brands;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(brand =>
        (brand.brandName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (brand.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (brand.websiteURL || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBrands(filtered);
  };

  const handleDeleteBrand = async (brandId) => {
    const response = await authAxios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_API_URL}/brands/brand_delete`,
      data: {
        brandId: brandId
      }
    });
    
    if (!response) return;
    
    if (response.data.status === "Success") {
      setBrands(prevBrands => prevBrands.filter(brand => brand._id !== brandId));
      setFilteredBrands(prevFiltered => prevFiltered.filter(brand => brand._id !== brandId));
      showAlert("Success", "Brand deleted successfully", "success");
    } else {
      showAlert("Error", "Failed to delete brand", "error");
    }
  };

  const handleEditBrand = (brandId) => {
    window.location.href = `/Brands/edit/${brandId}`;
  };

  const handleViewBrand = (brand) => {
    setViewDialog({ open: true, brand });
  };

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          background: `
            radial-gradient(circle at 20% 50%, rgba(82, 121, 111, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(47, 62, 70, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(255, 214, 165, 0.2) 0%, transparent 50%),
            linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)
          `,
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
                    Brands Directory
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
                    Manage your brand portfolio and partnerships with enterprise-grade tools
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
                          placeholder="Search brands by name, description, or website..."
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
                          onClick={() => window.location.href = '/Brands/add'}
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
                          Add Brand
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
                title="Total Brands"
                value={brands.length}
                icon={<ShoppingCart />}
                color="#2196f3"
                delay={0}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatsCard
                title="Active Brands"
                value={activeBrands.length}
                icon={<CheckCircle />}
                color="#4caf50"
                delay={100}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatsCard
                title="Inactive Brands"
                value={inactiveBrands.length}
                icon={<Cancel />}
                color="#f44336"
                delay={200}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatsCard
                title="Search Results"
                value={filteredBrands.length}
                icon={<FilterList />}
                color="#ff9800"
                delay={300}
              />
            </Grid>
          </Grid>

          {/* Brands Grid */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <Typography variant="h6" sx={{ color: '#52796F' }}>
                Loading brands...
              </Typography>
            </Box>
          ) : filteredBrands.length === 0 ? (
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
                  <ShoppingCart sx={{ fontSize: 60, color: '#52796F', opacity: 0.7 }} />
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
                  {searchTerm ? 'No brands found' : 'No brands available'}
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
                    : 'Start by adding your first brand to the system'
                  }
                </Typography>
              </Box>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {filteredBrands.map((brand, index) => (
                <Grid key={brand._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <BrandCard 
                    brand={brand} 
                    delay={index * 100} 
                    onDelete={showConfirm}
                    onEdit={handleEditBrand}
                    onView={handleViewBrand}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Brand Details Dialog */}
      <Dialog 
        open={viewDialog.open} 
        onClose={() => setViewDialog({ open: false, brand: null })}
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
        <DialogTitle sx={{ color: '#2F3E46', fontWeight: 600, textShadow: '0 1px 2px rgba(255, 255, 255, 0.6)' }}>Brand Details</DialogTitle>
        <DialogContent>
          {viewDialog.brand && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                {viewDialog.brand.brandLogo ? (
                  <Box
                    component="img"
                    src={`${process.env.NEXT_PUBLIC_APP_CDN_URL}/HappyPaw/Brands/${viewDialog.brand._id}/${viewDialog.brand.brandLogo}`}
                    alt={viewDialog.brand.brandName}
                    sx={{
                      width: '100%',
                      height: 300,
                      objectFit: 'cover',
                      borderRadius: 3,
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: 300,
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(15px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 3,
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    <ShoppingCart sx={{ fontSize: 80, color: '#52796F', opacity: 0.7 }} />
                  </Box>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h5" gutterBottom sx={{ color: '#2F3E46', fontWeight: 600, textShadow: '0 1px 2px rgba(255, 255, 255, 0.6)' }}>
                  {viewDialog.brand.brandName}
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ color: '#2F3E46', mb: 3, opacity: 0.9, fontWeight: 500 }}>
                  {viewDialog.brand.description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ color: '#2F3E46', mb: 1, fontWeight: 500 }}>
                    <strong>Website:</strong>{' '}
                    {viewDialog.brand.websiteURL ? (
                      <Typography
                        component="a"
                        href={viewDialog.brand.websiteURL.startsWith('http') ? viewDialog.brand.websiteURL : `https://${viewDialog.brand.websiteURL}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: '#52796F',
                          textDecoration: 'none',
                          fontWeight: 500,
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        {viewDialog.brand.websiteURL}
                      </Typography>
                    ) : (
                      'N/A'
                    )}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#2F3E46', fontWeight: 500 }}>
                    <strong>Status:</strong>{' '}
                    <Chip
                      label={viewDialog.brand.active === true ? 'Active' : 'Inactive'}
                      color={viewDialog.brand.active === true ? 'success' : 'default'}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setViewDialog({ open: false, brand: null })}
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
              setViewDialog({ open: false, brand: null });
              handleEditBrand(viewDialog.brand._id);
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
            Edit Brand
          </Button>
        </DialogActions>
      </Dialog>

      {/* Custom Dialogs */}
      <CustomConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, brandId: null })}
        onConfirm={() => handleDeleteBrand(confirmDialog.brandId)}
        title="Delete Brand"
        message="Are you sure you want to delete this brand? This action cannot be undone."
      />

      <CustomAlertDialog
        open={alertDialog.open}
        onClose={() => setAlertDialog({ open: false, title: '', message: '', type: 'success' })}
        title={alertDialog.title}
        message={alertDialog.message}
        type={alertDialog.type}
      />
    </>
  );
}