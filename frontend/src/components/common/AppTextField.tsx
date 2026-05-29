import { TextField, type TextFieldProps } from '@mui/material';

export default function AppTextField(props: TextFieldProps) {
  return (
    <TextField
      fullWidth
      size="small"
      variant="outlined"
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        },
      }}
      {...props}
    />
  );
}
