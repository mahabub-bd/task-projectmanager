import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, Loader2, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useChangePasswordMutation } from '@/store/api';
import { cn } from '@/lib/utils';

interface ChangePasswordDialogProps {
  trigger?: React.ReactNode;
}

export function ChangePasswordDialog({ trigger }: ChangePasswordDialogProps) {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return Math.min(strength, 4);
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthColors = [
    'bg-destructive',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
  ];

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }).unwrap();

      toast.success('Password changed successfully!');

      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setErrors({});
      setOpen(false);
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to change password';
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setErrors({});
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {!trigger && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Key className="h-4 w-4 mr-2" />
            Change Password
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[450px] dark:bg-card dark:border-border/60">
        <DialogHeader className="space-y-2 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/10 dark:to-primary/5 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg">Change Password</DialogTitle>
              <DialogDescription className="text-sm">
                Secure your account with a new password
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-sm font-medium">
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, currentPassword: e.target.value });
                    if (errors.currentPassword) setErrors({ ...errors, currentPassword: undefined });
                  }}
                  className={cn(
                    'pl-10 h-10 dark:bg-background/50 dark:border-border/60',
                    errors.currentPassword && 'border-destructive focus-visible:ring-destructive'
                  )}
                  placeholder="Enter current password"
                  required
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              {errors.currentPassword && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-sm font-medium">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, newPassword: e.target.value });
                    if (errors.newPassword) setErrors({ ...errors, newPassword: undefined });
                  }}
                  className={cn(
                    'pl-10 h-10 dark:bg-background/50 dark:border-border/60',
                    errors.newPassword && 'border-destructive focus-visible:ring-destructive'
                  )}
                  placeholder="Enter new password"
                  required
                />
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              {errors.newPassword && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Password strength</span>
                  <span className={cn(
                    'font-medium',
                    passwordStrength <= 1 && 'text-destructive',
                    passwordStrength === 2 && 'text-orange-500',
                    passwordStrength === 3 && 'text-yellow-500',
                    passwordStrength >= 4 && 'text-green-500'
                  )}>
                    {passwordStrength >= 4 && <CheckCircle2 className="h-3 w-3 inline mr-1" />}
                    {strengthLabels[passwordStrength]}
                  </span>
                </div>
                <div className="flex gap-1.5 h-1.5">
                  {[0, 1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        'h-full flex-1 rounded-full transition-colors duration-200',
                        passwordStrength > level
                          ? strengthColors[passwordStrength]
                          : 'bg-muted dark:bg-muted/50'
                      )}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-sm font-medium">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                  }}
                  className={cn(
                    'pl-10 h-10 dark:bg-background/50 dark:border-border/60',
                    errors.confirmPassword && 'border-destructive focus-visible:ring-destructive'
                  )}
                  placeholder="Confirm new password"
                  required
                />
                <CheckCircle2 className={cn(
                  'absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors pointer-events-none',
                  formData.confirmPassword && formData.newPassword === formData.confirmPassword
                    ? 'text-green-500'
                    : 'text-muted-foreground'
                )} />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="dark:bg-secondary/50 dark:hover:bg-secondary/70"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className={cn('min-w-[120px]', isLoading && 'opacity-80')}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Changing...
                </>
              ) : (
                'Change Password'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
