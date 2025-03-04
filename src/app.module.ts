import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { ArticleModule } from './article/article.module';
import { FollowModule } from './follow/follow.module';
import { ChatModule } from './chat/chat.module';
import { ChatGateway } from './sockets/socket/socket.gateway';
import { PrismaService } from './prisma.service';
import { AgoraModule } from './agora/agora.module';
import { AgoraService } from './agora/agora.service';
@Module({
  imports: [
    UsersModule,
    PostModule,
    AuthModule,
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
      envFilePath: '.env',
    }),
    ArticleModule,
    FollowModule,
    ChatModule,
    AgoraModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway, PrismaService, AgoraService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
