import { Expose, Type } from "class-transformer";
import { IsDate, IsOptional, IsString, IsUUID } from "class-validator";

export class GetUserDto {
	@Expose()
	@IsUUID()
	id!: string;

	@Expose()
	@IsString()
	username!: string;

	@Expose()
	@IsOptional()
	@IsString()
	avatarPath?: string;

	@Expose()
	@IsString()
	displayName!: string;

	@Expose()
	@IsOptional()
	@IsString()
	email?: string;

	@Expose()
	@Type(() => Date)
	@IsDate()
	createdAt!: Date;

	@Expose()
	@Type(() => Date)
	@IsDate()
	updatedAt!: Date;

	@Expose()
	@IsOptional()
	@Type(() => Date)
	@IsDate()
	deletedAt?: Date;
}
