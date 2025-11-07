import styled from "@emotion/styled";
import { colors } from "@/styles/design-system";

export const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 3px solid ${colors.light.grayscale[20]};
  border-top-color: ${colors.light.brand.primary100};
  border-radius: 9999px;
  animation: spin 0.8s linear infinite;
`;
