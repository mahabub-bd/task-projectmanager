import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
}

export function Logo({ className, variant = 'full' }: LogoProps) {
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' ? '/dark_logo.png' : '/light_logo.png';

  return (
    <img
      src={logoSrc}
      alt="Logo"
      className={cn(
        'h-8 w-auto object-contain transition-opacity duration-200',
        variant === 'icon' && 'h-8 w-8',
        className
      )}
    />
  );
}
