import React, { useEffect } from 'react';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router';
import Auth from './views/Auth';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN, AUTH_ABSOLUTE_PATH, AUTH_EMAIL_ABSOLUTE_PATH, AUTH_PATH, MAIN_ABSOLUTE_PATH } from './constants';
import verifyEmailStore from './stores/verify-email.store';

function App() {
  return (
    <Routes>
      <Route index element={<Index />} />
      <Route path={AUTH_PATH} element={<Auth />} />

      <Route element={<>Layout</>}>
        <Route path='main' element={<>Main</>} />

        <Route path='kanji'>
          <Route index element={<>Kanji</>} />
          <Route path=':grade' element={<>KanjiGrade</>} />
        </Route>

        <Route path='voca'>
          <Route index element={<>Voca</>} />
          <Route path=':grade' element={<>VocaGrade</>} />
        </Route>

        <Route path='*' element={<>404</>} />
      </Route>
    </Routes>
  );
}

export default App;

function Index() {
  const [cookies] = useCookies();

  const navigator = useNavigate();

  const { isVerified } = verifyEmailStore();

  useEffect(() => {
    cookies[ACCESS_TOKEN] && isVerified
      ? navigator(MAIN_ABSOLUTE_PATH)
      : cookies[ACCESS_TOKEN]
      ? navigator(AUTH_EMAIL_ABSOLUTE_PATH)
      : navigator(AUTH_ABSOLUTE_PATH);
  }, []);

  return null;
}
