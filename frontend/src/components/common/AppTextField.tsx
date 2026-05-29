import { TextField } from '@mui/material';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AppTextField(props: any) {
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
