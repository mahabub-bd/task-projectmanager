import { AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';
import { toastSuccess, toastError } from '@/lib/toast';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    new_password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirm_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || '',
      new_password: '',
      confirm_password: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: data.token,
          new_password: data.new_password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toastSuccess('Password reset successfully!');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        const errorMessage = result.message || 'Failed to reset password';
        setError(errorMessage);
        toastError(errorMessage);
      }
    } catch (err) {
      const errorMessage = 'Network error. Please try again.';
      setError(errorMessage);
      toastError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="w-full max-w-md relative z-10">
          <Card className="shadow-xl border-slate-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Invalid Reset Link</h3>
                <p className="text-sm text-slate-600 mb-6">
                  This password reset link is invalid or has expired. Please request a new one.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate('/forgot-password')}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg shadow-blue-500/30"
                  >
                    Request New Reset Link
                  </Button>
                  <Button
                    onClick={() => navigate('/login')}
                    variant="outline"
                    className="w-full"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Branding Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 mb-4 shadow-xl shadow-blue-500/30">
            <Lock className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Reset Password</h1>
          <p className="text-slate-600">
            Enter your new password below
          </p>
        </div>

        <Card className="shadow-xl border-slate-200 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-slate-900">Create New Password</CardTitle>
            <CardDescription className="text-slate-600">
              Your new password must be different from your previous passwords
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isSuccess ? (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Password Reset Successful!</h3>
                <p className="text-sm text-slate-600 mb-6">
                  Your password has been successfully reset. You will be redirected to the login page shortly.
                </p>
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg shadow-blue-500/30"
                >
                  Go to Login Now
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {error && (
                  <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="new_password" className="text-sm font-medium text-slate-700">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="new_password"
                      type={showPassword ? 'text' : 'password'}
                      {...register('new_password')}
                      className={`pl-10 pr-10 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 ${
                        errors.new_password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                      }`}
                      placeholder="Enter new password"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.new_password && (
                    <p className="text-sm text-red-600 mt-1">{errors.new_password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm_password" className="text-sm font-medium text-slate-700">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="confirm_password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirm_password')}
                      className={`pl-10 pr-10 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 ${
                        errors.confirm_password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                      }`}
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirm_password && (
                    <p className="text-sm text-red-600 mt-1">{errors.confirm_password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg shadow-blue-500/30 transition-all duration-200"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Resetting Password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-500 mt-8">
          Remember your password?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
