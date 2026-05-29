import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  type DialogProps,
} from '@mui/material';
import AppButton from './AppButton';

interface AppDialogProps extends Omit<DialogProps, 'onClose'> {
  open: boolean;
  title: string;
  onClose: () => void;
  onSave?: () => void;
  saveLabel?: string;
  closeLabel?: string;
  saveDisabled?: boolean;
  loading?: boolean;
  showActions?: boolean;
  children: React.ReactNode;
}

export default function AppDialog({
  open,
  title,
  onClose,
  onSave,
  saveLabel = 'Save',
  closeLabel = 'Close',
  saveDisabled = false,
  loading = false,
  showActions = true,
  children,
  maxWidth = 'sm',
  fullWidth = true,
  ...props
}: AppDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth={fullWidth} {...props}>
      <DialogTitle sx={{ fontWeight: 700, color: '#1565c0' }}>{title}</DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      {showActions && (
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <AppButton variant="outlined" onClick={onClose} disabled={loading}>
            {closeLabel}
          </AppButton>
          {onSave && (
            <AppButton
              onClick={onSave}
              disabled={saveDisabled || loading}
              sx={{
                background: 'linear-gradient(90deg, #2e7d32 0%, #1565c0 100%)',
              }}
            >
              {saveLabel}
            </AppButton>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}
