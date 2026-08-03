import { Expose, Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

export class GetUsersFilterDto {
	@Expose()
	@IsOptional()
	@IsString()
	displayNameMatching?: string;

	@Expose()
	@IsOptional()
	@IsString()
	emailMatching?: string;

	@Expose()
	@IsOptional()
	@Type(() => Date)
	@IsDate()
	createdAfter?: Date;

	@Expose()
	@IsOptional()
	@Type(() => Date)
	@IsDate()
	createdBefore?: Date;
}
