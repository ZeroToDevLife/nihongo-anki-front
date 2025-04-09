import React, { ChangeEvent, useEffect, useState } from 'react';
import './style.css';
import InputBox from 'src/components/InputBox';
import { AuthPage } from 'src/types/aliases';
import { useCookies } from 'react-cookie';
import { signInRequest } from 'src/apis';
import { useNavigate } from 'react-router';
import { ResponseDto } from 'src/apis/dto/response';
import { SignInResponseDto } from 'src/apis/dto/response/auth';
import { ACCESS_TOKEN, AUTH_EMAIL_ABSOLUTE_PATH, MAIN_ABSOLUTE_PATH, ROOT_PATH } from 'src/constants';
import { SignInRequestDto } from 'src/apis/dto/request/auth';
import verifyEmailStore from 'src/stores/verify-email.store';

interface Props {
  onPageChange: (page: AuthPage) => void;
}

export default function SignIn(props: Props) {
  const { onPageChange } = props;

  const [_, setCookie] = useCookies();
  const { setVerified } = verifyEmailStore();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailMessage, setEmailMessage] = useState<string>('');
  const [passwordMessage, setPasswordMessage] = useState<string>('');

  const navigator = useNavigate();

  const signInResponse = (responseBody: SignInResponseDto | ResponseDto | null) => {
    const message = !responseBody
      ? '서버에 문제가 있습니다'
      : responseBody.code === 'DBE'
      ? '서버에 문제가 있습니다'
      : responseBody.code === 'AF'
      ? '로그인 정보가 일치하지 않습니다'
      : responseBody.code === 'SF'
      ? '로그인 정보가 일치하지 않습니다'
      : '';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccess) {
      setPasswordMessage(message);
      return;
    }

    const { accessToken, expiration, isVerified: verified } = responseBody as SignInResponseDto;
    const expires = new Date(Date.now() + expiration * 1000);
    setCookie(ACCESS_TOKEN, accessToken, { path: ROOT_PATH, expires });
    setVerified(verified);

    navigator(verified ? MAIN_ABSOLUTE_PATH : AUTH_EMAIL_ABSOLUTE_PATH);
  };

  const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEmail(value);
  };

  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value);
  };

  const onLoginButtonClickHandler = () => {
    if (!email) setEmailMessage('이메일을 입력해주세요.');
    if (!password) setPasswordMessage('비밀번호를 입력해주세요.');
    if (!email || !password) return;

    const requestBody: SignInRequestDto = {
      email,
      password,
    };
    signInRequest(requestBody).then(signInResponse);
  };

  useEffect(() => {
    setEmailMessage('');
    setPasswordMessage('');
  }, [email, password]);

  return (
    <div id='auth-login-container'>
      <div className='header-container'>
        <div className='title'>Nihongo Anki</div>
        <div className='description'>로그인하여 학습을 시작하세요</div>
      </div>
      <div className='input-container'>
        <InputBox
          type={'text'}
          label={'이메일'}
          value={email}
          placeholder={'이메일을 입력해주세요.'}
          message={emailMessage}
          isErrorMessage
          onChange={onEmailChangeHandler}
        />

        <InputBox
          type={'password'}
          label={'비밀번호'}
          value={password}
          placeholder={'비밀번호를 입력해주세요.'}
          message={passwordMessage}
          isErrorMessage
          onChange={onPasswordChangeHandler}
        />
      </div>
      <div className='button-container'>
        <div className='button primary fullwidth' onClick={onLoginButtonClickHandler}>
          로그인
        </div>
        <div className='divider'></div>
        <div className='footer'>
          계정이 없으신가요?
          <span className='link' onClick={() => onPageChange('sign-up')}>
            회원가입
          </span>
        </div>
      </div>
    </div>
  );
}
