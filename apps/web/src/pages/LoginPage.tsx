import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import * as z from 'zod';
import { useTheme } from '../contexts/ThemeContext';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../store/authHooks';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const workspaceItems = [
  { name: 'Website refresh', status: 'In progress', color: 'bg-violet-500', progress: 'w-[72%]' },
  { name: 'Q3 product launch', status: 'On track', color: 'bg-emerald-500', progress: 'w-[46%]' },
  { name: 'Customer research', status: 'Review', color: 'bg-amber-400', progress: 'w-[88%]' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const { theme } = useTheme();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  const logoSrc = theme === 'dark' ? '/dark_logo.png' : '/light_logo.png';

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

  const fillDemoCredentials = () => {
    setError('');
    setValue('email', 'superadmin@system.com', { shouldValidate: true });
    setValue('password', '123456', { shouldValidate: true });
  };

  return (
    <div className="min-h-screen bg-[#f7f7fb] p-3 sm:p-5 lg:p-6">
      <main className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1560px] overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_80px_rgba(40,34,68,0.12)] lg:min-h-[calc(100vh-3rem)] lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden overflow-hidden bg-[#2b2251] px-10 py-9 text-white lg:flex lg:flex-col xl:px-14 xl:py-12">
          <div className="absolute inset-0 opacity-70" aria-hidden="true">
            <div className="absolute -left-20 top-24 h-80 w-80 rounded-full bg-fuchsia-500/40 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-[32rem] w-[32rem] rounded-full bg-violet-400/30 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] bg-size-[42px_42px]" />
          </div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logoSrc} alt="Taskflow" className="h-11 w-auto object-contain" />
            </div>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-violet-100">Work better, together</span>
          </div>

          <div className="relative mt-auto max-w-xl pb-9 pt-16 xl:pt-24">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-violet-300/15 px-3 py-1.5 text-xs font-medium text-violet-100 ring-1 ring-inset ring-white/10">
              <Sparkles className="h-3.5 w-3.5" /> A calmer way to get work done
            </div>
            <h1 className="max-w-lg text-4xl font-semibold leading-[1.08] tracking-[-0.04em] xl:text-6xl">Your team’s best work starts with clarity.</h1>
            <p className="mt-5 max-w-md text-base leading-7 text-violet-100/80">Bring plans, projects, and people into one beautifully organized workspace.</p>
          </div>

          <div className="relative rounded-2xl border border-white/15 bg-white/[0.09] p-4 shadow-2xl shadow-black/15 backdrop-blur-sm xl:max-w-xl">
            <div className="mb-4 flex items-center justify-between">
              <div><p className="text-sm font-medium">Project overview</p><p className="mt-0.5 text-xs text-violet-200">Your team is moving forward</p></div>
              <div className="flex -space-x-2">{['bg-rose-300', 'bg-amber-200', 'bg-sky-300'].map((color) => <span key={color} className={`h-7 w-7 rounded-full border-2 border-[#4a3a72] ${color}`} />)}</div>
            </div>
            <div className="space-y-2.5">
              {workspaceItems.map((item) => <div key={item.name} className="rounded-xl bg-white/[0.11] px-3 py-2.5">
                <div className="flex items-center justify-between text-xs"><span className="font-medium text-white">{item.name}</span><span className="text-violet-200">{item.status}</span></div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15"><div className={`h-full rounded-full ${item.color} ${item.progress}`} /></div>
              </div>)}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-14 xl:px-20">
          <div className="w-full max-w-[25rem]">
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <img src={logoSrc} alt="Taskflow" className="h-11 w-auto object-contain" />
            </div>

            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold text-violet-700">WELCOME BACK</p>
              <h2 className="text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-[2.1rem]">Sign in to your workspace</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">Pick up right where you and your team left off.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {error && <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}

              <div className="space-y-2">
                <Label htmlFor="email" className="block text-sm leading-none font-medium text-slate-700">Work email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                  <Input id="email" type="email" {...register('email')} className={`h-12 rounded-xl border-slate-200 bg-slate-50/70 pl-11 text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-violet-500/20 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`} placeholder="you@company.com" autoComplete="email" />
                </div>
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between leading-none"><Label htmlFor="password" className="text-sm leading-none font-medium text-slate-700">Password</Label><Link to="/forgot-password" className="text-sm leading-none font-semibold text-violet-700 transition-colors hover:text-violet-900">Forgot password?</Link></div>
                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                  <Input id="password" type={showPassword ? 'text' : 'password'} {...register('password')} className={`h-12 rounded-xl border-slate-200 bg-slate-50/70 pl-11 pr-11 text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-violet-500/20 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`} placeholder="••••••••" autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-slate-400 transition-colors hover:text-slate-700" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                </div>
                {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
              </div>

              <Button type="submit" disabled={isLoading || isSubmitting} className="group h-12 w-full rounded-xl bg-[#2b2251] text-sm font-semibold text-white shadow-lg shadow-violet-950/15 transition-all duration-200 hover:bg-[#3a2d6b] hover:shadow-xl hover:shadow-violet-950/20" size="lg">{isLoading || isSubmitting ? 'Signing in...' : <>Sign in <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" /></>}</Button>

              <div className="flex items-center gap-3 py-0.5" aria-hidden="true"><div className="h-px flex-1 bg-slate-200" /><span className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">or</span><div className="h-px flex-1 bg-slate-200" /></div>

              <Button type="button" onClick={fillDemoCredentials} disabled={isLoading || isSubmitting} variant="outline" className="h-12 w-full rounded-xl border-violet-200 bg-violet-50/60 text-sm font-semibold text-violet-800 transition-all duration-200 hover:border-violet-300 hover:bg-violet-100/70 hover:text-violet-900" size="lg"><Zap className="h-4 w-4 fill-current" />Fill demo credentials</Button>
            </form>

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500"><ShieldCheck className="h-4 w-4 text-violet-500" />Your workspace is encrypted and secure.</div>
          </div>
        </section>
      </main>
    </div>
  );
}
