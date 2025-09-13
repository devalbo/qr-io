import { useState, useEffect } from 'react';

export interface BuildInfo {
  buildTime: string;
  gitHash: string;
  gitShortHash: string;
  version: string;
  buildDate: string;
}

interface UseBuildInfoReturn {
  buildInfo: BuildInfo | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch build information from the deployed JSON file
 */
export const useBuildInfo = (): UseBuildInfoReturn => {
  const [buildInfo, setBuildInfo] = useState<BuildInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBuildInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from the public directory
        const response = await fetch('/build-info.json');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch build info: ${response.status}`);
        }
        
        const data: BuildInfo = await response.json();
        setBuildInfo(data);
      } catch (err) {
        console.warn('Could not fetch build info:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        // Fallback to default values
        setBuildInfo({
          buildTime: 'Unknown',
          gitHash: 'Unknown',
          gitShortHash: 'Unknown',
          version: '1.0.0',
          buildDate: 'Unknown'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBuildInfo();
  }, []);

  return { buildInfo, loading, error };
};
