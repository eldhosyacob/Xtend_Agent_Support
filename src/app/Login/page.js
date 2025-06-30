"use client";

import AlertBox from "@/components/AlertBox/page";
import { setUserSession } from "@/redux/authSlice";
import { buttonStyle2, textFieldStyle2 } from "@/components/styles/muiStyles";
import { 
  Button, 
  TextField, 
  IconButton, 
  InputAdornment, 
  Card, 
  CardContent, 
  Box, 
  Typography,
  Container,
  Grid,
  Paper,
  Fade,
  Divider,
  Chip
} from "@mui/material";
import axios from "axios";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'nextjs-toploader/app';
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import "./page.scss";
import { 
  Visibility, 
  VisibilityOff, 
  BusinessCenter, 
  Security, 
  TrendingUp,
  Dashboard,
  Analytics,
  Inventory,
  Person,
  Lock,
  Email
} from "@mui/icons-material";
import NProgress from "nprogress";

// Animated Background Component
const AnimatedBackground = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0,
        background: `
          radial-gradient(circle at 20% 20%, #2F3E46 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, #52796F 0%, transparent 50%),
          radial-gradient(circle at 40% 70%, #2F3E46 0%, transparent 50%),
          linear-gradient(135deg, #FAF3E0 0%, #FFD6A5 25%, #52796F 50%, #2F3E46 100%)
        `,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 60% 30%, rgba(255, 214, 165, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 30% 80%, rgba(82, 121, 111, 0.2) 0%, transparent 50%)
          `,
          animation: 'float 6s ease-in-out infinite',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 80% 20%, rgba(47, 62, 70, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 20% 60%, rgba(255, 214, 165, 0.15) 0%, transparent 50%)
          `,
          animation: 'float 8s ease-in-out infinite reverse',
        },
        '@keyframes float': {
          '0%, 100%': {
            transform: 'translate(0, 0) rotate(0deg)',
          },
          '33%': {
            transform: 'translate(30px, -30px) rotate(120deg)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) rotate(240deg)',
          }
        }
      }}
    />
  );
};

// Floating Particles Component
const FloatingParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        left: Math.random() * 100,
        animationDelay: Math.random() * 10,
        animationDuration: Math.random() * 10 + 15,
      }));
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      {particles.map((particle) => (
        <Box
          key={particle.id}
          sx={{
            position: 'absolute',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: 'rgba(255, 214, 165, 0.4)',
            borderRadius: '50%',
            left: `${particle.left}%`,
            animation: `floatUp ${particle.animationDuration}s linear infinite`,
            animationDelay: `${particle.animationDelay}s`,
            '@keyframes floatUp': {
              '0%': {
                transform: 'translateY(100vh) scale(0)',
                opacity: 0,
              },
              '10%': {
                opacity: 1,
              },
              '90%': {
                opacity: 1,
              },
              '100%': {
                transform: 'translateY(-100px) scale(1)',
                opacity: 0,
              },
            },
          }}
        />
      ))}
    </Box>
  );
};

