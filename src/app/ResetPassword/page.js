"use client";

import { useState, useEffect } from "react";
import { Button, TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { buttonStyle2, textFieldStyle2 } from "@/components/styles/muiStyles";
import axios from "axios";
import AlertBox from "@/components/AlertBox/page";
import { useRouter } from 'next/navigation';
import "../Login/page.scss";

export default function ResetPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setToken(urlParams.get('token'));
    setEmail(urlParams.get('email'));
  }, []);

  useEffect(() => {
    // Validate token on page load
    const validateToken = async () => {
      if (!token || !email) {
        setIsTokenValid(false);
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await axios({
          url: process.env.NEXT_PUBLIC_API_URL + "/validate_reset_token",
          method: 'POST',
          data: { token, email }
        });
        
        setIsTokenValid(response.data.status === "Success");
      } catch (error) {
        console.error("Token validation error:", error);
        setIsTokenValid(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    validateToken();
  }, [token, email]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  
  const password = watch("password", "");

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios({
        url: process.env.NEXT_PUBLIC_API_URL + "/update_password",
        method: 'POST',
        data: { 
          email, 
          token, 
          password: data.password 
        }
      });

      if (response.data.status === "Success") {
        setAlertTitle("Password Updated");
        setAlertDescription("Your password has been successfully updated. You can now log in with your new password.");
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/Login', { scroll: false });
        }, 3000);
      } else {
        setAlertTitle("Error");
        setAlertDescription(response.data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setAlertTitle("Error");
      setAlertDescription("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setAlertOpen(true);
    }
  };

  const handleBackToLogin = () => {
    router.push('/Login', { scroll: false });
  };

  if (isLoading) {
    return (
      <div className="login_page_container">
        <div className="login_form_container">
          <img src="/images/AptYou_logo.png" alt="AptYou" className="login_form_logo" />
          <div className="login_form_title">Reset Password</div>
          <div className="login_form_subtitle">Validating your reset link...</div>
        </div>
        
        <div className="login_page_image_container">
          <div className="login_page_image_title">AptyRead by AptYou</div>
          <div className="login_page_image_subtitle">Discover, Create, Connect</div>
          <p className="login_page_image_description">
            Join our community and share your voice with the world
          </p>
          <img src="/images/login_bg.webp" alt="AptYou" className="login_page_image" />
        </div>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className="login_page_container">
        <div className="login_form_container">
          <img src="/images/AptYou_logo.png" alt="AptYou" className="login_form_logo" />
          <div className="login_form_title">Invalid or Expired Link</div>
          <div className="login_form_subtitle">This password reset link is invalid or has expired.</div>
          
          <Button
            variant="contained"
            sx={{ ...buttonStyle2, width: '100%', marginTop: '2rem' }}
            onClick={handleBackToLogin}
          >
            Back to Login
          </Button>
        </div>
        
        <div className="login_page_image_container">
          <div className="login_page_image_title">AptyRead by AptYou</div>
          <div className="login_page_image_subtitle">Discover, Create, Connect</div>
          <p className="login_page_image_description">
            Join our community and share your voice with the world
          </p>
          <img src="/images/login_bg.webp" alt="AptYou" className="login_page_image" />
        </div>
      </div>
    );
  }

  return (
    <div className="login_page_container">
      <div className="login_form_container">
        <img src="/images/AptYou_logo.png" alt="AptYou" className="login_form_logo" />
        <div className="login_form_title">Reset Password</div>
        <div className="login_form_subtitle">Enter your new password</div>
        
        <form className="form_container" onSubmit={handleSubmit(onSubmit)}>
          <div className="input_labels">New Password</div>
          <TextField
            type={showPassword ? "text" : "password"}
            placeholder="Enter your new password"
            {...register("password", { 
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters"
              }
            })}
            sx={{ ...textFieldStyle2, width: '100%' }}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ""}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <div className="input_labels">Confirm Password</div>
          <TextField
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your new password"
            {...register("confirmPassword", { 
              required: "Please confirm your password",
              validate: value => value === password || "Passwords do not match"
            })}
            sx={{ ...textFieldStyle2, width: '100%' }}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword ? errors.confirmPassword.message : ""}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            variant="contained"
            sx={{ ...buttonStyle2, width: '100%', marginTop: '2rem' }}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </Button>
          
          <Button
            variant="text"
            onClick={handleBackToLogin}
            sx={{ marginTop: '1rem', textTransform: 'none' }}
          >
            Back to Login
          </Button>
        </form>

        <AlertBox
          open={alertOpen}
          setOpen={setAlertOpen}
          title={alertTitle}
          description={alertDescription}
        />
      </div>
      
      <div className="login_page_image_container">
        <div className="login_page_image_title">AptyRead by AptYou</div>
        <div className="login_page_image_subtitle">Discover, Create, Connect</div>
        <p className="login_page_image_description">
          Join our community and share your voice with the world
        </p>
        <img src="/images/login_bg.webp" alt="AptYou" className="login_page_image" />
      </div>
    </div>
  );
} 