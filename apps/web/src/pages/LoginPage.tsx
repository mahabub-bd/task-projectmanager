import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Check, CheckSquare, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import * as z from 'zod';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../store/authHooks';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    const result = await login({ email: data.email, password: data.password });

    if (result.success) {
      toast.success('Login successful');
      navigate('/dashboard');
      return;
    }

    const errorMessage = result.error || 'Invalid email or password';
    setError(errorMessage);
    toast.error(errorMessage);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <main className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1500px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[1.15fr_0.85fr]">
        <section className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 opacity-50" aria-hidden="true">
            <div className="absolute -left-24 -top-20 h-80 w-80 rounded-full bg-blue-500 blur-3xl" />
            <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-indigo-600 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,.14)_1px,transparent_0)] bg-size-[24px_24px]" />
          </div>

          <div className="relative flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950 shadow-lg shadow-black/20">
              <CheckSquare className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <span className="text-base font-semibold tracking-tight">Taskflow</span>
          </div>

          <div className="relative max-w-md">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-blue-200">Work, clearly organized</p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">Bring focus to every project.</h1>
            <p className="mt-5 text-base leading-7 text-slate-300">Plan work, keep teams aligned, and deliver with confidence from one shared workspace.</p>
          </div>

          <div className="relative space-y-3 text-sm text-slate-200">
            {['Keep projects and tasks in one place', 'Give every teammate the right level of access', 'Stay on top of work that matters'].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10"><Check className="h-3.5 w-3.5 text-blue-200" /></span>
                {feature}
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
          <div className="w-full max-w-sm">
            <div className="mb-9 lg:hidden">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white"><CheckSquare className="h-5 w-5" strokeWidth={2.5} /></div>
                <span className="font-semibold tracking-tight text-slate-900">Taskflow</span>
              </div>
              <p className="text-sm font-medium text-blue-700">Welcome back</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Sign in to your workspace</h1>
            </div>

            <Card className="border-0 shadow-none lg:rounded-none">
              <CardHeader className="space-y-2 px-0 pt-0 pb-7">
                <CardTitle className="hidden text-3xl font-semibold tracking-tight text-slate-950 lg:block">Welcome back</CardTitle>
                <CardDescription className="text-base text-slate-500">Enter your details to continue to Taskflow.</CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {error && <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">Work email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                      <Input id="email" type="email" {...register('email')} className={`h-11 rounded-lg pl-10 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-300'}`} placeholder="you@company.com" autoComplete="email" />
                    </div>
                    {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                      <Link to="/forgot-password" className="text-sm font-medium text-blue-700 transition-colors hover:text-blue-800">Forgot password?</Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                      <Input id="password" type={showPassword ? 'text' : 'password'} {...register('password')} className={`h-11 rounded-lg pl-10 pr-10 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-300'}`} placeholder="••••••••" autoComplete="current-password" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-400 transition-colors hover:text-slate-600" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="remember" {...register('rememberMe')} className="h-4 w-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" />
                    <Label htmlFor="remember" className="cursor-pointer select-none text-sm font-normal text-slate-600">Remember me for 30 days</Label>
                  </div>

                  <Button type="submit" disabled={isLoading || isSubmitting} className="h-11 w-full rounded-lg bg-slate-950 font-medium text-white shadow-lg shadow-slate-900/15 transition-all duration-200 hover:bg-slate-800" size="lg">
                    {isLoading || isSubmitting ? 'Signing in...' : 'Sign in'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500"><ShieldCheck className="h-4 w-4 text-slate-400" />Your workspace is protected and secure.</div>
          </div>
        </section>
      </main>
    </div>
  );
}
