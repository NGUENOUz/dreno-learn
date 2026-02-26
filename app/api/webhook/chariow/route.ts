import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    // On vérifie que le paiement est complété
    if (payload.data?.status === 'completed') {
      const { customer, product } = payload.data;
      const chariowId = product.id; // L'ID qui correspond à notre DB

      // 1. Initialiser Supabase (Client Server pour outrepasser les RLS si besoin)
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! // Clé secrète pour le backend
      );

      // 2. Récupérer les infos du guide acheté
      const { data: guide } = await supabase
        .from("guides")
        .select("title, drive_pdf_link")
        .eq("chariow_id", chariowId)
        .maybeSingle();

      const driveLink = guide?.drive_pdf_link || "Veuillez vérifier votre email ou créer un compte.";
      const guideTitle = guide?.title || product.name;

      // 3. Envoyer le message WhatsApp via Evolution API
      if (process.env.EVOLUTION_API_URL && process.env.WA_INSTANCE) {
        const whatsappMessage = `🎉 *Félicitations ${customer.first_name} !* \n\nVotre paiement pour *${guideTitle}* a été validé avec succès.\n\n📥 *Voici votre lien d'accès immédiat :*\n${driveLink}\n\n💬 *Rejoignez le groupe VIP ici :*\nhttps://chat.whatsapp.com/TON_LIEN_ICI\n\nN'oubliez pas de créer votre compte sur DrenoLearn avec cet email (${customer.email}) pour sauvegarder votre achat à vie !`;

        await fetch(`${process.env.EVOLUTION_API_URL}/message/sendText/${process.env.WA_INSTANCE}`, {
          method: 'POST',
          headers: { 
            'apikey': process.env.EVOLUTION_API_KEY || '',
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({
            number: customer.phone.number,
            options: { delay: 1500, presence: "composing" },
            textMessage: { text: whatsappMessage }
          })
        });
      }
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erreur Webhook:", error);
    return NextResponse.json({ error: "Erreur de traitement" }, { status: 500 });
  }
}