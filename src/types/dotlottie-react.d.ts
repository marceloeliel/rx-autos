declare module '@lottiefiles/dotlottie-react' {
  export interface DotLottieReactProps {
    src: string;
    autoplay?: boolean;
    loop?: boolean;
    style?: React.CSSProperties;
    className?: string;
  }

  export const DotLottieReact: React.FC<DotLottieReactProps>;
} 