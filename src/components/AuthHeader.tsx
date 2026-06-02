interface AuthHeaderProps {
  username?: string | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

export function AuthHeader({ username = null, onLogin, onLogout }: AuthHeaderProps) {
  return (
    <header>
      <div className="header-left">
        <div className="header-logo" aria-hidden="true">
          📝
        </div>
        <span className="header-title">Todos</span>
      </div>
      <div className="header-right">
        {username ? (
          <>
            <span className="badge-guest">{username}</span>
            <button type="button" className="btn-logout" onClick={onLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <span className="badge-guest">Guest</span>
            <button type="button" className="btn-login" onClick={onLogin}>
              Log in
            </button>
          </>
        )}
      </div>
    </header>
  );
}
