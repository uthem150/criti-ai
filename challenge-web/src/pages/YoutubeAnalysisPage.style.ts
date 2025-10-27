import styled from '@emotion/styled';

// 전체 컨테이너 - 흰색 배경
export const Container = styled.div`
  min-height: 100vh;
  background: #ffffff;
  padding: 2rem;
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
`;

// 헤더
export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 0;
  margin-bottom: 3rem;
  border-bottom: 1px solid #e5e7eb;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const LogoIcon = styled.div`
  font-size: 1.5rem;
`;

export const LogoText = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

export const NavButton = styled.button`
  padding: 0.625rem 1.25rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #2563eb;
  }

  &:active {
    transform: scale(0.98);
  }
`;

// 입력 카드 - 심플한 디자인
export const InputCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 3rem 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

export const InputTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

export const InputDescription = styled.p`
  font-size: 0.95rem;
  color: #6b7280;
  margin-bottom: 2rem;
`;

export const InputGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  max-width: 600px;
  margin: 0 auto;
`;

export const Input = styled.input`
  flex: 1;
  padding: 0.875rem 1rem;
  font-size: 0.95rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`;

export const SubmitButton = styled.button<{ disabled?: boolean }>`
  padding: 0.875rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

export const ErrorMessage = styled.div`
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 1rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// 로딩
export const LoadingCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 4rem 2rem;
  text-align: center;
`;

export const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1.5rem;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingText = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
`;

// 결과 카드 - 2단 레이아웃
export const ResultCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 2rem;
`;

export const ResultLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// 왼쪽 섹션
export const LeftSection = styled.div``;

export const ResultTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
`;

export const VideoPreview = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

export const Thumbnail = styled.img`
  width: 160px;
  height: 90px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
`;

export const VideoInfo = styled.div`
  flex: 1;
`;

export const VideoTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
`;

export const VideoLink = styled.a`
  display: inline-block;
  color: #3b82f6;
  font-size: 0.875rem;
  text-decoration: none;
  margin-top: 0.5rem;

  &:hover {
    text-decoration: underline;
  }
`;

// 오른쪽 섹션 - 점수 표시
export const RightSection = styled.div``;

export const ScoreDisplay = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const ScoreValue = styled.div<{ score: number }>`
  font-size: 4rem;
  font-weight: 700;
  color: ${props => {
    if (props.score >= 70) return '#10b981';
    if (props.score >= 50) return '#f59e0b';
    return '#ef4444';
  }};
  line-height: 1;
  margin-bottom: 0.5rem;
`;

export const ScoreLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

export const ScoreSummary = styled.p`
  font-size: 0.95rem;
  color: #4b5563;
  line-height: 1.6;
  margin: 1rem 0 2rem 0;
  text-align: center;
`;

// 막대 그래프
export const ChartContainer = styled.div`
  margin-top: 2rem;
`;

export const ChartBar = styled.div`
  margin-bottom: 1rem;
`;

export const ChartLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

export const ChartLabelText = styled.span`
  color: #6b7280;
  font-weight: 500;
`;

export const ChartLabelValue = styled.span<{ score: number }>`
  color: ${props => {
    if (props.score >= 70) return '#10b981';
    if (props.score >= 50) return '#f59e0b';
    return '#ef4444';
  }};
  font-weight: 600;
`;

export const ChartBarBackground = styled.div`
  width: 100%;
  height: 24px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
`;

export const ChartBarFill = styled.div<{ width: number; color: string }>`
  width: ${props => props.width}%;
  height: 100%;
  background: ${props => props.color};
  border-radius: 4px;
  transition: width 0.5s ease;
`;

// 접기/펼치기 섹션
export const CollapsibleSection = styled.div`
  margin-top: 2rem;
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
`;

export const CollapsibleHeader = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
`;

export const CollapsibleTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

export const CollapsibleIcon = styled.span<{ isOpen: boolean }>`
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform 0.2s ease;
`;

export const CollapsibleContent = styled.div<{ isOpen: boolean }>`
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
  margin-top: ${props => props.isOpen ? '1rem' : '0'};
`;

export const SourceInfo = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.25rem;
`;

export const SourceLink = styled.div`
  color: #3b82f6;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
`;

export const SourceDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SourceDetailLabel = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

export const SourceDetailValue = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
`;

export const SourceDescription = styled.p`
  font-size: 0.875rem;
  color: #4b5563;
  margin: 0.75rem 0 0 0;
  line-height: 1.5;
`;

// 분석 섹션들 (전체 너비)
export const FullWidthSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
`;

export const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const AnalysisContent = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.25rem;
`;

export const AnalysisItem = styled.div`
  padding: 1rem 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-of-type {
    padding-top: 0;
  }
`;

export const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 0.5rem;
`;

export const ItemTitle = styled.div`
  font-weight: 600;
  color: #1f2937;
  font-size: 0.95rem;
`;

export const ItemTimestamp = styled.span`
  font-size: 0.75rem;
  color: #3b82f6;
  background: #eff6ff;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-weight: 500;
`;

export const ItemDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
  margin: 0.5rem 0 0 0;
`;

export const Badge = styled.span<{ severity?: 'low' | 'medium' | 'high' | 'critical' }>`
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch (props.severity) {
      case 'critical': return '#7f1d1d';
      case 'high': return '#fee2e2';
      case 'medium': return '#fef3c7';
      case 'low': return '#dbeafe';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.severity) {
      case 'critical': return '#ffffff';
      case 'high': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#3b82f6';
      default: return '#6b7280';
    }
  }};
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
  font-size: 0.875rem;
`;
