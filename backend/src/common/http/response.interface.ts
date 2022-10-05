import { Response } from "express";
import { ApplicationFailure } from "../error-handling";

export type HttpResponse<Body = any> = Response<
	Body,
	{
		result: ApplicationFailure;
	}
>;
