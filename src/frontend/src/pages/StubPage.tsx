import { Construction } from "lucide-react";

interface StubPageProps {
  title: string;
  description?: string;
}

export function StubPage({ title, description }: StubPageProps) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
      data-ocid="stub.page"
    >
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Construction className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-xl font-bold text-foreground font-display">
        {title}
      </h2>
      <p className="text-muted-foreground mt-2 max-w-sm">
        {description ??
          "This section is coming in the next wave. The foundation and navigation are ready."}
      </p>
    </div>
  );
}
