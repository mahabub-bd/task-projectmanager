import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/store/authHooks';


export function useOrganizationLogo() {
  const { user } = useAuth();
  const { theme } = useTheme();

  const getLogoUrl = (): string | null => {
    if (theme === 'dark' && user?.organization_dark_logo) {
      return user.organization_dark_logo;
    }
    if (theme === 'light' && user?.organization_light_logo) {
      return user.organization_light_logo;
    }
    // Fallback to generic logo if available
    return user?.organization_logo || null;
  };

  const logoUrl = getLogoUrl();
  const hasThemeSpecificLogos = user?.organization_light_logo || user?.organization_dark_logo;

  return {
    logoUrl,
    hasThemeSpecificLogos,
    organizationName: user?.organization_name || null,
  };
}
