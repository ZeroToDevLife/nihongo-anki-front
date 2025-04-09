import React, { useState } from 'react';
import './style.css';
import SignIn from './SignIn';
import SignUp from './SignUp';
import EmailAuth from './EmailAuth';
import { AuthPage } from 'src/types/aliases';

export default function Auth() {
  const [page, setPage] = useState<AuthPage>('sign-in');

  const onPageChangeHandler = (page: AuthPage) => {
    setPage(page);
  };

  return (
    <div id='auth-wrapper'>
      <div className='auth-box'>
        {page === 'sign-in' ? (
          <SignIn onPageChange={onPageChangeHandler} />
        ) : page === 'sign-up' ? (
          <SignUp onPageChange={onPageChangeHandler} />
        ) : (
          <EmailAuth onPageChange={onPageChangeHandler} />
        )}
      </div>
    </div>
  );
}
