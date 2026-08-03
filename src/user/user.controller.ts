import {
	Body,
	Controller,
	DefaultValuePipe,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Param,
	ParseBoolPipe,
	ParseEnumPipe,
	ParseIntPipe,
	ParseUUIDPipe,
	Query,
} from "@nestjs/common";

import { GetPaginationMetaDto } from "../modules/services/helper/dto/get-pagination-meta.dto";
import { HelperService } from "../modules/services/helper/helper.service";
import { GetUserDto } from "./dto/get-user.dto";
import { GetUsersFilterDto } from "./dto/get-users-filter.dto";
import { UserOrderBy, UserService } from "./user.service";

@Controller("users")
export class UserController {
	constructor(
		private helperService: HelperService,
		private userService: UserService,
	) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async getUsers(
		@Query("page", new DefaultValuePipe(1), new ParseIntPipe())
		page: number,
		@Query("limit", new DefaultValuePipe(8), new ParseIntPipe())
		limit: number,
		@Query(
			"order",
			new DefaultValuePipe(UserOrderBy.ID),
			new ParseEnumPipe(UserOrderBy),
		)
		order: UserOrderBy,
		@Query("reverse", new DefaultValuePipe(false), new ParseBoolPipe())
		reverse: boolean,
		@Body()
		filters: GetUsersFilterDto,
	): Promise<{ data: GetUserDto[]; meta: GetPaginationMetaDto }> {
		[page, limit] = this.helperService.paginationParamsSanitize(
			page,
			limit,
		);

		const result = await this.userService.getUsers(
			page,
			limit,
			filters,
			order,
			reverse,
		);
		const count = await this.userService.getUserCount(filters);

		return {
			data: result,
			meta: {
				page: page,
				item_count: result.length,
				total_pages: Math.ceil(count / limit),
				total_items: count,
			},
		};
	}

	@Get("id/:id")
	@HttpCode(HttpStatus.OK)
	async getUser(
		@Param("id", new ParseUUIDPipe()) id: string,
	): Promise<GetUserDto> {
		const result = await this.userService.getUser(id);

		if (result) return result;

		throw new NotFoundException();
	}

	@Get("username/:username")
	@HttpCode(HttpStatus.OK)
	async getUserByUsername(
		@Param("username") username: string,
	): Promise<GetUserDto> {
		const result = await this.userService.getUserByUsername(username);

		if (result) return result;

		throw new NotFoundException();
	}

	@Get("search/username/:username")
	@HttpCode(HttpStatus.OK)
	async searchUserByUsername(
		@Param("username") username: string,
	): Promise<GetUserDto[]> {
		return await this.userService.searchUserByUsername(username);
	}

	@Get("search/displayName/:displayName")
	@HttpCode(HttpStatus.OK)
	async searchUserByDisplayName(
		@Param("displayName") displayName: string,
	): Promise<GetUserDto[]> {
		return await this.userService.searchUserByDisplayName(displayName);
	}
}
