import React, { Component, ErrorInfo, ReactNode } from "react";
import * as S from "./ErrorBoundary.style";

interface ErrorBoundaryProps {
  children: ReactNode; // 렌더링할 자식 컴포넌트들
}

interface ErrorBoundaryState {
  hasError: boolean; // 오류 발생 여부
  error: Error | null; // 오류 객체
  errorInfo: ErrorInfo | null; // 오류 스택 정보
}

// 어떤 컴포넌트가 아래 두 메서드 중 하나라도 가지고 있으면, React는 그 컴포넌트를 ErrorBoundary로 인식

// 1. static getDerivedStateFromError(error)
// 2. componentDidCatch(error, errorInfo)

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // 1. state 초기화
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  // 2. getDerivedStateFromError: 오류 감지
  // 렌더링 단계에서 오류가 발생하면 호출됨
  // state를 업데이트하여 다음 렌더링 시 대체 UI를 보여주도록 설정
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  // 3. componentDidCatch: 오류 로깅
  // 오류가 감지되고 state 업데이트가 완료된 후 호출
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("❌ Error Boundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  // 4. handleReset: 오류 상태 초기화 및 홈으로 이동
  // "홈으로 돌아가기" 버튼 클릭 시 실행됨
  handleReset = (): void => {
    // state를 초기화
    this.setState({ hasError: false, error: null, errorInfo: null });
    // 가장 안전한 방법인 페이지 새로고침을 통해 앱을 루트에서 다시 시작합니다.
    window.location.href = "/";
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <S.ErrorContainer>
          <S.ErrorIcon>⚠️</S.ErrorIcon>

          <S.ErrorTitle>앗! 문제가 발생했습니다</S.ErrorTitle>

          <S.ErrorDescription>
            예상치 못한 오류가 발생했습니다. 불편을 드려 죄송합니다.
          </S.ErrorDescription>

          {this.state.error && (
            <S.ErrorDetails>
              <S.ErrorCode>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack && (
                  <>
                    {"\n\n"}
                    {this.state.errorInfo.componentStack}
                  </>
                )}
              </S.ErrorCode>
            </S.ErrorDetails>
          )}

          <S.ResetButton onClick={this.handleReset}>
            <span>🏠</span>
            홈으로 돌아가기
          </S.ResetButton>
        </S.ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
