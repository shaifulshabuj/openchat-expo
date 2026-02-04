import { Injectable, BadRequestException } from '@nestjs/common';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';
import { randomBytes } from 'crypto';

export interface UploadedMedia {
  url: string;
  type: 'image' | 'video' | 'file' | 'voice';
  size: number;
  thumbnail?: string;
  duration?: number; // For video/voice in seconds (placeholder)
  mimeType: string;
  originalName: string;
}

@Injectable()
export class MediaService {
  private readonly uploadDir = join(process.cwd(), 'uploads');

  // File type validation
  private readonly allowedTypes = {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    video: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
    file: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip',
    ],
    voice: ['audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/x-m4a'],
  };

  // File size limits (bytes)
  private readonly sizeLimits = {
    image: 10 * 1024 * 1024, // 10MB
    video: 100 * 1024 * 1024, // 100MB
    file: 50 * 1024 * 1024, // 50MB
    voice: 10 * 1024 * 1024, // 10MB
  };

  constructor() {
    // Initialize upload directories
    this.initializeDirectories();
  }

  /**
   * Initialize upload directories
   */
  private async initializeDirectories() {
    const dirs = ['images', 'videos', 'files', 'voices', 'thumbnails'];

    for (const dir of dirs) {
      const path = join(this.uploadDir, dir);
      if (!existsSync(path)) {
        await mkdir(path, { recursive: true });
      }
    }
  }

  /**
   * Upload media file
   */
  async uploadMedia(
    file: Express.Multer.File,
    userId: string,
  ): Promise<UploadedMedia> {
    // 1. Determine media type
    const mediaType = this.getMediaType(file.mimetype);
    if (!mediaType) {
      throw new BadRequestException('Unsupported file type');
    }

    // 2. Validate file size
    this.validateFileSize(file.size, mediaType);

    // 3. Generate secure filename
    const filename = this.generateFilename(file.originalname);

    // 4. Get date-based folder path
    const datePath = this.getDatePath();

    // 5. Create directory path
    const typeDir = this.getTypeDirectory(mediaType);
    const fullDir = join(this.uploadDir, typeDir, datePath);

    if (!existsSync(fullDir)) {
      await mkdir(fullDir, { recursive: true });
    }

    // 6. Save file
    const filePath = join(fullDir, filename);
    await writeFile(filePath, file.buffer);

    // 7. Generate thumbnail for images
    let thumbnailUrl: string | undefined;
    if (mediaType === 'image') {
      thumbnailUrl = await this.generateThumbnail(file.buffer, filename, datePath);
    }

    // 8. Build URL
    const url = `/uploads/${typeDir}/${datePath}/${filename}`;

    return {
      url,
      type: mediaType,
      size: file.size,
      thumbnail: thumbnailUrl,
      duration: undefined, // Placeholder for video/voice (requires ffmpeg)
      mimeType: file.mimetype,
      originalName: file.originalname,
    };
  }

  /**
   * Determine media type from MIME type
   */
  private getMediaType(
    mimeType: string,
  ): 'image' | 'video' | 'file' | 'voice' | null {
    for (const [type, mimes] of Object.entries(this.allowedTypes)) {
      if (mimes.includes(mimeType)) {
        return type as 'image' | 'video' | 'file' | 'voice';
      }
    }
    return null;
  }

  /**
   * Validate file size
   */
  private validateFileSize(size: number, type: keyof typeof this.sizeLimits) {
    const limit = this.sizeLimits[type];
    if (size > limit) {
      throw new BadRequestException(
        `File size exceeds limit of ${limit / (1024 * 1024)}MB for ${type}`,
      );
    }
  }

  /**
   * Generate secure random filename
   */
  private generateFilename(originalName: string): string {
    const ext = originalName.split('.').pop() || '';
    const randomName = randomBytes(16).toString('hex');
    return `${randomName}.${ext}`;
  }

  /**
   * Get date-based path (YYYY/MM)
   */
  private getDatePath(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}/${month}`;
  }

  /**
   * Get type-specific directory
   */
  private getTypeDirectory(type: string): string {
    const map: Record<string, string> = {
      image: 'images',
      video: 'videos',
      file: 'files',
      voice: 'voices',
    };
    return map[type] || 'files';
  }

  /**
   * Generate thumbnail for images
   */
  private async generateThumbnail(
    buffer: Buffer,
    filename: string,
    datePath: string,
  ): Promise<string> {
    const thumbnailDir = join(this.uploadDir, 'thumbnails', datePath);

    if (!existsSync(thumbnailDir)) {
      await mkdir(thumbnailDir, { recursive: true });
    }

    const thumbnailPath = join(thumbnailDir, filename);

    // Generate 300x300 thumbnail with 80% quality
    await sharp(buffer)
      .resize(300, 300, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);

    return `/uploads/thumbnails/${datePath}/${filename}`;
  }
}
