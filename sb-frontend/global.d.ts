// global.d.ts
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "spline-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        url?: string;
        class?: string;
      };
    }
  }
}

export {};
