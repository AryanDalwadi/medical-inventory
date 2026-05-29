import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { appColors } from '../../theme/theme';

export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

export function ContentCard({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: 1,
        border: `1px solid ${appColors.border}`,
        overflow: 'hidden',
      }}
    >
      {children}
    </Box>
  );
}
