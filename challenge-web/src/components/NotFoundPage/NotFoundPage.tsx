import React from 'react';
import * as S from './NotFoundPage.style';

const NotFoundPage: React.FC = () => {
  return (
    <S.NotFoundContainer>
      <S.NotFoundIcon>🔍</S.NotFoundIcon>
      
      <S.NotFoundCode>404</S.NotFoundCode>
      
      <S.NotFoundMessage>
        찾으시는 페이지가 존재하지 않습니다.
      </S.NotFoundMessage>
      
      <S.HomeLink href="/">
        <span>🏠</span>
        홈으로 돌아가기
      </S.HomeLink>
    </S.NotFoundContainer>
  );
};

export default NotFoundPage;
