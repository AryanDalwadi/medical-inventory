import { Box, Grid, Paper, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useAuth } from '../context/AuthContext';
import { appColors } from '../theme/theme';

const cards = [
  {
    title: 'Users',
    description: 'Manage system users and roles',
    icon: PeopleIcon,
    color: appColors.primary,
    bg: appColors.primaryLight,
  },
  {
    title: 'Products',
    description: 'Inventory and product batches',
    icon: InventoryIcon,
    color: appColors.secondary,
    bg: appColors.secondaryLight,
  },
  {
    title: 'Billing',
    description: 'POS and sales invoices',
    icon: PointOfSaleIcon,
    color: '#6a1b9a',
    bg: '#f3e5f5',
  },
  {
    title: 'Reports',
    description: 'Sales and stock analytics',
    icon: ReceiptLongIcon,
    color: '#e65100',
    bg: '#fff3e0',
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Welcome back{user ? `, ${user.userName}` : ''}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Medical Inventory & Billing dashboard
      </Typography>

      <Grid container spacing={2.5}>
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Grid key={card.title} size={{ xs: 12, sm: 6, xl: 3 }}>
              <Paper
                elevation={1}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: '100%',
                  border: '1px solid #eef2f7',
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: card.bg,
                    color: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Icon />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
