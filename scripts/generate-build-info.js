#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Generate build information and update the build-info.ts file
 */
function generateBuildInfo() {
  try {
    // Get git hash
    let gitHash = 'Unknown';
    let gitShortHash = 'Unknown';
    
    try {
      gitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
      gitShortHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    } catch (error) {
      console.warn('Warning: Could not get git hash:', error.message);
    }

    // Get current timestamp
    const now = new Date();
    const buildTime = now.toISOString();
    const buildDate = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });

    // Get version from package.json
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const version = packageJson.version || '1.0.0';

    // Create build info object
    const buildInfo = {
      buildTime,
      gitHash,
      gitShortHash,
      version,
      buildDate
    };

    // Generate the TypeScript file content
    const fileContent = `/**
 * Build information utility
 * This file contains build-time information that gets generated during the build process
 * 
 * Generated on: ${buildDate}
 * Git Hash: ${gitHash}
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
  buildTime: '${buildTime}',
  gitHash: '${gitHash}',
  gitShortHash: '${gitShortHash}',
  version: '${version}',
  buildDate: '${buildDate}'
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
`;

    // Write the file
    const outputPath = path.join(__dirname, '..', 'src', 'utils', 'build-info.ts');
    fs.writeFileSync(outputPath, fileContent, 'utf8');

    console.log('✅ Build info generated successfully:');
    console.log(`   Version: ${version}`);
    console.log(`   Git Hash: ${gitShortHash}`);
    console.log(`   Build Time: ${buildDate}`);
    console.log(`   Output: ${outputPath}`);

  } catch (error) {
    console.error('❌ Error generating build info:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateBuildInfo();
}

module.exports = { generateBuildInfo };
