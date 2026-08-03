import { Expose } from "class-transformer";
import { IsNumber } from "class-validator";

export class GetPaginationMetaDto {
	@Expose()
	@IsNumber()
	page!: number;

	@Expose()
	@IsNumber()
	item_count!: number;

	@Expose()
	@IsNumber()
	total_pages!: number;

	@Expose()
	@IsNumber()
	total_items!: number;
}
