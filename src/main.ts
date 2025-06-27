import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.enableCors({
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        origin:
            process.env.FRONT_URL || 'https://front-end-plagiart.vercel.app',
        credentials: true,
    })
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        })
    )
    await app.listen(process.env.PORT || 3300)
}
bootstrap()
