export function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary"
        aria-label="Carregando"
        role="status"
      />
    </div>
  );
}
