import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

const iconColors = {
  danger: 'text-destructive bg-destructive/10',
  warning: 'text-amber-600 bg-amber-100 dark:text-amber-500 dark:bg-amber-950/30',
  info: 'text-blue-600 bg-blue-100 dark:text-blue-500 dark:bg-blue-950/30',
};

const buttonColors = {
  danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  warning: 'bg-amber-600 text-white hover:bg-amber-700',
  info: 'bg-blue-600 text-white hover:bg-blue-700',
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  description = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidth="sm"
      showCloseButton={!isLoading}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className={buttonColors[variant]}
          >
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </>
      }
    >
      <div className="flex items-center gap-4">
        <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${iconColors[variant]}`}>
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </Modal>
  );
}
