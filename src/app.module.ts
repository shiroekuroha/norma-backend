import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { WrapperInterceptor } from "./modules/interceptor/wrapper.interceptor";
import { HelperModule } from "./modules/services/helper/helper.module";
import { PrismaModule } from "./modules/services/prisma/prisma.module";
import { UserModule } from "./user/user.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		UserModule,
		HelperModule,
		PrismaModule,
	],
	controllers: [AppController],
	providers: [AppService, WrapperInterceptor],
})
export class AppModule {}
