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
import { AgoraModule } from './agora/agora.module';
import { AgoraService } from './agora/agora.service';
import { CallModule } from './call/call.module';
import { CallService } from './call/call.service';
import { PrismaModule } from './prisma/prisma.module';
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
    CallModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway, AgoraService, CallService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
