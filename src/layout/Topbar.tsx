
interface Props {
  isLive?: boolean;
  toggleLive?: () => void;
}

export function Topbar({ isLive, toggleLive }: Props) {
  return (
    <header className="topbar">
      <div className="topbar-title">Trading AI Dashboard</div>
      <div className="topbar-right">
        {toggleLive && (
          <button
            onClick={toggleLive}
            style={{
              marginRight: 16,
              background: isLive ? '#ff4d6a' : '#3dd68c',
              color: '#fff',
              border: 'none',
              padding: '4px 12px',
              borderRadius: 4,
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: 12,
            }}
          >
            {isLive ? 'STOP ENGINE' : 'START ENGINE'}
          </button>
        )}
        <span className="topbar-env">EOD / Research</span>
      </div>
    </header>
  );
}
