/// <reference types="next" />
/// <reference types="next/image-types/global" />
/// <reference types="next/navigation-types/compat/navigation" />

declare module "*.svg" {
  import type { FC, SVGProps } from "react";
  const content: FC<SVGProps<SVGSVGElement>>;
  export default content;
}

