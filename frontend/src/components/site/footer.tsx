export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row md:items-center">
        <div>
          <p className="font-medium text-foreground">RentalBazar</p>
          <p className="text-xs">Rent anything locally, return with ease.</p>
        </div>
        <div className="flex flex-wrap gap-6 text-xs">
          <span>Support</span>
          <span>Become a host</span>
          <span>Terms</span>
          <span>Privacy</span>
        </div>
      </div>
    </footer>
  );
}
