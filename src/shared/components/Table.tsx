
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function Table({ children }: Props) {
  return <table className="table">{children}</table>;
}
