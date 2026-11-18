export default function DashboardFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex flex-col gap-2 border-t border-border/60 pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <p>© {currentYear} Project &amp; Task Manager. All rights reserved.</p>
      <p>
        Built by <span className="font-medium text-foreground">Mahabub Hossain</span>
      </p>
    </footer>
  );
}
