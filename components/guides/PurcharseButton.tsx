"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { initiateChariowCheckout } from "@/app/actions/checkout";
import { toast } from "sonner";
import { Loader2, ShoppingCart } from "lucide-react";

export default function PurchaseButton({ productId, email }: { productId: string, email?: string }) {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    // On passe les infos minimales, le reste sera géré par le formulaire ou l'auth
    const result = await initiateChariowCheckout({
      product_id: productId,
      email: email || "", // Idéalement récupéré de la session
      full_name: "Client Elite",
      phone: "",
      promo_code: ""
    });

    if (result.error) {
      toast.error(result.error);
      setLoading(false);
    } else if (result.url) {
      window.location.href = result.url;
    }
  };

  return (
    <Button 
      onClick={handlePurchase}
      disabled={loading}
      className="w-full h-20 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] font-black italic uppercase text-lg shadow-xl shadow-blue-200 transition-all active:scale-95"
    >
      {loading ? <Loader2 className="animate-spin" /> : (
        <span className="flex items-center gap-2">ACHETER MAINTENANT <ShoppingCart className="w-5 h-5" /></span>
      )}
    </Button>
  );
}