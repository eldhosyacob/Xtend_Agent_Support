"use client";

import AlertBox from "@/components/AlertBox/page";
import useAuthAxios from "@/hooks/useAuthAxios";
import {
  ArrowBack,
  Cancel as CancelIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
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
import Nprogress from "nprogress";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import "./page.scss";

export default function ProductCreateEdit() {
  const authAxios = useAuthAxios();
  const [productImages, setProductImages] = useState([]);
  const [HSNs, setHSNs] = useState([]);
  const [brands, setBrands] = useState([]);
  const [open, setOpen] = useState(false);
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
  } = useForm({
    defaultValues: {
      productName: "",
      description: "",
      barcode: "",
      MRP: "",
      sellingPrice: "",
      HSN: "",
      brandId: "",
    },
  });

  useEffect(() => {
    product_create_edit_initial_data()
  }, []);

  const product_create_edit_initial_data = async () => {
    const response = await authAxios({
      method: "GET",
      url: process.env.NEXT_PUBLIC_API_URL + "/products/product_create_edit_initial_data",
    })
    console.log("Response:", response.data);
    setHSNs(response.data.HSNs);
    setBrands(response.data.brands);
  }

  const onSubmit = async (data) => {
    Nprogress.start();
    const formData = {
      ...data,
      productImages,
    };
    console.log("Product Data:", formData);

    const response = await authAxios({
      method: "POST",
      url: "/api/products/product_create_edit",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    console.log("Response:", response);
    if (response.data.status === "success") {
      setAlertContent({
        title: "Product Added",
        description: "Product created successfully",
        redirect: "/Products",
      });
    } else {
      setAlertContent({
        title: "Product creation failed",
        description: response.data.message,
      });
    }
    Nprogress.done();
    setOpen(true);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setProductImages((prev) => [...prev, ...newImages]);
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
      setProductImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
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
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Button
                    startIcon={<ArrowBack />}
                    onClick={() => window.location.href = '/Products'}
                    sx={{
                      mr: 3,
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
                    Back to Products
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
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    textShadow: '0 2px 4px rgba(255, 255, 255, 0.8)'
                  }}
                >
                  Create New Product
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#52796F',
                    fontWeight: 500,
                    mb: 0,
                    opacity: 0.9,
                    fontSize: '1.1rem'
                  }}
                >
                  Add a new product to your inventory with comprehensive details
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={{ xs: 2, md: 3 }}>

            {/* Product Images Upload Section */}
            <Grid size={{ xs: 12 }}>
              <Fade in timeout={800}>
                <Paper 
                  sx={{ 
                    p: 4,
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
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{
                        color: '#2F3E46',
                        fontWeight: 600,
                        fontSize: '1.2rem',
                        mb: 3
                      }}
                    >
                      Product Images
                    </Typography>

                    {/* Drag and Drop Upload Area */}
                    <Box
                      sx={{
                        position: 'relative',
                        border: `2px dashed ${dragActive ? '#FFD6A5' : 'rgba(255, 214, 165, 0.5)'}`,
                        borderRadius: 3,
                        p: { xs: 2, md: 4 },
                        textAlign: 'center',
                        bgcolor: dragActive ? 'rgba(255, 214, 165, 0.1)' : 'rgba(250, 243, 224, 0.3)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        mb: 3,
                        minHeight: { xs: '120px', md: '150px' },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&:hover': {
                          borderColor: '#FFD6A5',
                          bgcolor: 'rgba(255, 214, 165, 0.1)',
                          transform: 'translateY(-2px)'
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
                          bgcolor: 'rgba(255, 214, 165, 0.2)',
                          color: '#52796F',
                          fontWeight: 500
                        }} 
                      />
                    </Box>

                    {/* Image Preview Grid */}
                    {productImages.length > 0 && (
                      <Fade in={true}>
                        <Box>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              mb: 2, 
                              fontWeight: 600,
                              color: '#2F3E46'
                            }}
                          >
                            Uploaded Images ({productImages.length})
                          </Typography>
                          <Grid container spacing={{ xs: 1, md: 2 }}>
                            {productImages.map((image, index) => (
                              <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={index}>
                                <Box 
                                  sx={{ 
                                    position: "relative",
                                    borderRadius: 2,
                                    overflow: 'hidden',
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
                                      backgroundColor: "rgba(250, 243, 224, 0.9)",
                                      color: '#2F3E46',
                                      '&:hover': {
                                        backgroundColor: "rgba(250, 243, 224, 1)",
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
                                      bgcolor: 'rgba(47, 62, 70, 0.8)',
                                      color: '#FFD6A5',
                                      p: 0.5,
                                      backdropFilter: 'blur(10px)'
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

            {/* Product Details */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Fade in timeout={1000}>
                <Paper 
                  sx={{ 
                    p: 4,
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
                      gutterBottom
                      sx={{
                        color: '#2F3E46',
                        fontWeight: 600,
                        fontSize: '1.2rem',
                        mb: 3
                      }}
                    >
                      Product Details
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12 }}>
                        <Controller
                          name="productName"
                          control={control}
                          rules={{ required: "Product name is required" }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Product Name"
                              fullWidth
                              error={!!errors.productName}
                              helperText={errors.productName?.message}
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

                      <Grid size={{ xs: 12 }}>
                        <Controller
                          name="description"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Description"
                              multiline
                              rows={4}
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

                      <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                          name="barcode"
                          control={control}
                          rules={{ required: "Barcode is required" }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Barcode"
                              fullWidth
                              error={!!errors.barcode}
                              helperText={errors.barcode?.message}
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
                          name="HSN"
                          control={control}
                          render={({ field: { onChange, value, ...field } }) => (
                            <Autocomplete
                              {...field}
                              options={HSNs}
                              getOptionLabel={(option) =>
                                typeof option === 'string' ? option : `${option.hsn} - ${option.description}`
                              }
                              value={HSNs.find(hsn => hsn.hsn === value) || null}
                              onChange={(event, newValue) => {
                                onChange(newValue ? newValue.hsn : '');
                              }}
                              isOptionEqualToValue={(option, value) =>
                                option.hsn === (typeof value === 'string' ? value : value?.hsn)
                              }
                              filterOptions={(options, { inputValue }) => {
                                return options.filter(option =>
                                  option.hsn.toLowerCase().includes(inputValue.toLowerCase()) ||
                                  option.description.toLowerCase().includes(inputValue.toLowerCase())
                                );
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="HSN Code"
                                  fullWidth
                                  placeholder="Search HSN code or description..."
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
                                <Box 
                                  component="li" 
                                  {...props}
                                  sx={{
                                    p: 2,
                                    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                                    '&:hover': {
                                      bgcolor: 'rgba(82, 121, 111, 0.08)',
                                      '& .hsn-code': {
                                        color: '#2F3E46'
                                      }
                                    },
                                    '&[aria-selected="true"]': {
                                      bgcolor: 'rgba(82, 121, 111, 0.12)',
                                      '&:hover': {
                                        bgcolor: 'rgba(82, 121, 111, 0.16)'
                                      }
                                    }
                                  }}
                                >
                                  <Box sx={{ width: '100%' }}>
                                    <Typography 
                                      variant="body1" 
                                      className="hsn-code"
                                      sx={{ 
                                        fontWeight: 700,
                                        color: '#52796F',
                                        transition: 'color 0.2s ease'
                                      }}
                                    >
                                      {option.hsn}
                                    </Typography>
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        color: '#2F3E46',
                                        opacity: 0.8,
                                        mt: 0.5,
                                        lineHeight: 1.4
                                      }}
                                    >
                                      {option.description}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                      <Chip
                                        label={`GST: ${option.gstRate}%`}
                                        size="small"
                                        sx={{
                                          background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.15), rgba(255, 193, 7, 0.15))',
                                          color: '#e65100',
                                          fontWeight: 600,
                                          fontSize: '0.75rem',
                                          height: '20px',
                                          borderRadius: '10px'
                                        }}
                                      />
                                    </Box>
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
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Fade>
            </Grid>

            {/* Additional Information */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Fade in timeout={1200}>
                <Paper 
                  sx={{ 
                    p: 4,
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
                      gutterBottom
                      sx={{
                        color: '#2F3E46',
                        fontWeight: 600,
                        fontSize: '1.2rem',
                        mb: 3
                      }}
                    >
                      Pricing & Brand
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12 }}>
                        <Controller
                          name="MRP"
                          control={control}
                          rules={{ required: "MRP is required" }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="MRP"
                              type="number"
                              fullWidth
                              error={!!errors.MRP}
                              helperText={errors.MRP?.message}
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

                      <Grid size={{ xs: 12 }}>
                        <Controller
                          name="sellingPrice"
                          control={control}
                          rules={{ required: "Selling price is required" }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Selling Price"
                              type="number"
                              fullWidth
                              error={!!errors.sellingPrice}
                              helperText={errors.sellingPrice?.message}
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

                      <Grid size={{ xs: 12 }}>
                        <Controller
                          name="brandId"
                          control={control}
                          render={({ field: { onChange, value, ...field } }) => (
                            <Autocomplete
                              {...field}
                              options={brands}
                              getOptionLabel={(option) => option.brandName || ""}
                              value={brands.find(brand => brand._id === value) || null}
                              onChange={(event, newValue) => {
                                onChange(newValue?._id || "");
                              }}
                              isOptionEqualToValue={(option, value) =>
                                option._id === value
                              }
                              filterOptions={(options, { inputValue }) => {
                                return options.filter(option =>
                                  option.brandName.toLowerCase().includes(inputValue.toLowerCase()) ||
                                  (option.description && option.description.toLowerCase().includes(inputValue.toLowerCase()))
                                );
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Brand"
                                  fullWidth
                                  placeholder="Search brand name..."
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
                                <Box 
                                  component="li" 
                                  {...props}
                                  sx={{
                                    p: 2,
                                    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                                    '&:hover': {
                                      bgcolor: 'rgba(82, 121, 111, 0.08)',
                                      '& .brand-name': {
                                        color: '#2F3E46'
                                      }
                                    },
                                    '&[aria-selected="true"]': {
                                      bgcolor: 'rgba(82, 121, 111, 0.12)',
                                      '&:hover': {
                                        bgcolor: 'rgba(82, 121, 111, 0.16)'
                                      }
                                    }
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    {/* Brand Avatar */}
                                    <Box
                                      sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 2,
                                        background: 'linear-gradient(135deg, rgba(82, 121, 111, 0.8), rgba(47, 62, 70, 0.9))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mr: 2,
                                        color: 'white',
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        flexShrink: 0
                                      }}
                                    >
                                      {option.brandName?.charAt(0) || 'B'}
                                    </Box>
                                    
                                    {/* Brand Info */}
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                      <Typography 
                                        variant="body1" 
                                        className="brand-name"
                                        sx={{ 
                                          fontWeight: 700,
                                          color: '#52796F',
                                          transition: 'color 0.2s ease',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap'
                                        }}
                                      >
                                        {option.brandName}
                                      </Typography>
                                      {option.description && (
                                        <Typography 
                                          variant="body2" 
                                          sx={{ 
                                            color: '#2F3E46',
                                            opacity: 0.8,
                                            mt: 0.5,
                                            lineHeight: 1.4,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                          }}
                                        >
                                          {option.description}
                                        </Typography>
                                      )}
                                      {option.status && (
                                        <Box sx={{ mt: 1 }}>
                                          <Chip
                                            label={option.status}
                                            size="small"
                                            sx={{
                                              background: option.status === 'Active' 
                                                ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.15), rgba(139, 195, 74, 0.15))'
                                                : 'linear-gradient(135deg, rgba(244, 67, 54, 0.15), rgba(233, 30, 99, 0.15))',
                                              color: option.status === 'Active' ? '#2e7d32' : '#c62828',
                                              fontWeight: 600,
                                              fontSize: '0.75rem',
                                              height: '20px',
                                              borderRadius: '10px'
                                            }}
                                          />
                                        </Box>
                                      )}
                                    </Box>
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
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Fade>
            </Grid>

            {/* Action Buttons */}
            <Grid size={{ xs: 12 }}>
              <Fade in timeout={1400}>
                <Paper 
                  sx={{ 
                    p: 4,
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
                  <Box sx={{ 
                    position: 'relative', 
                    zIndex: 1,
                    display: 'flex', 
                    gap: 2, 
                    justifyContent: 'flex-end',
                    flexDirection: { xs: 'column', sm: 'row' }
                  }}>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={() => window.location.href = '/Products'}
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
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
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
                      Create Product
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