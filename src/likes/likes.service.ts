import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LikesDto } from './dto';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  async getAllLikes() {
    return this.prisma.likes.findMany({});
  }

  async createLike(likeDto: LikesDto) {
    return this.prisma.likes.create({
      data: {
        id_utilisateur: likeDto.id_utilisateur,
        id_oeuvre: likeDto.id_oeuvre,
      },
    });
  }

  async editLike(likeDto: LikesDto) {
    return this.prisma.likes.update({
      where: {
        id_like: likeDto.id_like,
      },
      data: {
        id_utilisateur: likeDto.id_utilisateur,
        id_oeuvre: likeDto.id_oeuvre,
      },
    });
  }

  async deleteLike(id_like: number) {
    return this.prisma.likes.delete({
      where: {
        id_like,
      },
    });
  }
}
