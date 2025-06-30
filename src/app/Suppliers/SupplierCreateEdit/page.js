"use client";

import {
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Upload as UploadIcon,
  ArrowBack
} from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  Container,
  Fade
} from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import AlertBox from "@/components/AlertBox/page";
import Nprogress from "nprogress";
import useAuthAxios from "@/hooks/useAuthAxios";


export default function SupplierCreateEdit() {
  const authAxios = useAuthAxios();
  const [supplierLogo, setSupplierLogo] = useState(null);
  const [open, setOpen] = useState(false);
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
      supplierName: "",
      GSTNumber: "",
      address: "",
      phoneNumber: "",
      email: "",
      description: "",
      active: true,
    },
  });

  
  const onSubmit = async (data) => {
    // console.log("Data:", data);
    // return;
    Nprogress.start();
    const formData = {
      ...data,
      supplierLogo,
    };
    console.log("Supplier Data:", formData);

    const response = await authAxios({
      method: "POST",
      url: "/api/suppliers/supplier_create_edit",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    console.log("Response:", response);
    if (response.data.status === "success") {
      setAlertContent({
        title: "Supplier Added",
        description: "Supplier created successfully",
        redirect: "/Suppliers",
      });
    } else {
      setAlertContent({
        title: "Supplier creation failed",
        description: response.data.message,
      });
    }
    Nprogress.done();
    setOpen(true);
    // Here you would typically send the data to your API
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newImage = {
        file,
        url: URL.createObjectURL(file),
        name: file.name,
      };
      setSupplierLogo(newImage);
    }
  };

  const removeImage = () => {
    setSupplierLogo(null);
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
                      onClick={() => window.location.href = '/Suppliers'}
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
                      Back to Suppliers
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
                    Create New Supplier
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
                    Add a new supplier to your network with comprehensive details
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
            <Grid container spacing={3}>

              {/* Supplier Logo Section */}
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
                        Supplier Logo
                      </Typography>
                      <Box sx={{ mb: 3 }}>
                        <input
                          accept="image/*"
                          style={{ display: "none" }}
                          id="image-upload"
                          type="file"
                          onChange={handleImageUpload}
                        />
                        <label htmlFor="image-upload">
                          <Button
                            variant="outlined"
                            component="span"
                            startIcon={<UploadIcon />}
                            sx={{
                              borderRadius: 3,
                              border: '1px solid rgba(33, 150, 243, 0.4)',
                              color: '#2196f3',
                              background: 'rgba(255, 255, 255, 0.6)',
                              backdropFilter: 'blur(15px)',
                              fontWeight: 600,
                              px: 3,
                              py: 1.5,
                              boxShadow: '0 4px 15px rgba(33, 150, 243, 0.1)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                border: '1px solid rgba(33, 150, 243, 0.6)',
                                background: 'rgba(255, 255, 255, 0.8)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 25px rgba(33, 150, 243, 0.2)'
                              }
                            }}
                          >
                            Upload Supplier Logo
                          </Button>
                        </label>
                      </Box>
                      {supplierLogo && (
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                            <Box 
                              sx={{ 
                                position: "relative",
                                borderRadius: 3,
                                overflow: 'hidden',
                                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.3)'
                              }}
                            >
                              <img
                                src={supplierLogo.url}
                                alt={supplierLogo.name}
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
                                  top: 8,
                                  right: 8,
                                  background: 'rgba(255, 255, 255, 0.9)',
                                  backdropFilter: 'blur(10px)',
                                  border: '1px solid rgba(244, 67, 54, 0.3)',
                                  color: '#f44336',
                                  '&:hover': {
                                    background: 'rgba(255, 255, 255, 1)',
                                    transform: 'scale(1.1)'
                                  }
                                }}
                                onClick={removeImage}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Grid>
                        </Grid>
                      )}
                    </Box>
                  </Paper>
                </Fade>
              </Grid>

              {/* Supplier Details Section */}
              <Grid size={{ xs: 12 }}>
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
                        Supplier Details
                      </Typography>
                      <Grid container spacing={3}>

                        <Grid size={{ xs: 12, md: 6 }}>
                          <Controller
                              name="supplierName"
                            control={control}
                            rules={{ required: "Supplier name is required" }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Supplier Name"
                                fullWidth
                                error={!!errors.supplierName}
                                helperText={errors.supplierName?.message}
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
                            )}
                          />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                          <Controller
                            name="GSTNumber"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="GST Number"
                                fullWidth
                                placeholder="GST123456789"
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
                            )}
                          />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                          <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Email Address"
                                fullWidth
                                type="email"
                                placeholder="supplier@example.com"
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
                            )}
                          />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                          <Controller
                            name="phoneNumber"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Phone Number"
                                fullWidth
                                placeholder="+1 (555) 123-4567"
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
                            )}
                          />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                          <Controller
                            name="address"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Address"
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Enter complete address..."
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
                                fullWidth
                                multiline
                                rows={4}
                                placeholder="Describe the supplier's business, products, or services..."
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
                            )}
                          />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                          <Controller
                            name="active"
                            control={control}
                            render={({ field }) => (
                              <Box
                                sx={{
                                  p: 2,
                                  background: 'rgba(255, 255, 255, 0.6)',
                                  backdropFilter: 'blur(15px)',
                                  borderRadius: 3,
                                  border: '1px solid rgba(255, 255, 255, 0.4)',
                                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)'
                                }}
                              >
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={field.value}
                                      onChange={(e) => field.onChange(e.target.checked)}
                                      sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                          color: '#4caf50',
                                        },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                          backgroundColor: '#4caf50',
                                        },
                                      }}
                                    />
                                  }
                                  label={
                                    <Typography sx={{ color: '#2F3E46', fontWeight: 500 }}>
                                      Active Status
                                    </Typography>
                                  }
                                />
                              </Box>
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
                      <Box sx={{ display: "flex", gap: 3, justifyContent: "flex-end", flexWrap: 'wrap' }}>
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={() => reset()}
                          sx={{
                            borderRadius: 3,
                            border: '1px solid rgba(82, 121, 111, 0.4)',
                            color: '#52796F',
                            background: 'rgba(255, 255, 255, 0.6)',
                            backdropFilter: 'blur(15px)',
                            fontWeight: 600,
                            px: 4,
                            py: 1.5,
                            boxShadow: '0 4px 15px rgba(82, 121, 111, 0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              border: '1px solid rgba(82, 121, 111, 0.6)',
                              background: 'rgba(255, 255, 255, 0.8)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(82, 121, 111, 0.2)'
                            }
                          }}
                        >
                          Reset Form
                        </Button>
                        <Button
                          variant="contained"
                          type="submit"
                          startIcon={<SaveIcon />}
                          sx={{
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #52796F, #2F3E46)',
                            color: 'white',
                            fontWeight: 600,
                            px: 4,
                            py: 1.5,
                            boxShadow: '0 8px 25px rgba(82, 121, 111, 0.3)',
                            backdropFilter: 'blur(15px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #2F3E46, #1a2328)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 12px 35px rgba(82, 121, 111, 0.4)'
                            }
                          }}
                        >
                          Save Supplier
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                </Fade>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Box>
      <AlertBox
        open={open}
        setOpen={setOpen}
        title={alertContent.title}
        description={alertContent.description}
        redirect={alertContent.redirect}
      />
    </>
  );
}