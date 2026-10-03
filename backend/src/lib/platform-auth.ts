import fs from 'fs';
import path from 'path';

const KNOWN_MASTER_KEY = 'gkp_master_9af635dfdd4fded05d3d83be59deb172e5c6d68fff5ae4fb';

/**
 * Returns the currently active Platform Master Authority Key
 */
export function getPlatformMasterKey(): string {
  // 1. Check process.env
  if (process.env.PLATFORM_MASTER_KEY && process.env.PLATFORM_MASTER_KEY.trim()) {
    return process.env.PLATFORM_MASTER_KEY.trim();
  }

  // 2. Look for .platform_key file in multiple likely locations
  const possibleKeyFiles = [
    path.resolve(process.cwd(), 'data', '.platform_key'),
    path.resolve(process.cwd(), 'backend', 'data', '.platform_key'),
    '/home/krishna_chouhan/projects/goankipathsala/backend/data/.platform_key',
  ];

  for (const filePath of possibleKeyFiles) {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8').trim();
        if (content) return content;
      }
    } catch (e) {}
  }

  // 3. Look for .env file in multiple likely locations
  const possibleEnvFiles = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), 'backend', '.env'),
    '/home/krishna_chouhan/projects/goankipathsala/backend/.env',
  ];

  for (const envFile of possibleEnvFiles) {
    try {
      if (fs.existsSync(envFile)) {
        const envContent = fs.readFileSync(envFile, 'utf-8');
        const match = envContent.match(/PLATFORM_MASTER_KEY=["']?([^"'\r\n]+)["']?/);
        if (match && match[1]) {
          return match[1].trim();
        }
      }
    } catch (e) {}
  }

  return KNOWN_MASTER_KEY;
}

/**
 * Saves the Platform Master Key to data/.platform_key as a persistent fallback
 */
export function savePlatformMasterKeyFile(newKey: string) {
  const targetPaths = [
    path.resolve(process.cwd(), 'data', '.platform_key'),
    path.resolve(process.cwd(), 'backend', 'data', '.platform_key'),
  ];

  for (const targetPath of targetPaths) {
    try {
      const dir = path.dirname(targetPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(targetPath, newKey.trim(), 'utf-8');
    } catch (err) {}
  }
}
