
import { NavLink } from 'react-router-dom';
import { features } from '../config/features';

interface NavItem {
  to: string;
  label: string;
}

function buildLinks(): NavItem[] {
  const base: NavItem[] = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/orders', label: 'Orders' },
    { to: '/risk', label: 'Risk' },
    { to: '/qa', label: 'QA' },
    { to: '/events', label: 'Events' },
  ];
  if (features.congress) {
    base.push({ to: '/congress', label: 'Congress' });
  }
  if (features.shipping) {
    base.push({ to: '/shipping', label: 'Shipping' });
  }
  return base;
}

export function Sidebar() {
  const links = buildLinks();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Assembled Cockpit</div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
