import { useRouter } from 'expo-router';

export const useTabNavigation = () => {
  const router = useRouter();

  const navigateToTab = (tabName: string) => {
    switch (tabName) {
      case 'Import':
        router.push('/');
        break;
      case 'Export':
        router.push('/export');
        break;
      case 'Manage':
        router.push('/manage');
        break;
      case 'Settings':
        router.push('/settings');
        break;
      default:
        router.push('/');
    }
  };

  return { navigateToTab };
};
