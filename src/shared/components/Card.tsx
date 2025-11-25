
import { ReactNode } from 'react';

interface Props {
  title?: string;
  children: ReactNode;
}

export function Card({ title, children }: Props) {
  return (
    <section className="card">
      {title && <header className="card-header">{title}</header>}
      <div className="card-body">{children}</div>
    </section>
  );
}
