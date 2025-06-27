import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { OeuvresModule } from './oeuvres/oeuvres.module'
import { CategoriesModule } from './categories/categories.module'
import { UtilisateursModule } from './utilisateurs/utilisateurs.module'
import { LikesModule } from './likes/likes.module'
import { CollectionsModule } from './collections/collections.module'
import { SignalementsModule } from './signalements/signalements.module'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { EmailModule } from './email/email.module'
import { RolesModule } from './roles/roles.module'
import { ImageModule } from './image/image.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        OeuvresModule,
        CategoriesModule,
        UtilisateursModule,
        LikesModule,
        CollectionsModule,
        SignalementsModule,
        PrismaModule,
        AuthModule,
        EmailModule,
        RolesModule,
        ImageModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
