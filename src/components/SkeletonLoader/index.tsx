type Props = {
  width: string;
  height: string;
  borderRadius: string;
  className?: string;
};

export const SkeletonLoader = ({ width, height, borderRadius, className = '' }: Props): JSX.Element => (
  <div className={`skeleton-loader d-flex ${className}`} style={{ width, height, borderRadius }} />
);
