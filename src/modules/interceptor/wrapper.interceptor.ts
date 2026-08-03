import { catchError, map, Observable } from "rxjs";

import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";

@Injectable()
export class WrapperInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const req = context.switchToHttp().getRequest();
		const now = new Date();

		return next.handle().pipe(
			map((data) => {
				const res = context.switchToHttp().getResponse();
				const { meta, ...result } = data ?? {};

				if (res.statusCode >= 200 && res.statusCode < 300) {
					data = {
						method: req.method,
						route: req.originalUrl,
						status: res.statusCode,
						success: true,
						data: data.data ?? data,
						meta: {
							...(meta ?? {}),
						},
					};
				} else {
					data = {
						method: req.method,
						route: req.originalUrl,
						status: res.statusCode,
						success: false,
						error: catchError((error) => error),
						meta: {},
					};
				}
				return data;
			}),
		);
	}
}
