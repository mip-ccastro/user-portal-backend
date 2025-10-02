/* eslint-disable @typescript-eslint/no-magic-numbers */

import { Request as ExpressRequest, Response as ExpressResponse } from "express";
import { TUserToken } from "./types/auth.types";

export const SIXTY = 60 as const;
export const ONE_HUNDRED = 100 as const;
export const ONE_THOUSAND = 1000 as const;

export enum HttpCode {
	OK = 200,
	CREATED = 201,
	NO_CONTENT = 204,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	INTERNAL_SERVER_ERROR = 500
}

export const CUSTOM_HEADERS = ['x-auth-token','x-access-token', 'x-refresh-token', 'x-id-token'];

export interface Request extends ExpressRequest {
    user?: TUserToken;
    lang?: string;
    client_ip?: string | null;
}

export interface Response extends ExpressResponse {}

export const X_ACCESS_TOKEN = 'x-access-token';
export const X_REFRESH_TOKEN = 'x-refresh-token';
export const X_ID_TOKEN = 'x-id-token';
export const X_AUTH_TOKEN = 'x-auth-token';