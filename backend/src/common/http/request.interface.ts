import { Request } from "express";

export type HttpRequest<Body = any> = Request<any, any, Body>;
