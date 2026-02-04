import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  /**
   * Upload any media file
   * POST /media/upload
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Get userId from request (assuming JWT auth middleware)
    const userId = req.user?.id || 'anonymous';

    const result = await this.mediaService.uploadMedia(file, userId);

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Upload image only
   * POST /media/upload-image
   */
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate it's an image
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('File must be an image');
    }

    const userId = req.user?.id || 'anonymous';

    const result = await this.mediaService.uploadMedia(file, userId);

    return {
      success: true,
      data: result,
    };
  }
}
