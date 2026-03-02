// app/(marketing)/layout.tsx
import { Header } from "@/components/Header";
import { HeaderDemo } from "@/components/headerDemo";
import { ExitIntentPopup } from "@/components/ui/exitIntentPopup";


export default function MarketingLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>

      <main className="grow flex flex-col">
        {children}
        <ExitIntentPopup />
      </main>
      
    </>
  );
}