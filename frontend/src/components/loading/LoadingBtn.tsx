export function LoadingBtn() {
  return (
    <div className="flex items-center justify-center">
      <div
        className="h-5 w-5 animate-spin rounded-full border-[3px] border-current/20 border-t-current"
        aria-label="Carregando"
        role="status"
      />
    </div>
  );
}
