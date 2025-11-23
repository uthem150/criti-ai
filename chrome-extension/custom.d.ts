// custom.d.ts

// 1. '?react' 접미사로 import 시 React 컴포넌트로 인식
declare module "*.svg?react" {
  import * as React from "react";
  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  export default ReactComponent;
}

// 2. 일반 .svg import 시 파일 경로(string)로 인식
declare module "*.svg" {
  const src: string;
  export default src;
}
