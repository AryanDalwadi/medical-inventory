import { Box } from '@mui/material';
import AppDialog from './AppDialog';

interface AppFormDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSave: () => void;
  saveLabel?: string;
  closeLabel?: string;
  saveDisabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export default function AppFormDialog({
  open,
  title,
  onClose,
  onSave,
  saveLabel = 'Save',
  closeLabel = 'Close',
  saveDisabled = false,
  loading = false,
  children,
}: AppFormDialogProps) {
  return (
    <AppDialog
      open={open}
      title={title}
      onClose={onClose}
      onSave={onSave}
      saveLabel={saveLabel}
      closeLabel={closeLabel}
      saveDisabled={saveDisabled}
      loading={loading}
    >
      <Box
        component="form"
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
      >
        {children}
      </Box>
    </AppDialog>
  );
}
