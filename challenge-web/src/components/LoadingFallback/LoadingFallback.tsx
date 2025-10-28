import React from 'react';
import * as S from './LoadingFallback.style';

const LoadingFallback: React.FC = () => {
  return (
    <S.LoadingContainer>
      <S.Spinner />
      <S.LoadingText>로딩 중...</S.LoadingText>
    </S.LoadingContainer>
  );
};

export default LoadingFallback;
