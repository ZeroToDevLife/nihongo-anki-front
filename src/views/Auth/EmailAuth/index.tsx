import React, { ChangeEvent, useState } from 'react';
import './style.css';
import { AuthPage } from 'src/types/aliases';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';
import { ACCESS_TOKEN, MAIN_ABSOLUTE_PATH } from 'src/constants';
import { emailAuthSendRequest, emailAuthVerifyRequest } from 'src/apis';
import { ResponseDto } from 'src/apis/dto/response';
import { EmailAuthResponseDto } from 'src/apis/dto/response/auth';
import verifyEmailStore from 'src/stores/verify-email.store';
import InputBox from 'src/components/InputBox';

interface Props {
  onPageChange: (page: AuthPage) => void;
}

export default function EmailAuth(props: Props) {
  const [cookies] = useCookies();
  const navigator = useNavigate();
  const { setVerified } = verifyEmailStore();

  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [emailMessage, setEmailMessage] = useState<string>('');
  const [codeMessage, setCodeMessage] = useState<string>('');
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);

  const accessToken = cookies[ACCESS_TOKEN];

  const emailAuthSendResponse = (responseBody: ResponseDto | null) => {
    const message = !responseBody
      ? '서버에 문제가 있습니다.'
      : responseBody.code === 'DBE'
      ? '서버에 문제가 있습니다.'
      : responseBody.code === 'VF'
      ? '이메일을 입력해주세요.'
      : '인증 코드가 전송되었습니다.';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    setEmailMessage(message);
    setIsEmailSent(isSuccess);
  };

  const emailAuthVerifyResponse = (responseBody: EmailAuthResponseDto | ResponseDto | null) => {
    const message = !responseBody
      ? '서버에 문제가 있습니다.'
      : responseBody.code === 'DBE'
      ? '서버에 문제가 있습니다.'
      : responseBody.code === 'VF'
      ? '인증 코드를 입력해주세요.'
      : responseBody.code === 'AF'
      ? '인증 코드가 일치하지 않습니다.'
      : '이메일 인증이 완료되었습니다.';

    const isSuccess = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccess) {
      setCodeMessage(message);
      return;
    }

    setVerified(true);
    navigator(MAIN_ABSOLUTE_PATH);
  };

  const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEmail(value);
    setEmailMessage('');
  };

  const onCodeChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setCode(value);
    setCodeMessage('');
  };

  const onSendEmailButtonClickHandler = () => {
    if (!email) {
      setEmailMessage('이메일을 입력해주세요.');
      return;
    }

    const requestBody = { email };
    emailAuthSendRequest(requestBody, accessToken).then(emailAuthSendResponse);
  };

  const onVerifyButtonClickHandler = () => {
    if (!code) {
      setCodeMessage('인증 코드를 입력해주세요.');
      return;
    }

    const requestBody = { email, code };
    emailAuthVerifyRequest(requestBody, accessToken).then(emailAuthVerifyResponse);
  };

  return (
    <div id='auth-email-container'>
      <div className='header-container'>
        <div className='title'>Nihongo Anki</div>
        <div className='description'>이메일 인증을 완료해주세요</div>
      </div>
      <div className='input-container'>
        <InputBox
          type='text'
          label='이메일'
          value={email}
          placeholder='이메일을 입력해주세요.'
          message={emailMessage}
          isErrorMessage={!isEmailSent}
          onChange={onEmailChangeHandler}
          buttonName='인증 코드 전송'
          onButtonClick={onSendEmailButtonClickHandler}
          isButtonActive={!isEmailSent}
        />
        {isEmailSent && (
          <InputBox
            type='text'
            label='인증 코드'
            value={code}
            placeholder='인증 코드를 입력해주세요.'
            message={codeMessage}
            isErrorMessage
            onChange={onCodeChangeHandler}
          />
        )}
      </div>
      <div className='button-container'>
        <div className='button primary fullwidth' onClick={onVerifyButtonClickHandler}>
          인증하기
        </div>
      </div>
    </div>
  );
}
