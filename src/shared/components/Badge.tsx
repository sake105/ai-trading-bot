
interface Props {
  color?: 'green' | 'yellow' | 'red' | 'gray';
  label: string;
}

export function Badge({ color = 'gray', label }: Props) {
  return <span className={`badge badge-${color}`}>{label}</span>;
}
