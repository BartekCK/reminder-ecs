import { Response } from "express";

export interface HttpResponse<Body> extends Response<Body> {}
