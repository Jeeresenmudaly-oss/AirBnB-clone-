// Message — a small coloured banner for user
function Message({ type = 'info', children }) {
  if (!children) return null;
  return <div className={`message message--${type}`}>{children}</div>;
}

export default Message;