export default function Login() {
  return (
    <Box 
      sx={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        overflow: 'hidden'
      }}
    >
      <AnimatedBackground />
      <FloatingParticles />
      
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={0} sx={{ minHeight: '80vh' }}>
          {/* Left Side - Login Form */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Fade in timeout={800}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  background: 'rgba(250, 243, 224, 0.25)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: { xs: 3, md: '24px 0 0 24px' },
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, #FFD6A5, #52796F, #2F3E46)',
                  }
                }}
              >
                <Box sx={{ p: { xs: 4, md: 6 } }}>
                  <LoginForm />
                </Box>
              </Paper>
            </Fade>
          </Grid>

          {/* Right Side - Branding & Features */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Fade in timeout={1000}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  background: 'rgba(47, 62, 70, 0.85)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: { xs: 3, md: '0 24px 24px 0' },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#FAF3E0',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
                      radial-gradient(circle at 30% 30%, rgba(255, 214, 165, 0.1) 0%, transparent 60%),
                      radial-gradient(circle at 70% 70%, rgba(82, 121, 111, 0.15) 0%, transparent 60%)
                    `,
                    animation: 'pulse 4s ease-in-out infinite',
                  },
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.8 }
                  }
                }}
              >
                <Box sx={{ textAlign: 'center', zIndex: 1, p: 4 }}>
                  <Box sx={{ position: 'relative', mb: 3 }}>
                    <Image
                      src="/images/intenso.png"
                      alt="IntensoCore ERP Logo"
                      width={150}
                      height={150}
                      style={{
                        filter: 'drop-shadow(0 8px 16px rgba(255, 214, 165, 0.3))',
                        animation: 'glow 2s ease-in-out infinite alternate'
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255, 214, 165, 0.2) 0%, transparent 70%)',
                        animation: 'expand 3s ease-in-out infinite',
                        zIndex: -1,
                      }}
                    />
                  </Box>
                  
                  <Typography variant="h2" sx={{ 
                    fontWeight: 700, 
                    mb: 2,
                    fontSize: { xs: '2.2rem', md: '3.5rem' },
                    background: 'linear-gradient(135deg, #FAF3E0 0%, #FFD6A5 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 2px 10px rgba(255, 214, 165, 0.3)',
                    '@keyframes glow': {
                      '0%': { filter: 'drop-shadow(0 8px 16px rgba(255, 214, 165, 0.3))' },
                      '100%': { filter: 'drop-shadow(0 12px 24px rgba(255, 214, 165, 0.5))' }
                    },
                    '@keyframes expand': {
                      '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.3 },
                      '50%': { transform: 'translate(-50%, -50%) scale(1.2)', opacity: 0.1 }
                    }
                  }}>
                    IntensoCore ERP
                  </Typography>
                  
                  <Typography variant="h5" sx={{ 
                    fontWeight: 400, 
                    mb: 2, 
                    color: '#FAF3E0',
                    opacity: 0.95,
                    fontSize: { xs: '1.2rem', md: '1.6rem' }
                  }}>
                    Enterprise Management Suite
                  </Typography>

                  <Chip
                    label="Professional Edition"
                    sx={{
                      background: 'rgba(255, 214, 165, 0.2)',
                      color: '#FFD6A5',
                      border: '1px solid rgba(255, 214, 165, 0.4)',
                      fontWeight: 600,
                      mb: 4
                    }}
                  />

                  <Divider sx={{ my: 4, borderColor: 'rgba(255, 214, 165, 0.3)' }} />

                  {/* Feature Cards */}
                  <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Box 
                        sx={{ 
                          textAlign: 'center',
                          p: 3,
                          height: '160px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 2,
                          background: 'rgba(255, 214, 165, 0.1)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 214, 165, 0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            background: 'rgba(255, 214, 165, 0.15)',
                            boxShadow: '0 8px 25px rgba(255, 214, 165, 0.2)'
                          }
                        }}
                      >
                        <Dashboard sx={{ fontSize: 40, mb: 2, color: '#FFD6A5' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#FAF3E0', fontSize: '1.1rem' }}>
                          Dashboard
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8, color: '#FAF3E0', fontSize: '0.9rem', textAlign: 'center' }}>
                          Real-time insights
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Box 
                        sx={{ 
                          textAlign: 'center',
                          p: 3,
                          height: '160px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 2,
                          background: 'rgba(255, 214, 165, 0.1)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 214, 165, 0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            background: 'rgba(255, 214, 165, 0.15)',
                            boxShadow: '0 8px 25px rgba(255, 214, 165, 0.2)'
                          }
                        }}
                      >
                        <Inventory sx={{ fontSize: 40, mb: 2, color: '#FFD6A5' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#FAF3E0', fontSize: '1.1rem' }}>
                          Inventory
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8, color: '#FAF3E0', fontSize: '0.9rem', textAlign: 'center' }}>
                          Stock management
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Box 
                        sx={{ 
                          textAlign: 'center',
                          p: 3,
                          height: '160px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 2,
                          background: 'rgba(255, 214, 165, 0.1)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 214, 165, 0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            background: 'rgba(255, 214, 165, 0.15)',
                            boxShadow: '0 8px 25px rgba(255, 214, 165, 0.2)'
                          }
                        }}
                      >
                        <Analytics sx={{ fontSize: 40, mb: 2, color: '#FFD6A5' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#FAF3E0', fontSize: '1.1rem' }}>
                          Analytics
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8, color: '#FAF3E0', fontSize: '0.9rem', textAlign: 'center' }}>
                          Business intelligence
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Box 
                        sx={{ 
                          textAlign: 'center',
                          p: 3,
                          height: '160px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 2,
                          background: 'rgba(255, 214, 165, 0.1)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 214, 165, 0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            background: 'rgba(255, 214, 165, 0.15)',
                            boxShadow: '0 8px 25px rgba(255, 214, 165, 0.2)'
                          }
                        }}
                      >
                        <Security sx={{ fontSize: 40, mb: 2, color: '#FFD6A5' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#FAF3E0', fontSize: '1.1rem' }}>
                          Security
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8, color: '#FAF3E0', fontSize: '0.9rem', textAlign: 'center' }}>
                          Enterprise-grade
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = async (data) => {
    NProgress.start();
    setIsSubmitting(true);
    console.log(data);
    
    
    const response = await axios({
      url: process.env.NEXT_PUBLIC_API_URL + "/users/login",
      method: 'POST',
      data: data
      
    });
    
    NProgress.done();
    console.log(response.data);
    setIsSubmitting(false);
    
    // return;
    if (response.data.status == "Success") {
      dispatch(setUserSession(response.data.userSession));
      router.push('/', { scroll: false });
    } else {
      setAlertOpen(true);
    }
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 420, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ position: 'relative', mb: 3 }}>
          <Image
            src="/images/intensocore.png"
            alt="IntensoCore ERP Logo"
            width={150}
            height={150}
            style={{
              filter: 'drop-shadow(0 4px 12px rgba(47, 62, 70, 0.3))',
              animation: 'logoFloat 3s ease-in-out infinite'
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 90,
              height: 90,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 214, 165, 0.3) 0%, transparent 70%)',
              animation: 'logoGlow 2s ease-in-out infinite alternate',
              zIndex: -1,
              '@keyframes logoFloat': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-10px)' }
              },
              '@keyframes logoGlow': {
                '0%': { opacity: 0.3, transform: 'translate(-50%, -50%) scale(1)' },
                '100%': { opacity: 0.6, transform: 'translate(-50%, -50%) scale(1.1)' }
              }
            }}
          />
        </Box>

        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700, 
            color: '#2F3E46',
            mb: 1,
            fontSize: { xs: '2rem', md: '2.5rem' },
            textShadow: '0 2px 4px rgba(47, 62, 70, 0.1)'
          }}
        >
          Welcome Back
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#2F3E46',
            fontSize: '1.1rem',
            fontWeight: 600
          }}
        >
          Access your ERP dashboard
        </Typography>
      </Box>

      {/* Login Form */}
      <Card 
        elevation={0}
        sx={{ 
          background: 'rgba(250, 243, 224, 0.6)',
          backdropFilter: 'blur(15px)',
          borderRadius: 4,
          border: '1px solid rgba(255, 214, 165, 0.3)',
          boxShadow: '0 8px 32px rgba(47, 62, 70, 0.1)',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #FFD6A5, transparent)',
          }
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Email sx={{ fontSize: 20, color: '#52796F', mr: 1 }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#2F3E46'
                  }}
                >
                  Email Address
                </Typography>
              </Box>
              <TextField
                type="email"
                placeholder="Enter your email address"
                {...register("email", { required: true })}
                fullWidth
                error={!!errors.email}
                helperText={errors.email ? "Email is required" : ""}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: '1px solid rgba(82, 121, 111, 0.2)',
                    '&:hover': {
                      border: '1px solid rgba(82, 121, 111, 0.4)',
                      background: 'rgba(255, 255, 255, 0.8)',
                    },
                    '&.Mui-focused': {
                      border: '1px solid #52796F',
                      background: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 0 0 3px rgba(82, 121, 111, 0.1)',
                    },
                    '& fieldset': {
                      border: 'none',
                    },
                  },
                  '& input': {
                    color: '#2F3E46',
                    fontWeight: 500,
                  },
                  '& input::placeholder': {
                    color: '#52796F',
                    opacity: 0.7,
                  }
                }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Lock sx={{ fontSize: 20, color: '#52796F', mr: 1 }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#2F3E46'
                  }}
                >
                  Password
                </Typography>
              </Box>
              <TextField
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", { required: true })}
                fullWidth
                error={!!errors.password}
                helperText={errors.password ? "Password is required" : ""}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: '1px solid rgba(82, 121, 111, 0.2)',
                    '&:hover': {
                      border: '1px solid rgba(82, 121, 111, 0.4)',
                      background: 'rgba(255, 255, 255, 0.8)',
                    },
                    '&.Mui-focused': {
                      border: '1px solid #52796F',
                      background: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 0 0 3px rgba(82, 121, 111, 0.1)',
                    },
                    '& fieldset': {
                      border: 'none',
                    },
                  },
                  '& input': {
                    color: '#2F3E46',
                    fontWeight: 500,
                  },
                  '& input::placeholder': {
                    color: '#52796F',
                    opacity: 0.7,
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{ 
                          color: '#52796F',
                          '&:hover': {
                            backgroundColor: 'rgba(82, 121, 111, 0.1)',
                          }
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ textAlign: 'right', mb: 4 }}>
              <Link 
                href="/ForgotPassword" 
                style={{ 
                  color: '#52796F', 
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  transition: 'color 0.3s ease'
                }}
              >
                Forgot Password?
              </Link>
            </Box>

            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              fullWidth
              sx={{
                py: 1.8,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 700,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #FFD6A5 0%, #52796F 100%)',
                border: '1px solid rgba(255, 214, 165, 0.3)',
                color: '#2F3E46',
                boxShadow: '0 8px 25px rgba(255, 214, 165, 0.4)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                  animation: 'shimmer 2s infinite',
                },
                '&:hover': {
                  background: 'linear-gradient(135deg, #FFD6A5 0%, #2F3E46 100%)',
                  color: '#FAF3E0',
                  boxShadow: '0 12px 35px rgba(255, 214, 165, 0.5)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  background: 'rgba(82, 121, 111, 0.3)',
                  color: 'rgba(47, 62, 70, 0.5)',
                  boxShadow: 'none',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '@keyframes shimmer': {
                  '0%': { left: '-100%' },
                  '100%': { left: '100%' }
                }
              }}
            >
              {isSubmitting ? "Authenticating..." : "Sign In to Dashboard"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <AlertBox
        open={alertOpen}
        setOpen={setAlertOpen}
        title="Authentication Failed"
        description="Invalid credentials. Please check your email and password."
      />
    </Box>
  );
}