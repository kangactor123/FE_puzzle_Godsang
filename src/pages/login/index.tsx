import React, { useState } from 'react';
import Button, { ButtonType } from 'src/components/button/Button';
import Layout from 'src/components/common/Layout';
import { ButtonSection } from 'src/core/styles/common';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { FacebookIcon, GoogleIcon, KakaoIcon, NaverIcon } from 'src/core/icons';
import { Provider, useLogin } from 'src/module/auth';

import { signIn, useSession, signOut, getProviders } from 'next-auth/react';
import { usePuzzles } from 'src/module/puzzles';

const layoutCss = css`
  .wrapper {
    width: 100%;
    height: 100%;
    padding-top: 25%;
    display: flex;
    flex-direction: column;
    gap: 20%;
  }
`;

// main color 테마로 지정하기
const TitleSection = styled.div`
  text-align: center;
  h3 {
    margin: 0;
    margin-bottom: 6px;
    line-height: 34px;
    font-size: 32px;
    color: #9148da;
    font-family: 'EstablishRetrosans';
    letter-spacing: -0.002em;
  }
  p {
    font-size: 16px;
    line-height: 25px;
  }
`;

const IconSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #727272;
  p {
    font-size: 13px;
    line-height: 20px;
  }
  .icon-wrapper {
    display: flex;
    gap: 15px;
    margin-top: 18px;
  }
  svg {
    cursor: pointer;
  }
`;

// 서버에서 oAuth 로그인 성공 후 우리 회원이 아니라면 회원정보를 받는 wizard > 서버에 post 하고 200ok 시 회원가입
// 성공 후 우리 회원이면 퍼즐 존재 시 퍼즐 리스트화면, 없으면 퍼즐 생성하는 wizard로 리다이렉션
function Login() {
  const [isSession, setIsSession] = useState(false);
  const router = useRouter();

  const session = useSession();
  console.log(session);
  const handleClickHowToUse = () => {
    // 임시 작업
    signOut();
  };

  const handleClickIcon = (provider: Provider) => () => {
    signIn(provider).then(() => setIsSession((prev) => !prev));
  };

  usePuzzles({
    enabled: isSession,
    onSuccess: (data) => (data.length === 0 ? router.push('create') : router.push('list')),
  });

  return (
    <Layout layoutCss={layoutCss} useHeader={false}>
      <div className="wrapper">
        <TitleSection>
          <h3>디어,마이 2023</h3>
          <p>나의 퍼즐을 맞춰주세요.</p>
        </TitleSection>
        <IconSection>
          <p>소셜 계정으로 간편하게 로그인하기</p>
          <div className="icon-wrapper">
            <GoogleIcon onClick={handleClickIcon('google')} />
            <NaverIcon onClick={handleClickIcon('naver')} />
            <KakaoIcon onClick={handleClickIcon('kakao')} />
            <FacebookIcon onClick={handleClickIcon('facebook')} />
          </div>
        </IconSection>
        <ButtonSection>
          <Button buttonType={ButtonType.Text} onClick={handleClickHowToUse}>
            이용방법
          </Button>
        </ButtonSection>
      </div>
    </Layout>
  );
}

export default Login;
