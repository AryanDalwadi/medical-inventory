import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appColors } from '../theme/theme';

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
        background: `linear-gradient(135deg, ${appColors.secondaryLight} 0%, ${appColors.primaryLight} 100%)`,
      }}
    >
      <Typography variant="h3" sx={{ fontWeight: 600, color: appColors.primary }}>
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
