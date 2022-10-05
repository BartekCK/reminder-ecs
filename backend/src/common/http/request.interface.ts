import { Request } from "express";
import { Query } from "express-serve-static-core";

export type HttpRequest<Body = any, Params = any, Q = Query> = Request<
	Params,
	any,
	Body,
	Q
>;
