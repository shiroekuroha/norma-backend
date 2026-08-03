import { Injectable } from "@nestjs/common";

@Injectable()
export class HelperService {
	paginationParamsSanitize(page: number, limit: number): [number, number] {
		const DEF_PAGE: number = 1;
		const DEF_LIMIT: number = 8;

		page = Number(page);
		limit = Number(limit);

		page = page < 1 ? DEF_PAGE : page;
		limit = limit < 1 ? DEF_LIMIT : limit;

		return [page, limit];
	}
}
