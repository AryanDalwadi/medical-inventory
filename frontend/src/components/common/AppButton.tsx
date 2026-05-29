import { Button, type ButtonProps } from '@mui/material';
import { appColors } from '../../theme/theme';

export default function AppButton({ sx, variant = 'contained', ...props }: ButtonProps) {
  const isContained = variant === 'contained';

  return (
    <Button
      variant={variant}
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: 2,
        px: 2.5,
        ...(isContained && {
          background: `linear-gradient(90deg, ${appColors.secondary} 0%, ${appColors.primary} 100%)`,
          '&:hover': {
            background: `linear-gradient(90deg, ${appColors.secondary} 0%, ${appColors.primary} 100%)`,
            opacity: 0.92,
          },
        }),
        ...sx,
      }}
      {...props}
    />
  );
}
