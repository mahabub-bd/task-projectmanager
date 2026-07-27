import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { cn } from '@/lib/utils';
import { AlertCircle, AlertTriangle, Info, LoaderCircle } from 'lucide-react';

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

const iconConfig = {
  danger: {
    icon: AlertTriangle,
    eyebrow: 'Irreversible action',
    iconClass: 'bg-destructive/10 text-destructive ring-destructive/15',
    buttonClass: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
    noticeClass: 'border-destructive/20 bg-destructive/5 text-destructive',
  },
  warning: {
    icon: AlertTriangle,
    eyebrow: 'Please review',
    iconClass: 'bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400',
    buttonClass: 'bg-amber-600 text-white hover:bg-amber-700 shadow-sm dark:bg-amber-500 dark:hover:bg-amber-600',
    noticeClass: '',
  },
  info: {
    icon: Info,
    eyebrow: 'Confirmation required',
    iconClass: 'bg-primary/10 text-primary ring-primary/15',
    buttonClass: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
    noticeClass: '',
  },
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
  const config = iconConfig[variant];
  const Icon = config.icon;

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  return (
    <Modal
      open={open}
      onClose={isLoading ? undefined : onClose}
      maxWidth="lg"
      showCloseButton={!isLoading}
      className="overflow-hidden rounded-2xl border-border/80 shadow-2xl"
      footer={
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn('w-full sm:min-w-[128px] sm:w-auto', config.buttonClass)}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Processing...
              </span>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      }
    >
      <div className="flex items-start gap-4 sm:gap-5">
        <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-1 ring-inset sm:h-12 sm:w-12', config.iconClass)}>
          <Icon aria-hidden="true" className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {config.eyebrow}
          </p>
          <h3 className="text-lg font-semibold leading-tight tracking-tight text-foreground sm:text-xl">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>
      </div>

      {variant === 'danger' && (
        <div className={cn('mt-6 flex items-start gap-3 rounded-xl border px-4 py-3', config.noticeClass)}>
          <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="text-sm leading-5">
            This action cannot be undone. Please confirm you want to proceed.
          </p>
        </div>
      )}
    </Modal>
  );
}
