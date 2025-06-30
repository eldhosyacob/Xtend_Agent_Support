"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { 
  Button, 
  TextField, 
  FormControl, 
  FormLabel, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  Box, 
  Typography, 
  Paper, 
  Container,
  Switch,
  Card,
  CardContent,
  Divider,
  Grid,
  Chip,
  Avatar,
  IconButton,
  InputLabel,
  Fade
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import AlertBox from "@/components/AlertBox/page";
import useAuthAxios from "@/hooks/useAuthAxios";
import { useRouter } from 'nextjs-toploader/app';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import { buttonStyle2 } from "@/components/styles/muiStyles";
import "./page.scss";

// Wrapper component with Suspense
export default function UserCreatePage() {
  return (
    <Suspense fallback={
      <Box
        sx={{
          minHeight: '100vh',
          background: `
            radial-gradient(circle at 20% 50%, rgba(82, 121, 111, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(47, 62, 70, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(255, 214, 165, 0.2) 0%, transparent 50%),
            linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)
          `,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography variant="h5" component="h2" sx={{ 
          color: 'primary.main',
          fontWeight: 600
        }}>
          Loading...
        </Typography>
      </Box>
    }>
      <UserCreate />
    </Suspense>
  );
}

// Main component
function UserCreate() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ title: "", description: "", redirect: null });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [roleError, setRoleError] = useState(false);
  const authAxios = useAuthAxios();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      fullName: "",
      roles: {},
      isActive: true // Default to active
    }
  });

  // Watch roles to validate selection
  const watchedRoles = watch("roles");

  const fetchRoles = useCallback(async () => {
    try {
      // Fetch roles
      const response = await authAxios({
        url: process.env.NEXT_PUBLIC_API_URL + "/users/role_list",
        method: "GET"
      });
      if(!response) return;
      setRoles(response.data);
      // console.log("Roles fetched:", response.data);

      // Initialize all role checkboxes to false
      const roleDefaultValues = {};
      roles.forEach(role => {
        roleDefaultValues[role.label] = false;
      });
      setValue("roles", roleDefaultValues);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setAlertMessage({
        title: "Error",
        description: "Failed to fetch role data. Please try again."
      });
      setAlertOpen(true);
      setLoading(false);
    }
  }, [authAxios, setValue]);

  useEffect(() => {
    fetchRoles();
  }, []);

  // Clear role error when a role is selected
  useEffect(() => {
    if (watchedRoles && Object.values(watchedRoles).some(Boolean)) {
      setRoleError(false);
    }
  }, [watchedRoles]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setAlertMessage({
          title: "Invalid File",
          description: "Please select a valid image file (JPG, PNG, GIF, etc.)"
        });
        setAlertOpen(true);
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setAlertMessage({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB"
        });
        setAlertOpen(true);
        return;
      }

      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
    // Clear the file input
    const fileInput = document.getElementById('profile-image-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleBack = () => {
    router.push('/Users');
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Transform checkbox data to array of role IDs
      const selectedRoles = Object.entries(data.roles)
        .filter(([_, isSelected]) => isSelected)
        .map(([roleLabel]) => {
          // Find the role object with this label
          const role = roles.find(r => r.label === roleLabel);
          console.log(`Looking for role with label: ${roleLabel}`, role);
          return role ? role._id : null;
        })
        .filter(Boolean); // Remove any null values

      // Validate that at least one role is selected
      if (selectedRoles.length === 0) {
        setRoleError(true);
        setAlertMessage({
          title: "Validation Error",
          description: "Please select at least one role to create the user."
        });
        setAlertOpen(true);
        setIsSubmitting(false);
        return;
      }

      // Clear role error if validation passes
      setRoleError(false);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('fullName', data.fullName);
      formData.append('roles', JSON.stringify(selectedRoles));
      formData.append('isActive', data.isActive);
      
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      const response = await authAxios({
        url: process.env.NEXT_PUBLIC_API_URL + "/users/user_create",
        method: "POST",
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response) {
        setAlertMessage({
          title: "Success",
          description: "User created successfully!",
          redirect: "/Users"
        });
        setAlertOpen(true);
      }
    } catch (error) {
      // Handle specific error cases
      let errorMessage = "Failed to create user. Please try again.";
      
      if (error.message.includes('[409]')) {
        errorMessage = "A user with this email address already exists. Please use a different email.";
      } else if (error.message.includes('[400]')) {
        errorMessage = "Invalid input data. Please check all fields.";
      } else if (error.message.includes('[500]')) {
        errorMessage = "Server error occurred. Please try again later.";
      }
      
      setAlertMessage({
        title: "Error",
        description: errorMessage
      });
      setAlertOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (<></>);
  }

  return (
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
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
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
                    Back to Users
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
                    letterSpacing: '-0.02em'
                  }}
                >
                  Create New User
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'rgba(0, 0, 0, 0.6)',
                    fontWeight: 400,
                    maxWidth: '600px'
                  }}
                >
                  Add a new user to your system with appropriate roles and permissions
                </Typography>
              </Box>
            </Box>
          </Box>
        </Fade>

        <Grid container spacing={4}>
          {/* Main Form */}
          <Grid size={{ xs: 12, lg: 8 }}>
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
                    background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.08), transparent 70%)',
                    opacity: 0.6,
                    pointerEvents: 'none'
                  }
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Basic Information Section */}
                    <Box sx={{ mb: 5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, rgba(82, 121, 111, 0.1), rgba(82, 121, 111, 0.05))',
                            border: '1px solid rgba(82, 121, 111, 0.2)',
                          }}
                        >
                          <PersonIcon sx={{ fontSize: 24, color: '#52796F' }} />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                          Basic Information
                        </Typography>
                      </Box>
                      
                      <Grid container spacing={3}>
                        {/* Profile Image Upload */}
                        <Grid size={{ xs: 12 }}>
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#374151' }}>
                              Profile Image
                            </Typography>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 3,
                              flexWrap: 'wrap'
                            }}>
                              <Avatar
                                src={profileImagePreview}
                                sx={{ 
                                  width: 80, 
                                  height: 80,
                                  border: '3px solid rgba(82, 121, 111, 0.3)',
                                  boxShadow: '0 8px 25px rgba(82, 121, 111, 0.15)'
                                }}
                              >
                                <PersonIcon sx={{ fontSize: 40 }} />
                              </Avatar>
                              
                              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Button
                                  variant="outlined"
                                  component="label"
                                  startIcon={<PhotoCameraIcon />}
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
                                  {profileImage ? 'Change Image' : 'Upload Image'}
                                  <input
                                    id="profile-image-input"
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                  />
                                </Button>
                                
                                {profileImage && (
                                  <IconButton
                                    onClick={handleRemoveImage}
                                    sx={{
                                      borderRadius: 3,
                                      border: '1px solid rgba(239, 68, 68, 0.4)',
                                      color: '#ef4444',
                                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))',
                                      backdropFilter: 'blur(15px)',
                                      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.1)',
                                      transition: 'all 0.3s ease',
                                      '&:hover': {
                                        border: '1px solid rgba(239, 68, 68, 0.6)',
                                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 25px rgba(239, 68, 68, 0.2)'
                                      }
                                    }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                )}
                              </Box>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                              Upload a profile image (JPG, PNG, GIF - Max 5MB)
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            variant="outlined"
                            {...register("email", { required: true })}
                            error={!!errors.email}
                            helperText={errors.email ? "Email is required" : ""}
                            InputProps={{
                              startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
                                backdropFilter: 'blur(10px)',
                                '& fieldset': {
                                  border: '1px solid rgba(0, 0, 0, 0.1)',
                                  transition: 'all 0.3s ease',
                                },
                                '&:hover fieldset': {
                                  border: '1px solid rgba(82, 121, 111, 0.4)',
                                },
                                '&.Mui-focused fieldset': {
                                  border: '2px solid rgba(82, 121, 111, 0.6)',
                                  boxShadow: '0 0 0 3px rgba(82, 121, 111, 0.1)',
                                }
                              }
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Full Name"
                            variant="outlined"
                            {...register("fullName", { required: true })}
                            error={!!errors.fullName}
                            helperText={errors.fullName ? "Full name is required" : ""}
                            InputProps={{
                              startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
                                backdropFilter: 'blur(10px)',
                                '& fieldset': {
                                  border: '1px solid rgba(0, 0, 0, 0.1)',
                                  transition: 'all 0.3s ease',
                                },
                                '&:hover fieldset': {
                                  border: '1px solid rgba(82, 121, 111, 0.4)',
                                },
                                '&.Mui-focused fieldset': {
                                  border: '2px solid rgba(82, 121, 111, 0.6)',
                                  boxShadow: '0 0 0 3px rgba(82, 121, 111, 0.1)',
                                }
                              }
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Divider sx={{ my: 4, borderColor: 'rgba(0, 0, 0, 0.08)' }} />

                    {/* Status Section */}
                    <Box sx={{ mb: 5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, rgba(82, 121, 111, 0.1), rgba(82, 121, 111, 0.05))',
                            border: '1px solid rgba(82, 121, 111, 0.2)',
                          }}
                        >
                          <ToggleOnIcon sx={{ fontSize: 24, color: '#52796F' }} />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                          Account Status
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.6))',
                          border: '1px solid rgba(148, 163, 184, 0.2)',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Controller
                              name="isActive"
                              control={control}
                              render={({ field }) => (
                                <Switch
                                  {...field}
                                  checked={field.value || false}
                                  color="primary"
                                  size="medium"
                                  sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                      color: '#52796F',
                                      '&:hover': {
                                        backgroundColor: 'rgba(82, 121, 111, 0.08)',
                                      },
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                      backgroundColor: '#52796F',
                                    },
                                  }}
                                />
                              )}
                            />
                          }
                          label={
                            <Box sx={{ ml: 2 }}>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                                Active User
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                User can login and access the system
                              </Typography>
                            </Box>
                          }
                        />
                      </Box>
                    </Box>

                    <Divider sx={{ my: 4, borderColor: 'rgba(0, 0, 0, 0.08)' }} />

                    {/* Roles Section */}
                    <Box sx={{ mb: 5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 3,
                            background: roleError 
                              ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))'
                              : 'linear-gradient(135deg, rgba(82, 121, 111, 0.1), rgba(82, 121, 111, 0.05))',
                            border: roleError 
                              ? '1px solid rgba(239, 68, 68, 0.2)'
                              : '1px solid rgba(82, 121, 111, 0.2)',
                          }}
                        >
                          <AdminPanelSettingsIcon sx={{ 
                            fontSize: 24, 
                            color: roleError ? '#ef4444' : '#52796F' 
                          }} />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                          User Roles & Permissions
                        </Typography>
                        <Typography variant="body2" color="error.main" sx={{ fontWeight: 600 }}>
                          *
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          p: 4,
                          borderRadius: 3,
                          background: roleError 
                            ? 'linear-gradient(135deg, rgba(254, 242, 242, 0.8), rgba(254, 226, 226, 0.6))'
                            : 'linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.6))',
                          border: roleError 
                            ? '1px solid rgba(239, 68, 68, 0.3)'
                            : '1px solid rgba(148, 163, 184, 0.2)',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <FormControl component="fieldset" fullWidth error={roleError}>
                          <FormGroup>
                            <Grid container spacing={2}>
                              {roles.map((role) => (
                                <Grid size={{ xs: 12, sm: 6 }} key={role._id}>
                                  <FormControlLabel
                                    control={
                                      <Controller
                                        name={`roles.${role.label}`}
                                        control={control}
                                        render={({ field }) => (
                                          <Checkbox
                                            {...field}
                                            checked={field.value || false}
                                            color={roleError ? "error" : "primary"}
                                            sx={{
                                              color: roleError ? '#ef4444' : '#52796F',
                                              '&.Mui-checked': {
                                                color: roleError ? '#ef4444' : '#52796F',
                                              },
                                            }}
                                          />
                                        )}
                                      />
                                    }
                                    label={
                                      <Box sx={{ ml: 1 }}>
                                        <Chip 
                                          label={role.label}
                                          size="small"
                                          variant="outlined"
                                          sx={{ 
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            borderColor: roleError ? '#ef4444' : '#52796F',
                                            color: roleError ? '#ef4444' : '#52796F',
                                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))',
                                            backdropFilter: 'blur(10px)',
                                          }}
                                        />
                                      </Box>
                                    }
                                    sx={{
                                      p: 2,
                                      borderRadius: 3,
                                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.4))',
                                      border: '1px solid rgba(255, 255, 255, 0.3)',
                                      backdropFilter: 'blur(10px)',
                                      transition: 'all 0.3s ease',
                                      '&:hover': {
                                        background: roleError 
                                          ? 'linear-gradient(135deg, rgba(254, 242, 242, 0.8), rgba(254, 226, 226, 0.6))'
                                          : 'linear-gradient(135deg, rgba(240, 253, 250, 0.8), rgba(236, 253, 245, 0.6))',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 25px rgba(82, 121, 111, 0.15)'
                                      }
                                    }}
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </FormGroup>
                          {roleError && (
                            <Typography 
                              variant="body2" 
                              color="error.main" 
                              sx={{ mt: 3, fontWeight: 600 }}
                            >
                              Please select at least one role for the user.
                            </Typography>
                          )}
                        </FormControl>
                      </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      pt: 4,
                      borderTop: '1px solid rgba(0, 0, 0, 0.08)'
                    }}>
                      <Button
                        variant="outlined"
                        onClick={handleBack}
                        size="large"
                        sx={{
                          borderRadius: 3,
                          border: '1px solid rgba(82, 121, 111, 0.4)',
                          color: '#52796F',
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))',
                          backdropFilter: 'blur(15px)',
                          fontWeight: 600,
                          px: 4,
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
                        disabled={isSubmitting}
                        size="large"
                        sx={{
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, #52796F, rgba(82, 121, 111, 0.8))',
                          color: 'white',
                          fontWeight: 600,
                          px: 4,
                          py: 1.5,
                          boxShadow: '0 4px 15px rgba(82, 121, 111, 0.3)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #2F3E46, #52796F)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(82, 121, 111, 0.4)',
                          },
                          '&:disabled': {
                            background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.8), rgba(156, 163, 175, 0.6))',
                            color: 'white',
                            transform: 'none',
                            boxShadow: '0 4px 15px rgba(156, 163, 175, 0.2)',
                          }
                        }}
                      >
                        {isSubmitting ? "Creating..." : "Create User"}
                      </Button>
                    </Box>
                  </form>
                </Box>
              </Paper>
            </Fade>
          </Grid>

          {/* Side Panel */}
          <Grid size={{ xs: 12, lg: 4 }}>
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
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.08), transparent 70%)',
                    opacity: 0.6,
                    pointerEvents: 'none'
                  }
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700, 
                    mb: 4,
                    background: 'linear-gradient(135deg, #52796F, #2F3E46)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    User Creation Guide
                  </Typography>
                  
                  <Box sx={{ space: 3 }}>
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#1a1a1a' }}>
                        🖼️ Profile Image
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        Upload a profile image (JPG, PNG, GIF - Max 5MB). Optional but recommended for better user identification.
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#1a1a1a' }}>
                        📧 Email Requirements
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        Email must be unique and will be used for login credentials.
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#1a1a1a' }}>
                        👤 Default Settings
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        New users are active by default and can login immediately after creation.
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#1a1a1a' }}>
                        🔐 Role Assignment
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        Select appropriate roles based on user responsibilities. At least one role is required.
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#1a1a1a' }}>
                        🔑 Password Setup
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        Users will receive login credentials via email after successful creation.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Fade>
          </Grid>
        </Grid>
      </Container>

      <AlertBox
        open={alertOpen}
        setOpen={setAlertOpen}
        title={alertMessage.title}
        description={alertMessage.description}
        redirect={alertMessage.redirect}
      />
    </Box>
  );
}
