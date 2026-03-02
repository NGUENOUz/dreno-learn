// app/(marketing)/layout.tsx
import { FacebookPixel } from "@/components/FacebookPixel";
import { Header } from "@/components/Header";
import { HeaderDemo } from "@/components/headerDemo";
import { ExitIntentPopup } from "@/components/ui/exitIntentPopup";
import { Suspense } from "react";


export default function MarketingLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>

      <main className="grow flex flex-col">
        {children}
        <ExitIntentPopup />
        <Suspense fallback={null}>
            <FacebookPixel />
        </Suspense>
      </main>
      
    </>
  );
}