import axios, { AxiosError, AxiosResponse } from 'axios';
import ResponseDto from './dto/response/response.dto';
import {
  EmailAuthSendRequestDto,
  EmailAuthVerifyRequestDto,
  EmailCheckRequestDto,
  SignInRequestDto,
  SignUpRequestDto,
} from './dto/request/auth';
import { SignInResponseDto } from './dto/response/auth';

const API_DOMAIN = process.env.REACT_APP_API_DOMAIN;

const AUTH_MODULE_URL = `${API_DOMAIN}/api/v1/auth`;

const EMAIL_CHECK_URL = `${AUTH_MODULE_URL}/email-check`;
const SIGN_IN_URL = `${AUTH_MODULE_URL}/sign-in`;
const SIGN_UP_URL = `${AUTH_MODULE_URL}/sign-up`;

const bearerAuthorization = (accessToken: string) => ({
  headers: { Authorization: `Bearer ${accessToken}` },
});

const responseSuccessHandler = <T = ResponseDto>(response: AxiosResponse<T>) => {
  const { data } = response;
  return data;
};

const responseErrorHandler = (error: AxiosError<ResponseDto>) => {
  if (!error.response) return null;
  const { data } = error.response;
  return data;
};

export const emailCheckRequest = async (requestBody: EmailCheckRequestDto) => {
  const responseBody = await axios
    .post(EMAIL_CHECK_URL, requestBody)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

export const signInRequest = async (requestBody: SignInRequestDto) => {
  const responseBody = await axios
    .post(SIGN_IN_URL, requestBody)
    .then(responseSuccessHandler<SignInResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

export const signUpRequest = async (requestBody: SignUpRequestDto) => {
  const responseBody = await axios
    .post(SIGN_UP_URL, requestBody)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

export const emailAuthSendRequest = async (requestBody: EmailAuthSendRequestDto, accessToken: string) => {
  const responseBody = await axios
    .post('/api/v1/auth/send-email', requestBody, bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};

export const emailAuthVerifyRequest = async (requestBody: EmailAuthVerifyRequestDto, accessToken: string) => {
  const responseBody = await axios
    .post('/api/v1/auth/verify-email', requestBody, bearerAuthorization(accessToken))
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  return responseBody;
};
