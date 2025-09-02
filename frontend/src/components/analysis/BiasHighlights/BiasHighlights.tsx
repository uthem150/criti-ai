import React from 'react';
import type { HighlightedText } from '@criti-ai/shared';

interface BiasHighlightsProps {
  highlights: HighlightedText[];
}

export const BiasHighlights: React.FC<BiasHighlightsProps> = ({ highlights }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <h4>🎯 편향 표현</h4>
      {highlights.length === 0 ? (
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          편향된 표현이 발견되지 않았습니다.
        </p>
      ) : (
        <ul style={{ margin: 0, paddingLeft: '1rem' }}>
          {highlights.map((highlight, index) => (
            <li key={index} style={{ marginBottom: '0.5rem' }}>
              <strong>"{highlight.text}"</strong>
              <br />
              <small style={{ color: '#6b7280' }}>{highlight.explanation}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
