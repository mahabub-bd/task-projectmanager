/**
 * Toast utility helper for react-toastify v11+
 * Provides backward-compatible API for success/error toasts
 */
import { toast } from 'react-toastify';

export const toastSuccess = (message: string) => {
  return toast(message, {
    type: 'success',
    position: 'top-right',
  });
};

export const toastError = (message: string) => {
  return toast(message, {
    type: 'error',
    position: 'top-right',
  });
};

export const toastInfo = (message: string) => {
  return toast(message, {
    type: 'info',
    position: 'top-right',
  });
};

export const toastWarning = (message: string) => {
  return toast(message, {
    type: 'warning',
    position: 'top-right',
  });
};

export default toast;
