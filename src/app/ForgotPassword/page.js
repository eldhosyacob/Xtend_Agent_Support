"use client";

import { useState } from "react";
import { Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { buttonStyle2, textFieldStyle2 } from "@/components/styles/muiStyles";
import axios from "axios";
import AlertBox from "@/components/AlertBox/page";
import { useRouter } from 'nextjs-toploader/app';
import "../Login/page.scss";

export default function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios({
        url: process.env.NEXT_PUBLIC_API_URL + "/reset_password",
        method: 'POST',
        data: { email: data.email }
      });

      if (response.data.status === "Success") {
        setAlertTitle("Password Reset Link Sent");
        setAlertDescription("If your email exists in our system, you'll receive a password reset link shortly. Please check your inbox.");
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

  return (
    <div className="login_page_container">
      <div className="login_form_container">
        <img src="/images/AptYou_logo.png" alt="AptYou" className="login_form_logo" />
        <div className="login_form_title">Forgot Password</div>
        <div className="login_form_subtitle">Enter your email to receive a password reset link</div>
        
        <form className="form_container" onSubmit={handleSubmit(onSubmit)}>
          <div className="input_labels">Email</div>
          <TextField
            type="email"
            placeholder="Enter your email"
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            sx={{ ...textFieldStyle2, width: '100%' }}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ""}
          />
          
          <Button
            variant="contained"
            sx={{ ...buttonStyle2, width: '100%', marginTop: '2rem' }}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Send Reset Link"}
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