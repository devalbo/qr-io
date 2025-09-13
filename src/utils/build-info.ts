/**
 * Build information utility
 * This file contains build-time information that gets generated during the build process
 * 
 * Generated on: 09/13/2025, 05:20:09 PM EDT
 * Git Hash: fffe20c012f3e7f172402085990874efefffd298
 */

export interface BuildInfo {
  buildTime: string;
  gitHash: string;
  gitShortHash: string;
  version: string;
  buildDate: string;
}

// Generated build info - DO NOT EDIT MANUALLY
export const buildInfo: BuildInfo = {
  buildTime: '2025-09-13T21:20:09.764Z',
  gitHash: 'fffe20c012f3e7f172402085990874efefffd298',
  gitShortHash: 'fffe20c',
  version: '1.0.0',
  buildDate: '09/13/2025, 05:20:09 PM EDT'
};

/**
 * Get formatted build time string
 */
export const getBuildTimeString = (): string => {
  return buildInfo.buildTime;
};

/**
 * Get git hash (full)
 */
export const getGitHash = (): string => {
  return buildInfo.gitHash;
};

/**
 * Get git hash (short)
 */
export const getGitShortHash = (): string => {
  return buildInfo.gitShortHash;
};

/**
 * Get version string
 */
export const getVersion = (): string => {
  return buildInfo.version;
};

/**
 * Get build date string
 */
export const getBuildDate = (): string => {
  return buildInfo.buildDate;
};

/**
 * Get all build info
 */
export const getAllBuildInfo = (): BuildInfo => {
  return { ...buildInfo };
};
