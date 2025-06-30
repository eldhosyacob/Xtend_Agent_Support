"use client";
import useAuthAxios from "@/hooks/useAuthAxios";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Stack,
  Tooltip,
  Alert,
  Snackbar,
  Fade,
  Container,
  Divider
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
  TrendingUp,
  CheckCircle,
  Cancel,
  QrCode,
  LocalOffer,
  Label,
  Warning
} from "@mui/icons-material";

export default function Products() {
  const authAxios = useAuthAxios();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, product: null });
  const [viewDialog, setViewDialog] = useState({ open: false, product: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Helper function to construct S3 CDN URL
  const getS3ImageUrl = (productId, filename) => {
    if (!productId || !filename) return null;
    const cdnUrl = process.env.NEXT_PUBLIC_APP_CDN_URL;
    if (!cdnUrl) {
      console.warn('NEXT_PUBLIC_APP_CDN_URL not configured');
      return null;
    }
    return `${cdnUrl}/HappyPaw/Products/${productId}/${filename}`;
  };

  useEffect(() => {
    product_list_initial_data();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, statusFilter, brandFilter]);

  const product_list_initial_data = async () => {
    setLoading(true);
    const response = await authAxios({
      method: "GET",
      url: process.env.NEXT_PUBLIC_API_URL + "/products/product_list",
    });
    if (response) {
      setProducts(response.data.products);
    }
    setLoading(false);
  };

  const filterProducts = () => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        (product.productName || product.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.barcode || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.SKU || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(product => product.status === statusFilter);
    }

    // Brand filter
    if (brandFilter !== "all") {
      filtered = filtered.filter(product => 
        (product.brand || "").toLowerCase() === brandFilter.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleDeleteProduct = async (productId) => {
    setDeleteDialog({ open: true, product: { _id: productId } });
  };

  const confirmDeleteProduct = async () => {
    if (!deleteDialog.product) return;
    
    const response = await authAxios({
      method: "POST",
      url: process.env.NEXT_PUBLIC_API_URL + `/products/product_delete`,
      data: {
        productId: deleteDialog.product._id
      }
    });
    if(!response) return;
    
    if (response.data.status === "Success") {
      setProducts(products.filter(p => p._id !== deleteDialog.product._id));
      setSnackbar({ open: true, message: "Product deleted successfully", severity: "success" });
    }
    setDeleteDialog({ open: false, product: null });
  };

  const handleEditProduct = (productId) => {
    window.location.href = `/Products/edit/${productId}`;
  };

  const getUniqueValues = (field) => {
    return [...new Set(products.map(product => product[field]).filter(Boolean))];
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price || 0);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Floating animation wrapper
  const FloatingCard = ({ children, delay = 0 }) => {
    return (
      <Fade in timeout={800 + delay}>
        <Box>
          {children}
        </Box>
      </Fade>
    );
  };

  const ProductCard = ({ product, delay = 0, onDelete, onEdit, onView }) => (
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
        {/* Product Image Section */}
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
          {product.productImages && product.productImages.length > 0 ? (
            <CardMedia
              component="img"
              height="180"
              image={getS3ImageUrl(product._id, product.productImages[0])}
              alt={product.productName || product.name}
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
              {(product.productName || product.name)?.charAt(0) || 'P'}
            </Avatar>
          )}
        </Box>

        <CardContent sx={{ p: 3, height: 'calc(100% - 180px)', display: 'flex', flexDirection: 'column' }}>
          {/* Product Name */}
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
            {product.productName || product.name}
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
            {product.description || 'No description available'}
          </Typography>

          <Divider sx={{ my: 2, borderColor: 'rgba(47, 62, 70, 0.15)', opacity: 0.8 }} />

          {/* Product Information */}
          <Box sx={{ space: '8px' }}>
            {/* Price Information */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AttachMoney sx={{ fontSize: '1rem', color: '#52796F', mr: 1 }} />
              <Typography
                variant="caption"
                sx={{
                  color: '#2F3E46',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                Price: {formatPrice(product.sellingPrice)}
                {product.MRP && product.MRP !== product.sellingPrice && (
                  <span style={{ textDecoration: 'line-through', marginLeft: '8px', opacity: 0.6 }}>
                    {formatPrice(product.MRP)}
                  </span>
                )}
              </Typography>
            </Box>

            {/* Stock Information */}
            {product.stockQuantity !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Inventory sx={{ fontSize: '1rem', color: '#52796F', mr: 1 }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: '#2F3E46',
                    fontSize: '0.75rem',
                    opacity: 0.7,
                    fontWeight: 500
                  }}
                >
                  Stock: {product.stockQuantity} units
                </Typography>
              </Box>
            )}

            {/* Brand Information */}
            {product.brand && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocalOffer sx={{ fontSize: '1rem', color: '#52796F', mr: 1 }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: '#2F3E46',
                    fontSize: '0.75rem',
                    opacity: 0.7,
                    fontWeight: 500
                  }}
                >
                  Brand: {product.brand}
                </Typography>
              </Box>
            )}

            {/* SKU Information */}
            {product.SKU && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <QrCode sx={{ fontSize: '1rem', color: '#52796F', mr: 1 }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: '#2F3E46',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    opacity: 0.7,
                    fontWeight: 500
                  }}
                >
                  SKU: {product.SKU}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => onView && onView(product)}
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
              onClick={() => onEdit && onEdit(product._id)}
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
              onClick={() => onDelete && onDelete(product._id)}
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

  const StatCard = ({ icon, title, value, color, gradient }) => (
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
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ 
            background: 'linear-gradient(135deg, rgba(82, 121, 111, 0.8), rgba(47, 62, 70, 0.9))',
            mr: 2, 
            width: 56, 
            height: 56,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
          }}>
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              color: '#2F3E46',
              textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)'
            }}>
              {value}
            </Typography>
            <Typography variant="body1" sx={{ 
              color: '#52796F', 
              fontWeight: 500,
              opacity: 0.8
            }}>
              {title}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

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

  return (
    <Box sx={{ 
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
    }}>
      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Modern Header */}
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
                  Products Management
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
                  Manage your product inventory with enterprise-grade tools
                </Typography>
              </Box>
            </Box>
          </Box>
        </Fade>

        {/* Action Bar */}
        <Card sx={{ 
          mb: 4, 
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
        }}>
          <CardContent sx={{ p: { xs: 2, md: 3 }, position: 'relative', zIndex: 1 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: '#52796F' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
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
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                <FormControl fullWidth>
                  <InputLabel sx={{ '&.Mui-focused': { color: '#52796F' } }}>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{ 
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
                    }}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                <FormControl fullWidth>
                  <InputLabel sx={{ '&.Mui-focused': { color: '#52796F' } }}>Brand</InputLabel>
                  <Select
                    value={brandFilter}
                    label="Brand"
                    onChange={(e) => setBrandFilter(e.target.value)}
                    sx={{ 
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
                    }}
                  >
                    <MenuItem value="all">All Brands</MenuItem>
                    {getUniqueValues('brand').map((brand) => (
                      <MenuItem key={brand} value={brand}>
                        {brand}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  justifyContent: 'flex-end',
                  flexDirection: { xs: 'column', sm: 'row' }
                }}>
                  <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setBrandFilter("all");
                    }}
                    fullWidth={window.innerWidth < 600}
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
                    Clear Filters
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => window.location.href = '/Products/ProductCreateEdit'}
                    fullWidth={window.innerWidth < 600}
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
                    Add Product
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              icon={<ShoppingCart />}
              title="Total Products"
              value={products.length}
              color="#52796F"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              icon={<Inventory />}
              title="In Stock"
              value={products.filter(p => (p.stockQuantity || 0) > 0).length}
              color="#2F3E46"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              icon={<AttachMoney />}
              title="Total Value"
              value={formatPrice(products.reduce((sum, p) => sum + (parseFloat(p.sellingPrice) || 0), 0))}
              color="#FFD6A5"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              icon={<TrendingUp />}
              title="Filtered Results"
              value={filteredProducts.length}
              color="#52796F"
            />
          </Grid>
        </Grid>

        {/* Products Grid */}
        {loading ? (
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            borderRadius: 4,
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
          }}>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" sx={{ color: '#2F3E46', textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)' }}>
                Loading products...
              </Typography>
            </CardContent>
          </Card>
        ) : currentProducts.length === 0 ? (
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            borderRadius: 4,
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
          }}>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <ShoppingCart sx={{ fontSize: 80, color: '#52796F', mb: 2, opacity: 0.6 }} />
              <Typography variant="h5" gutterBottom sx={{ 
                fontWeight: 600, 
                color: '#2F3E46',
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)'
              }}>
                No products found
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: '#52796F', opacity: 0.8 }}>
                {products.length === 0 
                  ? "Start by adding your first product to the inventory."
                  : "Try adjusting your search criteria or filters."}
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<Add />}
                onClick={() => window.location.href = '/Products/ProductCreateEdit'}
                sx={{
                  borderRadius: 3,
                  border: '1px solid rgba(82, 121, 111, 0.4)',
                  color: '#52796F',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))',
                  backdropFilter: 'blur(15px)',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
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
                Add First Product
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {currentProducts.map((product, index) => (
                <Grid key={product._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <ProductCard
                    product={product}
                    delay={index * 100}
                    onDelete={handleDeleteProduct}
                    onEdit={handleEditProduct}
                    onView={(p) => setViewDialog({ open: true, product: p })}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.65)',
                backdropFilter: 'blur(25px)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                borderRadius: 4,
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
              }}>
                <CardContent sx={{ px: 3, py: 2 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(e, page) => setCurrentPage(page)}
                    color="primary"
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: '#52796F',
                        '&.Mui-selected': {
                          backgroundColor: '#52796F',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: '#2F3E46'
                          }
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(82, 121, 111, 0.1)'
                        }
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </Box>
          </>
        )}

        {/* Delete Confirmation Dialog */}
        <CustomConfirmDialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, product: null })}
          onConfirm={confirmDeleteProduct}
          title="Confirm Delete"
          message="Are you sure you want to delete this product? This action cannot be undone."
        />

        {/* Product Details Dialog */}
        <Dialog 
          open={viewDialog.open} 
          onClose={() => setViewDialog({ open: false, product: null })}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.55)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
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
            Product Details
          </DialogTitle>
          <DialogContent>
            {viewDialog.product && (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  {viewDialog.product.productImages && viewDialog.product.productImages.length > 0 ? (
                    <Box
                      component="img"
                      src={getS3ImageUrl(viewDialog.product._id, viewDialog.product.productImages[0])}
                      alt={viewDialog.product.productName || viewDialog.product.name}
                      sx={{
                        width: '100%',
                        height: 300,
                        objectFit: 'cover',
                        borderRadius: 3,
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling?.style?.setProperty('display', 'flex');
                      }}
                    />
                  ) : null}
                  
                  {/* Fallback for view dialog */}
                  <Box
                    sx={{
                      width: '100%',
                      height: 300,
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(15px)',
                      display: viewDialog.product?.productImages && viewDialog.product.productImages.length > 0 ? 'none' : 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 3,
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      position: 'relative',
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
                    <ShoppingCart sx={{ fontSize: 80, color: '#52796F', opacity: 0.8, position: 'relative', zIndex: 1 }} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h5" gutterBottom sx={{ 
                    fontWeight: 600, 
                    color: '#2F3E46',
                    textShadow: '0 1px 2px rgba(255, 255, 255, 0.6)'
                  }}>
                    {viewDialog.product.productName || viewDialog.product.name}
                  </Typography>
                  <Typography variant="body1" gutterBottom sx={{ mb: 3, color: '#2F3E46', opacity: 0.9, fontWeight: 500 }}>
                    {viewDialog.product.description || 'No description available'}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1, color: '#2F3E46', fontWeight: 500 }}>
                      <strong>SKU:</strong> {viewDialog.product.SKU || 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, color: '#2F3E46', fontWeight: 500 }}>
                      <strong>Barcode:</strong> {viewDialog.product.barcode || 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, color: '#2F3E46', fontWeight: 500 }}>
                      <strong>Brand:</strong> {viewDialog.product.brand || 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, color: '#2F3E46', fontWeight: 500 }}>
                      <strong>HSN:</strong> {viewDialog.product.HSN || 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, color: '#2F3E46', fontWeight: 500 }}>
                      <strong>Selling Price:</strong> {formatPrice(viewDialog.product.sellingPrice)}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, color: '#2F3E46', fontWeight: 500 }}>
                      <strong>MRP:</strong> {formatPrice(viewDialog.product.MRP)}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, color: '#2F3E46', fontWeight: 500 }}>
                      <strong>Stock:</strong> {viewDialog.product.stockQuantity || 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#2F3E46', fontWeight: 500 }}>
                      <strong>Status:</strong>{' '}
                      <Chip
                        label={viewDialog.product.status === 'active' ? 'Active' : 'Inactive'}
                        color={viewDialog.product.status === 'active' ? 'success' : 'default'}
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
              onClick={() => setViewDialog({ open: false, product: null })}
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
                setViewDialog({ open: false, product: null });
                handleEditProduct(viewDialog.product._id);
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
              Edit Product
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert 
            severity={snackbar.severity} 
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            sx={{ 
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}