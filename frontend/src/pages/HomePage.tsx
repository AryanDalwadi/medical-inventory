import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        background: 'linear-gradient(135deg, #e8f5e9 0%, #e3f2fd 100%)',
      }}
    >
      <Typography variant="h3" sx={{ fontWeight: 600, color: '#1565c0' }}>
        hello
      </Typography>
      {user && (
        <Typography variant="body1" color="text.secondary">
          Welcome, {user.userName}
        </Typography>
      )}
      <Button variant="outlined" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
}
