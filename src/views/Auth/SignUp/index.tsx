import React, { ChangeEvent, useEffect, useState } from 'react';
import './style.css';
import { AuthPage } from 'src/types/aliases';
import { useCookies } from 'react-cookie';
import verifyEmailStore from 'src/stores/verify-email.store';
import { ResponseDto } from 'src/apis/dto/response';
import { EmailCheckRequestDto, SignUpRequestDto } from 'src/apis/dto/request/auth';
import { emailCheckRequest, signUpRequest } from 'src/apis';
import InputBox from 'src/components/InputBox';

interface Props {
  onPageChange: (page: AuthPage) => void;
}

export default function SignUp(props: Props) {
  const { onPageChange } = props;

  const [cookie, _, removeCookie] = useCookies();

  const { isVerified, setVerified } = verifyEmailStore();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordCheck, setPasswordCheck] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');

  const [emailMessage, setEmailMessage] = useState<string>('');
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [passwordCheckMessage, setPasswordCheckMessage] = useState<string>('');
  const [nicknameMessage, setNicknameMessage] = useState<string>('');

  const [emailMessageError, setEmailMessageError] = useState<boolean>(false);

  const [isEmailChecked, setIsEmailChecked] = useState<boolean>(false);
  const [isPasswordChecked, setIsPasswordChecked] = useState<boolean>(false);
  const [isPasswordEqual, setIsPasswordEqual] = useState<boolean>(false);

  const isEmailCheckedButtonActive = email !== '';
  const isSignUpButtonActive =
    email && password && passwordCheck && nickname && isEmailChecked && isPasswordChecked && isPasswordEqual;
  const signUpButtonClass = `button ${isSignUpButtonActive ? 'primary' : 'disable'} fullwidth`;

  const emailCheckResponse = (responseBody: ResponseDto | null) => {
    const message = !responseBody
      ? '서버에 문제가 있습니다.'
      : responseBody.code === 'DBE'
      ? '서버에 문제가 있습니다.'
      : responseBody.code === 'EE'
      ? '이미 사용중인 이메일입니다.'
      : responseBody.code === 'VF'
      ? '이메일을 입력해주세요.'
      : '사용 가능한 이메일입니다.';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';

    setEmailMessage(message);
    setEmailMessageError(!isSuccess);
    setIsEmailChecked(isSuccess);
  };

  const signUpResponse = (responseBody: ResponseDto | null) => {
    const message = !responseBody
      ? '서버에 문제가 있습니다.'
      : responseBody.code === 'DBE'
      ? '서버에 문제가 있습니다.'
      : responseBody.code === 'EE'
      ? '이미 사용중인 이메일입니다.'
      : responseBody.code === 'VF'
      ? '모두 입력해주세요.'
      : '';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';

    if (!isSuccess) {
      if (responseBody && responseBody.code === 'EE') {
        setEmailMessage(message);
        setEmailMessageError(true);
        return;
      }
      alert(message);
      return;
    }

    onPageChange('sign-in');
  };

  const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEmail(value);

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isMatch = regex.test(value);
    const message = isMatch ? '' : '올바른 이메일 형식을 입력해주세요.';
    setEmailMessage(message);

    setIsEmailChecked(false);
    setEmailMessage('');
    setEmailMessageError(false);
  };

  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value);

    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,20}$/;
    const isMatch = regex.test(value);
    const message = isMatch ? '' : '비밀번호는 영문자, 숫자, 특수문자를 포함한 8~20자여야 합니다.';
    setPasswordMessage(message);
    setIsPasswordChecked(isMatch);
  };

  const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPasswordCheck(value);
  };

  const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setNickname(value);

    const userIdRegex = /^[a-zA-Z\d]{3,20}$/;
    const isMatch = userIdRegex.test(value);
    const message = isMatch ? '' : '닉네임은 영문자와 숫자로만 이루어진 3~20자여야 합니다.';
    setNicknameMessage(message);
  };

  const onCheckEmailClickHandler = () => {
    if (!isEmailCheckedButtonActive) return;

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isMatch = regex.test(email);
    if (!isMatch) {
      setEmailMessage('올바른 이메일 형식을 입력해주세요.');
      setEmailMessageError(true);
      return;
    }

    const requestBody: EmailCheckRequestDto = { email };
    emailCheckRequest(requestBody).then(emailCheckResponse);
  };

  const onSignUpClickHandler = () => {
    if (!email) setEmailMessage('이메일을 입력해주세요.');
    if (!password) setPasswordMessage('비밀번호를 입력해주세요.');
    if (!nickname) setNicknameMessage('닉네임을 입력해주세요.');
    if (!isEmailChecked) {
      setEmailMessage('이메일 중복을 확인해주세요.');
      setEmailMessageError(true);
    }
    if (!isSignUpButtonActive) return;

    const requestBody: SignUpRequestDto = {
      email,
      password,
      nickname,
    };
    signUpRequest(requestBody).then(signUpResponse);
  };

  useEffect(() => {
    const isMatch = passwordCheck === password;
    const message = isMatch ? '' : '비밀번호가 일치하지 않습니다.';
    setPasswordCheckMessage(message);
    setIsPasswordEqual(isMatch);
  }, [passwordCheck, password]);

  return (
    <div id='auth-sign-up-container'>
      <div className='header-container'>
        <div className='title'>Nihongo Anki</div>
        <div className='description'>회원가입하여 학습을 시작하세요</div>
      </div>
      <div className='input-container'>
        <InputBox
          type={'text'}
          label={'이메일'}
          value={email}
          placeholder={'이메일을 입력해주세요.'}
          message={emailMessage}
          buttonName={'중복확인'}
          onButtonClick={onCheckEmailClickHandler}
          isErrorMessage={emailMessageError}
          onChange={onEmailChangeHandler}
          isButtonActive={isEmailCheckedButtonActive}
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

        <InputBox
          type={'password'}
          label={'비밀번호 확인'}
          value={passwordCheck}
          placeholder={'비밀번호를 입력해주세요.'}
          message={passwordCheckMessage}
          isErrorMessage
          onChange={onPasswordCheckChangeHandler}
        />

        <InputBox
          type={'text'}
          label={'닉네임'}
          value={nickname}
          placeholder={'닉네임을 입력해주세요.'}
          message={nicknameMessage}
          isErrorMessage
          onChange={onNicknameChangeHandler}
        />
      </div>
      <div className='button-container'>
        <div className={signUpButtonClass} onClick={onSignUpClickHandler}>
          회원가입
        </div>
        <div className='divider'></div>
        <div className='footer'>
          계정이 있으신가요?
          <span className='link' onClick={() => onPageChange('sign-in')}>
            로그인
          </span>
        </div>
      </div>
    </div>
  );
}
