/**
 * Shared MUI component styles for use across the project
 */

// TextField styles with rounded edges and minimal design
export const textFieldStyle1 = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '50px',
    height: '35px',
    fontSize: '12px',
    '& fieldset': {
      border: 'none',
    },
    backgroundColor: '#fff',
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
  }
};

// Enhanced TextField style with focus effects
export const textFieldStyle2 = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '50px',
    height: '45px',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderWidth: '1px',
    },
    '&:hover fieldset': {
      borderColor: '#01a6b8',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0ccc15',
    },
    backgroundColor: '#fff',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
  }
};

export const buttonStyle1 = {
  borderRadius: '50px',
  height: '35px',
  fontSize: '12px',
  textTransform: 'none',
}

// Enhanced button style with gradient and effects
export const buttonStyle2 = {
  borderRadius: '50px',
  height: '45px',
  fontSize: '14px',
  fontWeight: 600,
  textTransform: 'none',
  background: 'linear-gradient(45deg,rgb(69, 140, 233), rgb(41, 100, 182))',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg,rgb(69, 140, 233), rgb(41, 100, 182))',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    background: 'linear-gradient(45deg,rgb(69, 140, 233), rgb(41, 100, 182))',
    transform: 'translateY(0)',
  },
}

// Add more reusable styles below as needed