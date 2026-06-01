import { Checkbox, FormControlLabel, type CheckboxProps } from '@mui/material';
import { appColors } from '../../theme/theme';

interface AppCheckboxProps extends CheckboxProps {
  label?: string;
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
}

export default function AppCheckbox({
  label,
  labelPlacement = 'end',
  sx,
  ...props
}: AppCheckboxProps) {
  const checkbox = (
    <Checkbox
      sx={{
        color: '#d4d4d8',              // zinc-300 (looks muted/disabled when unchecked)
        '&.Mui-checked': {
          color: appColors.primary,
        },
        '&.Mui-disabled': {
          color: '#e4e4e7',
          opacity: 0.6,
        },
        '&:hover': {
          bgcolor: 'rgba(24, 24, 27, 0.04)',
        },
        ...sx,
      }}
      {...props}
    />
  );

  if (label) {
    return (
      <FormControlLabel
        control={checkbox}
        label={label}
        labelPlacement={labelPlacement}
        slotProps={{
          typography: {
            sx: {
              fontSize: '0.875rem',
              fontWeight: 500,
              userSelect: 'none',
              color: props.checked ? 'text.primary' : 'text.secondary',
              transition: 'color 0.2s ease',
            }
          }
        }}
        sx={{
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      />
    );
  }

  return checkbox;
}
