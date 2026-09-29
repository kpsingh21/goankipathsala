import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Ensure uploads directory exists
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * Handle Desktop File Upload (Images, Videos, PDFs)
 * Accepts base64 encoded payload: { fileName: string, fileData: string }
 */
export async function handleFileUpload(req: Request, res: Response) {
  try {
    const { fileName, fileData } = req.body;

    if (!fileName || !fileData) {
      return res.status(400).json({ error: 'fileName and fileData (base64) are required.' });
    }

    // Extract mime type and base64 buffer
    let mimeType = '';
    let base64Content = fileData;

    if (fileData.startsWith('data:')) {
      const matches = fileData.match(/^data:([A-Za-z-+/0-9]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        mimeType = matches[1];
        base64Content = matches[2];
      }
    }

    const buffer = Buffer.from(base64Content, 'base64');

    // Max 25 MB
    const MAX_SIZE = 25 * 1024 * 1024;
    if (buffer.length > MAX_SIZE) {
      return res.status(400).json({ error: 'File size exceeds 25 MB limit.' });
    }

    // Generate safe, unique filename
    const ext = path.extname(fileName) || (mimeType.includes('png') ? '.png' : mimeType.includes('jpeg') ? '.jpg' : mimeType.includes('mp4') ? '.mp4' : '.bin');
    const randomHash = crypto.randomBytes(8).toString('hex');
    const safeBaseName = path.basename(fileName, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
    const uniqueFileName = `${Date.now()}_${safeBaseName}_${randomHash}${ext}`;

    const targetFilePath = path.join(UPLOADS_DIR, uniqueFileName);
    fs.writeFileSync(targetFilePath, buffer);

    const relativeUrl = `/uploads/${uniqueFileName}`;

    return res.status(201).json({
      message: 'File uploaded successfully from desktop.',
      url: relativeUrl,
      fileName: uniqueFileName,
      sizeBytes: buffer.length,
      mimeType: mimeType || 'application/octet-stream',
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return res.status(500).json({ error: error.message || 'File upload failed.' });
  }
}
