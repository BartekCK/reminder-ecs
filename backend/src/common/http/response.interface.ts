import { Response } from "express";

export type HttpResponse<Body = any> = Response<Body>;
