import { CheckCircle2, XCircle } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export const getUserInitials = (name: string): string => {
  if (!name) return 'NA';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return words.slice(0, 2).map(word => word[0]).join('').toUpperCase();
};

export const getUserAvatarColor = (name: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-cyan-500',
    'bg-amber-500',
    'bg-red-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const getUserStatusConfig = (isActive: boolean): {
  label: string;
  color: string;
  textColor: string;
  icon: LucideIcon;
  variant: 'default' | 'secondary';
} => {
  return {
    label: isActive ? 'Active' : 'Inactive',
    color: isActive ? 'bg-green-500' : 'bg-gray-500',
    textColor: isActive ? 'text-green-500' : 'text-gray-500',
    icon: isActive ? CheckCircle2 : XCircle,
    variant: isActive ? 'default' : 'secondary',
  };
};
