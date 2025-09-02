import React from 'react';
import type { LogicalFallacy } from '@criti-ai/shared';

interface LogicalFallaciesProps {
  fallacies: LogicalFallacy[];
}

export const LogicalFallacies: React.FC<LogicalFallaciesProps> = ({ fallacies }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <h4>🧠 논리적 오류</h4>
      {fallacies.length === 0 ? (
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          논리적 오류가 발견되지 않았습니다.
        </p>
      ) : (
        <ul style={{ margin: 0, paddingLeft: '1rem' }}>
          {fallacies.map((fallacy, index) => (
            <li key={index} style={{ marginBottom: '0.5rem' }}>
              <strong>{fallacy.type}</strong>
              <br />
              <small style={{ color: '#6b7280' }}>{fallacy.description}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
