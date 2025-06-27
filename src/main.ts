import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.enableCors({
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        origin: 'http://localhost:3000', // replace with your frontend URL/port
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
