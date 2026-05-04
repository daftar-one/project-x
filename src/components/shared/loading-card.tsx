export function LoadingCard({ message = "Loading…" }: { message?: string }) {
  return (
    <div className="card" style={{ padding: 48, textAlign: "center", color: "#9ca3af" }}>
      <div style={{ fontSize: 13 }}>{message}</div>
    </div>
  );
}

export function ErrorCard({ message }: { message: string }) {
  return (
    <div className="card" style={{ padding: 48, textAlign: "center", color: "#ef4444" }}>
      <div style={{ fontSize: 13 }}>{message}</div>
    </div>
  );
}
