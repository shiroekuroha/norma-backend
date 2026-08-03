import * as bcrypt from "bcrypt";
import { plainToInstance } from "class-transformer";

import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

import { PrismaService } from "../modules/services/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { GetUserDto } from "./dto/get-user.dto";
import { GetUsersFilterDto } from "./dto/get-users-filter.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

export enum UserOrderBy {
	ID = "id",
	USERNAME = "username",
	DISPLAY_NAME = "displayName",
	EMAIL = "email",
	CREATED_AT = "createdAt",
	UPDATED_AT = "updatedAt",
}

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		private configService: ConfigService,
	) {}

	async getUsers(
		page: number,
		limit: number,
		filters: GetUsersFilterDto,
		order: UserOrderBy,
		reverse: boolean,
		override: boolean = false,
	): Promise<GetUserDto[]> {
		return plainToInstance(
			GetUserDto,
			await this.prisma.user.findMany({
				where: {
					displayName: filters.displayNameMatching
						? {
								contains: filters.displayNameMatching,
								mode: "insensitive",
							}
						: undefined,
					email: filters.emailMatching
						? {
								contains: filters.emailMatching,
								mode: "insensitive",
							}
						: undefined,
					createdAt:
						filters.createdAfter || filters.createdBefore
							? {
									gte: filters.createdAfter ?? undefined,
									lte: filters.createdBefore ?? undefined,
								}
							: undefined,
					deletedAt: override ? undefined : null,
				},
				skip: (page - 1) * limit,
				take: limit,
				orderBy: {
					id:
						order == UserOrderBy.ID
							? reverse
								? "desc"
								: "asc"
							: undefined,
					username:
						order == UserOrderBy.USERNAME
							? reverse
								? "desc"
								: "asc"
							: undefined,
					displayName:
						order == UserOrderBy.DISPLAY_NAME
							? reverse
								? "desc"
								: "asc"
							: undefined,
					email:
						order == UserOrderBy.EMAIL
							? reverse
								? "desc"
								: "asc"
							: undefined,
					createdAt:
						order == UserOrderBy.CREATED_AT
							? reverse
								? "desc"
								: "asc"
							: undefined,
					updatedAt:
						order == UserOrderBy.UPDATED_AT
							? reverse
								? "desc"
								: "asc"
							: undefined,
				},
			}),
			{ excludeExtraneousValues: true },
		);
	}

	async getUserCount(
		filters: GetUsersFilterDto,
		override: boolean = false,
	): Promise<number> {
		return await this.prisma.user.count({
			where: {
				displayName: filters.displayNameMatching
					? {
							contains: filters.displayNameMatching,
							mode: "insensitive",
						}
					: undefined,
				email: filters.emailMatching
					? {
							contains: filters.emailMatching,
							mode: "insensitive",
						}
					: undefined,
				createdAt:
					filters.createdAfter || filters.createdBefore
						? {
								gte: filters.createdAfter ?? undefined,
								lte: filters.createdBefore ?? undefined,
							}
						: undefined,
				deletedAt: override ? undefined : null,
			},
		});
	}

	async getUser(
		id: string,
		override: boolean = false,
	): Promise<GetUserDto | null> {
		return plainToInstance(
			GetUserDto,
			await this.prisma.user.findUnique({
				where: { id: id, deletedAt: override ? undefined : null },
			}),
			{ excludeExtraneousValues: true },
		);
	}

	async getUserByUsername(
		username: string,
		override: boolean = false,
	): Promise<GetUserDto | null> {
		return plainToInstance(
			GetUserDto,
			await this.prisma.user.findFirst({
				where: {
					username: username,
					deletedAt: override ? undefined : null,
				},
			}),
			{ excludeExtraneousValues: true },
		);
	}

	async searchUserByUsername(
		partialUsername: string,
		override: boolean = false,
	): Promise<GetUserDto[]> {
		return plainToInstance(
			GetUserDto,
			await this.prisma.user.findMany({
				where: {
					username: {
						contains: partialUsername,
						mode: "insensitive",
					},
					deletedAt: override ? undefined : null,
				},
			}),
			{ excludeExtraneousValues: true },
		);
	}

	async searchUserByDisplayName(
		partialDisplayName: string,
		override: boolean = false,
	): Promise<GetUserDto[]> {
		return plainToInstance(
			GetUserDto,
			await this.prisma.user.findMany({
				where: {
					displayName: {
						contains: partialDisplayName,
						mode: "insensitive",
					},
					deletedAt: override ? undefined : null,
				},
			}),
			{ excludeExtraneousValues: true },
		);
	}

	async updateUser(
		id: string,
		data: UpdateUserDto,
		override: boolean = false,
	): Promise<GetUserDto> {
		const { username, email, password, ...rest } = data;

		return plainToInstance(
			GetUserDto,
			await this.prisma.$transaction(async (prisma) => {
				try {
					const current = await prisma.user.findUniqueOrThrow({
						where: {
							id: id,
							deletedAt: override ? undefined : null,
						},
					});

					if (username && current.username != username)
						if (
							(await prisma.user.findFirst({
								where: { username: username, deletedAt: null },
							})) != null
						)
							throw new ConflictException(
								"Username already used by another account.",
							);

					if (email && current.email != email)
						if (
							(await prisma.user.findFirst({
								where: { email: email, deletedAt: null },
							})) != null
						)
							throw new ConflictException(
								"Email already used by another account.",
							);

					// TODO: Validate avatarPath

					return prisma.user.update({
						where: { id: id },
						data: {
							...rest,
							username: username,
							email: email,
							passwordHash: password
								? await bcrypt.hash(
										password,
										this.configService.get<number>(
											"BCRYPT_SALT",
										) ?? 16,
									)
								: undefined,
						},
					});
				} catch (error) {
					if (
						error instanceof PrismaClientKnownRequestError &&
						error.code === "P2025"
					) {
						throw new BadRequestException("ID doesn't exist.");
					}

					throw error;
				}
			}),
			{
				excludeExtraneousValues: true,
			},
		);
	}

	async createUser(data: CreateUserDto): Promise<GetUserDto> {
		if (
			await this.prisma.user.findFirst({
				where: { username: data.username, deletedAt: null },
			})
		)
			throw new ConflictException("Username existed.");

		if (
			await this.prisma.user.findFirst({
				where: { email: data.email, deletedAt: null },
			})
		)
			throw new ConflictException("Email existed.");

		return plainToInstance(
			GetUserDto,
			await this.prisma.$transaction(async (prisma) => {
				const { password, ...rest } = data;

				return prisma.user.create({
					data: {
						...rest,
						passwordHash: await bcrypt.hash(
							password,
							this.configService.get<number>("BCRYPT_SALT") ?? 16,
						),
					},
				});
			}),
			{
				excludeExtraneousValues: true,
			},
		);
	}

	async deleteUser(id: string): Promise<GetUserDto> {
		return plainToInstance(
			GetUserDto,
			await this.prisma.$transaction(async (prisma) => {
				if (
					!(await this.prisma.user.findUnique({ where: { id: id } }))
				) {
					throw new NotFoundException(
						"Cannot find user with that ID.",
					);
				}

				return prisma.user.update({
					where: { id: id },
					data: {
						deletedAt: new Date(),
					},
				});
			}),
			{ excludeExtraneousValues: true },
		);
	}
}
