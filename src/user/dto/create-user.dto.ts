import { Expose } from "class-transformer";
import {
	IsEmail,
	IsOptional,
	IsString,
	Length,
	Matches,
} from "class-validator";

export class CreateUserDto {
	@Expose()
	@IsString()
	@Length(8, 128)
	@Matches(/^[a-z][a-z0-9-]+[a-z0-9]$/, {
		message:
			'Username must start with a letter, and end with a number or letter. Symbol "-" can be use. Username length must be between 8 and 128.',
	})
	username!: string;

	@Expose()
	@IsString()
	@Length(8, 128)
	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?:|_\-+=~`]).+$/, {
		message:
			"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character. Password length must be between 8 and 128.",
	})
	password!: string;

	@Expose()
	@IsOptional()
	@IsString()
	avatarPath?: string;

	@Expose()
	@IsString()
	@Length(2, 128)
	@Matches(/^[a-zA-Z][a-zA-Z0-9\ \']+[a-zA-Z0-9]+$/, {
		message:
			"Display Name length must be between 8 and 128. Start and end with number or letter, can have space and \' in it.",
	})
	displayName!: string;

	@Expose()
	@IsString()
	@IsEmail()
	email!: string;
}
