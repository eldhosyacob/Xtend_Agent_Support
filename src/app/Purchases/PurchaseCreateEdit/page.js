"use client";

import AlertBox from "@/components/AlertBox/page";
import useAuthAxios from "@/hooks/useAuthAxios";
import {
  Add as AddIcon,
  ArrowBack,
  Cancel as CancelIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  PhotoCamera as PhotoCameraIcon,
  Remove as RemoveIcon,
  Save as SaveIcon
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Container,
  Fade,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

export default function PurchaseCreateEdit() {
  const authAxios = useAuthAxios();
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [open, setOpen] = useState(false);
  const [purchaseBillImages, setPurchaseBillImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [alertContent, setAlertContent] = useState({
    title: "",
    description: "",
    redirect: "",
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      invoiceNo: '',
      invoiceDate: '',
      supplier: null,
      purchaseItems: [
        {
          product: null,
          purchasePrice: '',
          quantity: '',
          discount: '',
          discountType: 'Percentage'
        }
      ],
      discounts: [
        {
          discountName: '',
          discount: '',
          discountType: 'Percentage'
        }
      ]
    },
  });

  const { fields: productFields, append: appendProduct, remove: removeProduct } = useFieldArray({
    control,
    name: "purchaseItems"
  });

  const { fields: discountFields, append: appendDiscount, remove: removeDiscount } = useFieldArray({
    control,
    name: "discounts"
  });

  useEffect(() => {
    purchase_initial_data();
  }, []);

  const purchase_initial_data = async () => {
    const response = await authAxios({
      url: process.env.NEXT_PUBLIC_API_URL + '/purchases/purchase_create_initial_data',
      method: 'GET',
    });
    if (!response) return;
    console.log(response.data);
    if (response.data.status === "Sucess") {
      setProducts(response.data.data.products);
      setSuppliers(response.data.data.suppliers);
    } else {
      console.log(response.data.message);
    }
  }
  const onSubmit = async (data) => {
    console.log('Form Data:', data);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add form fields
      formData.append('invoiceNo', data.invoiceNo);
      formData.append('invoiceDate', data.invoiceDate);
      formData.append('supplierId', data.supplier?._id);
      
      // Prepare purchase items
      const purchaseItems = data.purchaseItems.map(item => ({
        productId: item.product?._id,
        discount: item.discount || 0,
        discountType: item.discountType || 'Percentage',
        purchasePrice: parseFloat(item.purchasePrice) || 0,
        quantity: parseFloat(item.quantity) || 0
      }));
      formData.append('purchaseItems', JSON.stringify(purchaseItems));
      
      // Prepare discounts
      const discounts = data.discounts.filter(discount => discount.discountName && discount.discount);
      formData.append('discounts', JSON.stringify(discounts));
      
      // Add purchase bill images
      purchaseBillImages.forEach(image => {
        formData.append('purchaseBillImages', image.file);
      });

      console.log('Submitting purchase order...');
      
      const response = await authAxios({
        url: process.env.NEXT_PUBLIC_API_URL + '/purchases/purchase_create_edit',
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response) return;

      if (response.data.status === 'success') {
        setAlertContent({
          title: "Success",
          description: response.data.message,
          redirect: "/Purchases"
        });
        setOpen(true);
      } else {
        setAlertContent({
          title: "Error",
          description: response.data.message || "Failed to create purchase order"
        });
        setOpen(true);
      }
    } catch (error) {
      console.error('Error submitting purchase order:', error);
      setAlertContent({
        title: "Error",
        description: "Failed to create purchase order. Please try again."
      });
      setOpen(true);
    }
  }


  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setPurchaseBillImages((prev) => [...prev, ...newImages]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      const newImages = imageFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        name: file.name,
      }));
      setPurchaseBillImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index) => {
    setPurchaseBillImages((prev) => prev.filter((_, i) => i !== index));
  };

  const watchedItems = watch("purchaseItems");

  const addPurchaseItem = () => {
    appendProduct({
      product: null,
      purchasePrice: '',
      quantity: '',
      discount: '',
      discountType: 'Percentage'
    });
  };

  const addDiscount = () => {
    appendDiscount({
      discountName: '',
      discount: '',
      discountType: 'Percentage'
    });
  };

  const calculateTotal = (items = watchedItems) => {
    return items?.reduce((total, item) => {
      const price = parseFloat(item.purchasePrice) || 0;
      const quantity = parseFloat(item.quantity) || 0;
      return total + (price * quantity);
    }, 0) || 0;
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
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 }, position: 'relative', zIndex: 1 }}>
        
        {/* Header Section */}
        <Fade in timeout={600}>
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <Box
              sx={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                borderRadius: 4,
                p: { xs: 3, md: 4 },
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
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
                  <Button
                    startIcon={<ArrowBack />}
                    onClick={() => window.location.href = '/Purchases'}
                    sx={{
                      mr: { sm: 3 },
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
                      fontSize: { xs: '0.875rem', md: '1rem' },
                      '&:hover': {
                        border: '1px solid rgba(82, 121, 111, 0.6)',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(82, 121, 111, 0.2)'
                      }
                    }}
                  >
                    Back to Purchases
                  </Button>
                </Box>
                
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #000000, #0a0a0a)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                    fontSize: { xs: '1.75rem', md: '2.5rem' },
                    textShadow: '0 2px 4px rgba(255, 255, 255, 0.8)',
                    textAlign: { xs: 'center', sm: 'left' }
                  }}
                >
                  Create Purchase Bill
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#52796F',
                    fontWeight: 500,
                    mb: 0,
                    opacity: 0.9,
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    textAlign: { xs: 'center', sm: 'left' }
                  }}
                >
                  Add a new purchase bill with comprehensive details
                </Typography>
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
                  opacity: 0.6,
                  display: { xs: 'none', md: 'block' }
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
                  opacity: 0.4,
                  display: { xs: 'none', md: 'block' }
                }}
              />
            </Box>
          </Box>
        </Fade>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={{ xs: 2, md: 3 }}>

            {/* Modern Image Upload Section */}
            <Grid size={{ xs: 12 }}>
              <Fade in timeout={800}>
                <Paper 
                  sx={{ 
                    p: { xs: 3, md: 4 },
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))',
                    backdropFilter: 'blur(25px)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
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
                      background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.08), transparent 70%)',
                      opacity: 0.6,
                      pointerEvents: 'none'
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <PhotoCameraIcon sx={{ mr: 2, color: '#52796F', fontSize: { xs: 24, md: 28 } }} />
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600, 
                          color: '#2F3E46',
                          fontSize: { xs: '1.1rem', md: '1.25rem' }
                        }}
                      >
                        Purchase Bill Images
                      </Typography>
                    </Box>

                    {/* Drag and Drop Upload Area */}
                    <Box
                      sx={{
                        position: 'relative',
                        border: `2px dashed ${dragActive ? '#52796F' : 'rgba(82, 121, 111, 0.3)'}`,
                        borderRadius: 3,
                        p: { xs: 2, md: 4 },
                        textAlign: 'center',
                        background: dragActive ? 'rgba(82, 121, 111, 0.05)' : 'rgba(255, 255, 255, 0.3)',
                        backdropFilter: 'blur(15px)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        mb: 3,
                        minHeight: { xs: '120px', md: '150px' },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&:hover': {
                          borderColor: '#52796F',
                          background: 'rgba(82, 121, 111, 0.05)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(82, 121, 111, 0.1)'
                        }
                      }}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('image-upload').click()}
                    >
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="image-upload"
                        multiple
                        type="file"
                        onChange={handleImageUpload}
                      />

                      <CloudUploadIcon
                        sx={{
                          fontSize: { xs: 40, md: 64 },
                          color: dragActive ? '#52796F' : 'rgba(82, 121, 111, 0.7)',
                          mb: 2
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 1,
                          color: dragActive ? '#2F3E46' : '#52796F',
                          fontSize: { xs: '1rem', md: '1.25rem' },
                          fontWeight: 600
                        }}
                      >
                        {dragActive ? 'Drop images here' : 'Drag & drop images here'}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          fontSize: { xs: '0.875rem', md: '1rem' }
                        }}
                      >
                        or click to browse from your computer
                      </Typography>
                      <Chip
                        label="JPG, PNG, WEBP up to 10MB"
                        size="small"
                        sx={{
                          background: 'linear-gradient(135deg, rgba(82, 121, 111, 0.15), rgba(139, 195, 74, 0.15))',
                          color: '#52796F',
                          fontWeight: 500,
                          borderRadius: 2
                        }}
                      />
                    </Box>

                    {/* Image Preview Grid */}
                    {purchaseBillImages.length > 0 && (
                      <Fade in={true}>
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              mb: 2,
                              fontWeight: 600,
                              color: '#2F3E46',
                              fontSize: { xs: '1rem', md: '1.1rem' }
                            }}
                          >
                            Uploaded Images ({purchaseBillImages.length})
                          </Typography>
                          <Grid container spacing={{ xs: 1, md: 2 }}>
                            {purchaseBillImages.map((image, index) => (
                              <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={index}>
                                <Box
                                  sx={{
                                    position: "relative",
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    backdropFilter: 'blur(15px)',
                                    boxShadow: '0 4px 20px rgba(47, 62, 70, 0.15)',
                                    transition: 'transform 0.2s ease',
                                    '&:hover': {
                                      transform: 'scale(1.05)'
                                    }
                                  }}
                                >
                                  <img
                                    src={image.url}
                                    alt={image.name}
                                    style={{
                                      width: "100%",
                                      height: "120px",
                                      objectFit: "cover",
                                    }}
                                  />
                                  <IconButton
                                    size="small"
                                    sx={{
                                      position: "absolute",
                                      top: 4,
                                      right: 4,
                                      background: 'rgba(255, 255, 255, 0.9)',
                                      backdropFilter: 'blur(10px)',
                                      color: '#2F3E46',
                                      '&:hover': {
                                        background: "rgba(255, 255, 255, 1)",
                                        transform: 'scale(1.1)'
                                      }
                                    }}
                                    onClick={() => removeImage(index)}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      bottom: 0,
                                      left: 0,
                                      right: 0,
                                      background: 'rgba(47, 62, 70, 0.8)',
                                      backdropFilter: 'blur(10px)',
                                      color: '#FFD6A5',
                                      p: 0.5
                                    }}
                                  >
                                    <Typography variant="caption" noWrap sx={{ fontSize: '0.75rem' }}>
                                      {image.name}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      </Fade>
                    )}
                  </Box>
                </Paper>
              </Fade>
            </Grid>

            {/* Invoice Information */}
            <Grid size={{ xs: 12 }}>
              <Fade in timeout={1000}>
                <Paper 
                  sx={{ 
                    p: { xs: 3, md: 4 },
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))',
                    backdropFilter: 'blur(25px)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
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
                      background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.08), transparent 70%)',
                      opacity: 0.6,
                      pointerEvents: 'none'
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        mb: 3, 
                        color: '#2F3E46',
                        fontSize: { xs: '1.1rem', md: '1.25rem' }
                      }}
                    >
                      Invoice Information
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                          name="invoiceNo"
                          control={control}
                          rules={{ required: "Invoice number is required" }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Invoice Number"
                              fullWidth
                              error={!!errors.invoiceNo}
                              helperText={errors.invoiceNo?.message}
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
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                  color: '#52796F'
                                }
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                          name="invoiceDate"
                          control={control}
                          rules={{ required: "Invoice date is required" }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Invoice Date"
                              type="date"
                              fullWidth
                              InputLabelProps={{
                                shrink: true,
                              }}
                              error={!!errors.invoiceDate}
                              helperText={errors.invoiceDate?.message}
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
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                  color: '#52796F'
                                }
                              }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Fade>
            </Grid>

            {/* Supplier */}
            <Grid size={{ xs: 12 }}>
              <Fade in timeout={1200}>
                <Paper 
                  sx={{ 
                    p: { xs: 3, md: 4 },
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))',
                    backdropFilter: 'blur(25px)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
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
                      background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.08), transparent 70%)',
                      opacity: 0.6,
                      pointerEvents: 'none'
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        mb: 3, 
                        color: '#2F3E46',
                        fontSize: { xs: '1.1rem', md: '1.25rem' }
                      }}
                    >
                      Supplier
                    </Typography>
                    <Controller
                      name="supplier"
                      control={control}
                      rules={{ required: "Supplier is required" }}
                      render={({ field: { onChange, value, ...field } }) => (
                        <Autocomplete
                          {...field}
                          options={suppliers}
                          getOptionLabel={(option) =>
                            typeof option === 'string' ? option : `${option.supplierName} - ${option.email}`
                          }
                          value={suppliers.find(supplier => supplier._id === value?._id) || null}
                          onChange={(event, newValue) => {
                            onChange(newValue);
                          }}
                          isOptionEqualToValue={(option, value) =>
                            option._id === value?._id
                          }
                          filterOptions={(options, { inputValue }) => {
                            return options.filter(option =>
                              option.supplierName.toLowerCase().includes(inputValue.toLowerCase()) ||
                              option.email.toLowerCase().includes(inputValue.toLowerCase())
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Supplier"
                              fullWidth
                              error={!!errors.supplier}
                              helperText={errors.supplier?.message}
                              placeholder="Search supplier by name or email..."
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
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                  color: '#52796F'
                                }
                              }}
                            />
                          )}
                          renderOption={(props, option) => (
                            <Box component="li" {...props}>
                              <Box>
                                <Typography variant="body1" fontWeight="bold">
                                  {option.supplierName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {option.email}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#52796F' }}>
                                  GST: {option.GSTNumber}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                          PaperProps={{
                            sx: {
                              borderRadius: 3,
                              background: 'rgba(255, 255, 255, 0.95)',
                              backdropFilter: 'blur(20px)',
                              border: '1px solid rgba(255, 255, 255, 0.4)',
                              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                              mt: 1,
                              '& .MuiAutocomplete-listbox': {
                                padding: 0,
                                maxHeight: '300px'
                              }
                            }
                          }}
                          fullWidth
                        />
                      )}
                    />
                  </Box>
                </Paper>
              </Fade>
            </Grid>

            {/* Products Section */}
            <Grid size={{ xs: 12 }}>
              <Fade in timeout={1400}>
                <Paper 
                  sx={{ 
                    p: { xs: 3, md: 4 },
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))',
                    backdropFilter: 'blur(25px)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
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
                      background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.08), transparent 70%)',
                      opacity: 0.6,
                      pointerEvents: 'none'
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600, 
                          color: '#2F3E46',
                          fontSize: { xs: '1.1rem', md: '1.25rem' }
                        }}
                      >
                        Products
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={addPurchaseItem}
                        size="small"
                        sx={{
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, #52796F 0%, #2F3E46 100%)',
                          fontWeight: 600,
                          px: 3,
                          py: 1.5,
                          boxShadow: '0 4px 15px rgba(82, 121, 111, 0.3)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #2F3E46 0%, #52796F 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(82, 121, 111, 0.4)'
                          }
                        }}
                      >
                        Add Product
                      </Button>
                    </Box>

                    {productFields.map((field, index) => (
                      <Box
                        key={field.id}
                        sx={{
                          mb: 3,
                          p: { xs: 2, md: 3 },
                          background: 'rgba(255, 255, 255, 0.3)',
                          backdropFilter: 'blur(15px)',
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          borderRadius: 3,
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2F3E46', fontSize: { xs: '1rem', md: '1.1rem' } }}>
                            Product {index + 1}
                          </Typography>
                          {productFields.length > 1 && (
                            <IconButton
                              size="small"
                              onClick={() => removeProduct(index)}
                              sx={{
                                color: '#d32f2f',
                                background: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(10px)',
                                '&:hover': {
                                  background: 'rgba(211, 47, 47, 0.1)',
                                  transform: 'scale(1.1)'
                                }
                              }}
                            >
                              <RemoveIcon />
                            </IconButton>
                          )}
                        </Box>

                        <Grid container spacing={{ xs: 2, md: 3 }}>
                          {/* Product Selection */}
                          <Grid size={{ xs: 12, lg: 4 }}>
                            <Controller
                              name={`purchaseItems.${index}.product`}
                              control={control}
                              render={({ field: { onChange, value, ...field } }) => (
                                <Autocomplete
                                  {...field}
                                  options={products}
                                  getOptionLabel={(option) =>
                                    typeof option === 'string' ? option : `${option.productName}`
                                  }
                                  value={value || null}
                                  onChange={(event, newValue) => onChange(newValue)}
                                  isOptionEqualToValue={(option, value) =>
                                    option?._id === value?._id
                                  }
                                  filterOptions={(options, { inputValue }) => {
                                    return options.filter(option =>
                                      option.productName.toLowerCase().includes(inputValue.toLowerCase()) ||
                                      option.barcode.toLowerCase().includes(inputValue.toLowerCase())
                                    );
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Product"
                                      fullWidth
                                      placeholder="Search product..."
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
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                          color: '#52796F'
                                        }
                                      }}
                                    />
                                  )}
                                  renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                      <Box>
                                        <Typography variant="body1" fontWeight="bold">
                                          {option.productName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                          Barcode: {option.barcode}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#52796F' }}>
                                          Selling Price: ₹{option.sellingPrice}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  )}
                                  PaperProps={{
                                    sx: {
                                      borderRadius: 3,
                                      background: 'rgba(255, 255, 255, 0.95)',
                                      backdropFilter: 'blur(20px)',
                                      border: '1px solid rgba(255, 255, 255, 0.4)',
                                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                                      mt: 1
                                    }
                                  }}
                                />
                              )}
                            />
                          </Grid>

                          {/* Selling Price (Display Only) */}
                          <Grid size={{ xs: 6, lg: 2 }}>
                            <Box sx={{ 
                              p: 2, 
                              background: 'rgba(200, 200, 200, 0.15)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(200, 200, 200, 0.3)', 
                              borderRadius: 3,
                              minHeight: '56px',
                              display: 'flex',
                              alignItems: 'center'
                            }}>
                              <Box>
                                <Typography variant="caption" sx={{ color: '#666', fontSize: '0.75rem' }}>
                                  Selling Price
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: '#52796F' }}>
                                  {watchedItems?.[index]?.product ? `₹${watchedItems[index].product.sellingPrice}` : '--'}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>

                          {/* Purchase Price */}
                          <Grid size={{ xs: 6, lg: 2 }}>
                            <Controller
                              name={`purchaseItems.${index}.purchasePrice`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Purchase Price"
                                  type="number"
                                  fullWidth
                                  InputProps={{
                                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
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
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                      color: '#52796F'
                                    }
                                  }}
                                />
                              )}
                            />
                          </Grid>

                          {/* Quantity */}
                          <Grid size={{ xs: 6, lg: 2 }}>
                            <Controller
                              name={`purchaseItems.${index}.quantity`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Quantity"
                                  type="number"
                                  fullWidth
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
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                      color: '#52796F'
                                    }
                                  }}
                                />
                              )}
                            />
                          </Grid>

                          {/* Discount */}
                          <Grid size={{ xs: 6, lg: 1 }}>
                            <Controller
                              name={`purchaseItems.${index}.discount`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Discount"
                                  type="number"
                                  fullWidth
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
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                      color: '#52796F'
                                    }
                                  }}
                                />
                              )}
                            />
                          </Grid>

                          {/* Discount Type */}
                          <Grid size={{ xs: 6, lg: 1 }}>
                            <Controller
                              name={`purchaseItems.${index}.discountType`}
                              control={control}
                              render={({ field }) => (
                                <Autocomplete
                                  {...field}
                                  options={['Percentage', 'Value']}
                                  value={field.value || 'Percentage'}
                                  onChange={(event, newValue) => field.onChange(newValue)}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Type"
                                      fullWidth
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
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                          color: '#52796F'
                                        }
                                      }}
                                    />
                                  )}
                                  PaperProps={{
                                    sx: {
                                      borderRadius: 3,
                                      background: 'rgba(255, 255, 255, 0.95)',
                                      backdropFilter: 'blur(20px)',
                                      border: '1px solid rgba(255, 255, 255, 0.4)',
                                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                                      mt: 1
                                    }
                                  }}
                                />
                              )}
                            />
                          </Grid>
                        </Grid>

                        {/* Item Total */}
                        {watchedItems?.[index]?.purchasePrice && watchedItems?.[index]?.quantity && (
                          <Box sx={{ mt: 2, textAlign: 'right' }}>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#52796F' }}>
                              Item Total: ₹{(parseFloat(watchedItems[index].purchasePrice) * parseFloat(watchedItems[index].quantity)).toFixed(2)}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    ))}

                    {/* Grand Total */}
                    <Box
                      sx={{
                        mt: 3,
                        p: { xs: 2, md: 3 },
                        background: 'linear-gradient(135deg, rgba(82, 121, 111, 0.1), rgba(139, 195, 74, 0.1))',
                        backdropFilter: 'blur(15px)',
                        borderRadius: 3,
                        border: '2px solid rgba(82, 121, 111, 0.3)',
                        boxShadow: '0 8px 25px rgba(82, 121, 111, 0.15)'
                      }}
                    >
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#2F3E46', textAlign: 'center', fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
                        Grand Total: ₹{calculateTotal().toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Fade>
            </Grid>

            {/* General Discounts Section */}
            <Grid size={{ xs: 12 }}>
              <Fade in timeout={1600}>
                <Paper 
                  sx={{ 
                    p: { xs: 3, md: 4 },
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))',
                    backdropFilter: 'blur(25px)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
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
                      background: 'linear-gradient(135deg, rgba(233, 30, 99, 0.08), transparent 70%)',
                      opacity: 0.6,
                      pointerEvents: 'none'
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600, 
                          color: '#2F3E46',
                          fontSize: { xs: '1.1rem', md: '1.25rem' }
                        }}
                      >
                        General Discounts
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={addDiscount}
                        size="small"
                        sx={{
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, #52796F 0%, #2F3E46 100%)',
                          fontWeight: 600,
                          px: 3,
                          py: 1.5,
                          boxShadow: '0 4px 15px rgba(82, 121, 111, 0.3)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #2F3E46 0%, #52796F 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(82, 121, 111, 0.4)'
                          }
                        }}
                      >
                        Add Discount
                      </Button>
                    </Box>

                    {discountFields.map((field, index) => (
                      <Box
                        key={field.id}
                        sx={{
                          mb: 3,
                          p: { xs: 2, md: 3 },
                          background: 'rgba(255, 255, 255, 0.3)',
                          backdropFilter: 'blur(15px)',
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          borderRadius: 3,
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2F3E46', fontSize: { xs: '1rem', md: '1.1rem' } }}>
                            Discount {index + 1}
                          </Typography>
                          {discountFields.length > 1 && (
                            <IconButton
                              size="small"
                              onClick={() => removeDiscount(index)}
                              sx={{
                                color: '#d32f2f',
                                background: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(10px)',
                                '&:hover': {
                                  background: 'rgba(211, 47, 47, 0.1)',
                                  transform: 'scale(1.1)'
                                }
                              }}
                            >
                              <RemoveIcon />
                            </IconButton>
                          )}
                        </Box>

                        <Grid container spacing={{ xs: 2, md: 3 }}>
                          {/* Discount Name */}
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                              name={`discounts.${index}.discountName`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Discount Name"
                                  fullWidth
                                  placeholder="e.g., Bulk order discount"
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
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                      color: '#52796F'
                                    }
                                  }}
                                />
                              )}
                            />
                          </Grid>

                          {/* Discount Value */}
                          <Grid size={{ xs: 12, md: 3 }}>
                            <Controller
                              name={`discounts.${index}.discount`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Discount Value"
                                  type="number"
                                  fullWidth
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
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                      color: '#52796F'
                                    }
                                  }}
                                />
                              )}
                            />
                          </Grid>

                          {/* Discount Type */}
                          <Grid size={{ xs: 12, md: 3 }}>
                            <Controller
                              name={`discounts.${index}.discountType`}
                              control={control}
                              render={({ field }) => (
                                <Autocomplete
                                  {...field}
                                  options={['Percentage', 'Value']}
                                  value={field.value || 'Percentage'}
                                  onChange={(event, newValue) => field.onChange(newValue)}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Discount Type"
                                      fullWidth
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
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                          color: '#52796F'
                                        }
                                      }}
                                    />
                                  )}
                                  PaperProps={{
                                    sx: {
                                      borderRadius: 3,
                                      background: 'rgba(255, 255, 255, 0.95)',
                                      backdropFilter: 'blur(20px)',
                                      border: '1px solid rgba(255, 255, 255, 0.4)',
                                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                                      mt: 1
                                    }
                                  }}
                                />
                              )}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Fade>
            </Grid>

            {/* Action Buttons */}
            <Grid size={{ xs: 12 }}>
              <Fade in timeout={1800}>
                <Paper 
                  sx={{ 
                    p: { xs: 3, md: 4 },
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))',
                    backdropFilter: 'blur(25px)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
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
                      background: 'linear-gradient(135deg, rgba(63, 81, 181, 0.08), transparent 70%)',
                      opacity: 0.6,
                      pointerEvents: 'none'
                    }
                  }}
                >
                  <Box sx={{ 
                    position: 'relative', 
                    zIndex: 1,
                    display: 'flex', 
                    gap: { xs: 2, md: 3 }, 
                    justifyContent: 'center',
                    flexDirection: { xs: 'column', sm: 'row' }
                  }}>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<CancelIcon />}
                      onClick={() => reset()}
                      sx={{
                        borderRadius: 3,
                        border: '1px solid rgba(82, 121, 111, 0.4)',
                        color: '#52796F',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))',
                        backdropFilter: 'blur(15px)',
                        fontWeight: 600,
                        px: { xs: 3, md: 4 },
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
                      Reset Form
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      type="submit"
                      startIcon={<SaveIcon />}
                      sx={{
                        borderRadius: 3,
                        px: { xs: 3, md: 4 },
                        py: 1.5,
                        background: 'linear-gradient(135deg, #52796F 0%, #2F3E46 100%)',
                        fontWeight: 600,
                        boxShadow: '0 4px 15px rgba(82, 121, 111, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #2F3E46 0%, #52796F 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(82, 121, 111, 0.4)'
                        }
                      }}
                    >
                      Save Purchase
                    </Button>
                  </Box>
                </Paper>
              </Fade>
            </Grid>
          </Grid>
        </form>
      </Container>
      <AlertBox
        open={open}
        setOpen={setOpen}
        title={alertContent.title}
        description={alertContent.description}
        redirect={alertContent.redirect}
      />
    </Box>
  );
}