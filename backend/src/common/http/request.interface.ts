import { Request } from "express";

export interface HttpRequest<Body = any> extends Request<any, any, Body> {}
