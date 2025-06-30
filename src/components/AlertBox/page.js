import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { CheckCircleOutline, Cancel } from '@mui/icons-material';
// import { useRouter } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function AlertBox({ title, description, onConfirm, redirect, open, setOpen, type = 'success' }) {
  const router = useRouter();
  const handleClose = () => {
    setOpen(false);
    if(redirect) router.push(redirect);
  };

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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        <Avatar
          sx={{
            background: `linear-gradient(135deg, ${color}, rgba(82, 121, 111, 0.8))`,
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
        <Typography sx={{ fontWeight: 600, color: '#2F3E46' }}>
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
          {description}
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 2, gap: 1 }}>
        <Button
          onClick={() => { if (onConfirm) onConfirm(); handleClose(); }}
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
      </DialogActions>
    </Dialog>
  );
}
