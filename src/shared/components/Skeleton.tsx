
interface Props {
  width?: number | string;
  height?: number | string;
}

export function Skeleton({ width = '100%', height = 12 }: Props) {
  return (
    <div
      className="skeleton"
      style={{ width, height }}
    />
  );
}
