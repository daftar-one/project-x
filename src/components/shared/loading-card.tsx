export function LoadingCard({ message = "Loading…" }: { message?: string }) {
  return (
    <div className="card p-12 text-center text-gray-400">
      <div className="text-[13px]">{message}</div>
    </div>
  );
}

export function ErrorCard({ message }: { message: string }) {
  return (
    <div className="card p-12 text-center text-red-500">
      <div className="text-[13px]">{message}</div>
    </div>
  );
}
