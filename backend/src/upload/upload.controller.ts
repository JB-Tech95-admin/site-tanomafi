import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { Request } from 'express';

// Ensure uploads folder exists
const uploadDir = './uploads';
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

@Controller('api/upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: uploadDir,
        filename: (req, file, cb) => {
          const randomName = Array(16)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${Date.now()}-${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|svg\+xml)$/)) {
          return cb(
            new BadRequestException('Format sary tsy ekena (Seuls JPG, PNG, WEBP, GIF sont acceptés)'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
  )
  uploadFile(@UploadedFile() file: any, @Req() req: Request) {
    if (!file) {
      throw new BadRequestException('Tsy nisy sary voafidy (Aucun fichier sélectionné)');
    }
    const host = req.get('host');
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const baseUrl = process.env.BACKEND_URL || `${protocol}://${host}`;
    const url = `${baseUrl}/uploads/${file.filename}`;
    return {
      success: true,
      url,
      filename: file.filename,
    };
  }
}

