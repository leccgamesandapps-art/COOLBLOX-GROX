import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function SectionRow({
  title,
  href,
  children
}: {
  title: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8 animate-fade-up">
      <div className="flex items-center justify-between px-1 mb-3">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight">{title}</h2>
        {href && (
          <Link
            href={href}
            className="text-sm text-cool-400 hover:text-cool-300 flex items-center gap-0.5 font-medium"
          >
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
        {children}
      </div>
    </section>
  );
}
