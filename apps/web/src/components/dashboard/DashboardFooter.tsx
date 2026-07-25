export default function DashboardFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-border bg-muted/30 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-6 text-center">
        <p className="text-sm text-muted-foreground">
          © {currentYear} <span className="font-semibold text-foreground">Project & Task Manager</span>. All rights reserved. Made By <span className="font-semibold text-foreground">Mahabub Hossain</span>
        </p>
      </div>
    </footer>
  );
}
