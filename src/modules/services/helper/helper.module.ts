import { Global, Module } from "@nestjs/common";

import { HelperService } from "./helper.service";

@Global()
@Module({
	exports: [HelperService],
	providers: [HelperService],
})
export class HelperModule {}
