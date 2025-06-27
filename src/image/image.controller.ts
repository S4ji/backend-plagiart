import {
    Controller,
    UseInterceptors,
    UploadedFile,
    Post,
    Param,
    Get,
    Res,
    Req,
    ForbiddenException,
    BadRequestException,
} from '@nestjs/common'
import { ImageService } from './image.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { basename, extname, join, resolve } from 'path'
import { existsSync, createReadStream } from 'fs'
import { Response, Request } from 'express'
import * as fs from 'fs'
import * as sharp from 'sharp'

@Controller('image')
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    @Post('/upload/:route')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: (req, file, callback) => {
                    const route = req.params.route
                    const uploadPath = resolve(process.cwd(), 'uploads', route)

                    if (!fs.existsSync(uploadPath)) {
                        fs.mkdirSync(uploadPath, { recursive: true })
                    }

                    callback(null, uploadPath)
                },
                filename: (req, file, callback) => {
                    const uniqueSuffix =
                        Date.now() + '-' + Math.round(Math.random() * 1e9)
                    const ext = extname(file.originalname)
                    const baseName = basename(file.originalname, ext)

                    const sanitizedBaseName = baseName
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/[^a-zA-Z0-9-_]/g, '')

                    callback(null, `${sanitizedBaseName}-${uniqueSuffix}${ext}`)
                },
            }),
            limits: {
                fileSize: 10 * 1024 * 1024,
            },
            fileFilter: (req, file, callback) => {
                const allowedMimeTypes = [
                    'image/jpeg',
                    'image/png',
                    'image/jpg',
                    'image/webp',
                ]
                if (!allowedMimeTypes.includes(file.mimetype)) {
                    return callback(
                        new BadRequestException(
                            'Seuls les fichiers PDF et JPG/PNG sont acceptés'
                        ),
                        false
                    )
                }
                callback(null, true)
            },
        })
    )
    async uploadFile(
        @Param('route') route: string,
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request
    ) {
        const isImage = [
            'image/jpeg',
            'image/png',
            'image/jpg',
            'image/webp',
        ].includes(file.mimetype)

        console.log(file.path, isImage)
        if (isImage) {
            const avifPath = file.path.replace(extname(file.path), '.avif')

            try {
                await Promise.all([
                    sharp(file.path)
                        .rotate()
                        .resize(1024)
                        .avif({ quality: 90 })
                        .toFile(avifPath),
                ])

                fs.unlinkSync(file.path)

                const cleanName = file.filename
                    .replaceAll('.jpeg', '')
                    .replaceAll('.png', '')
                    .replaceAll('.jpg', '')
                    .replaceAll('.webp', '')
                return {
                    url: `${process.env.API_URL}/image/view/${route}/${cleanName}.avif`,
                }
            } catch (error) {
                console.error(error)
                throw new BadRequestException(error)
            }
        }
    }
    @Get('/view/:folder/:filename')
    viewImage(
        @Param('folder') folder: string,
        @Param('filename') filename: string,
        @Res() res: Response
    ) {
        const filePath = join(
            __dirname,
            '..',
            '..',
            `uploads/${folder}`,
            filename
        )

        if (existsSync(filePath)) {
            const fileStream = createReadStream(filePath)
            fileStream.pipe(res)
        } else {
            res.status(404).json({ message: 'Image not found' })
        }
    }
}
