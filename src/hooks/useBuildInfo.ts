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
        
        // Try multiple possible URLs for build info
        const possibleUrls = [
          '/qr-io/build-info.json',  // With base URL
          '/build-info.json',        // Without base URL
          './build-info.json',       // Relative path
          'build-info.json'          // Just filename
        ];
        
        let response;
        let lastError;
        
        for (const url of possibleUrls) {
          try {
            response = await fetch(url);
            if (response.ok) {
              console.log(`✅ Build info loaded from: ${url}`);
              break; // Success, stop trying other URLs
            }
          } catch (error) {
            lastError = error;
            continue; // Try next URL
          }
        }
        
        if (!response || !response.ok) {
          throw new Error(`Failed to fetch build info from any URL. Last error: ${lastError instanceof Error ? lastError.message : 'Unknown error'}`);
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
