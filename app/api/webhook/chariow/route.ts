import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    // On vérifie que le paiement est complété
    if (payload.data?.status === 'completed') {
      const { customer, product } = payload.data;
      const chariowId = product.id; // Ex: "nouveau-guide-2026"

      // 1. Initialiser Supabase avec la clé SERVICE ROLE (pour bypasser les sécurités RLS dans le backend)
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! 
      );

      // 2. Trouver l'ID interne (UUID) du produit acheté
      let internalId = null;
      let itemType = 'guide';
      let driveLink = "Veuillez vérifier votre espace membre.";
      let productTitle = product.name;

      // Chercher dans les guides
      const { data: guide } = await supabase.from("guides").select("id, title, drive_pdf_link").eq("chariow_id", chariowId).maybeSingle();
      
      if (guide) {
        internalId = guide.id;
        driveLink = guide.drive_pdf_link;
        productTitle = guide.title;
      } else {
        // Si ce n'est pas un guide, chercher dans les formations
        const { data: course } = await supabase.from("courses").select("id, title").eq("chariow_id", chariowId).maybeSingle();
        if (course) {
          internalId = course.id;
          itemType = 'course';
          productTitle = course.title;
        }
      }

      // 3. Enregistrer l'achat et donner l'accès
      if (internalId) {
        // A. Sauvegarder la trace de la commande
        await supabase.from('orders').insert({
          email: customer.email,
          item_id: internalId,
          item_type: itemType,
          status: 'completed'
        });

        // B. Vérifier si l'utilisateur a DÉJÀ un compte DrenoLearn
        const { data: profile } = await supabase.from('profiles').select('id').eq('email', customer.email).maybeSingle();

        if (profile) {
          // S'il a déjà un compte, on lui donne l'accès immédiatement au Dashboard
          await supabase.from('user_access').insert({
            user_id: profile.id,
            item_id: internalId,
            item_type: itemType
          });
        }
      }

      // 4. Envoyer le message WhatsApp (Evolution API)
      if (process.env.EVOLUTION_API_URL && process.env.WA_INSTANCE) {
        const whatsappMessage = `🎉 *Félicitations ${customer.first_name} !* \n\nVotre paiement pour *${productTitle}* a été validé avec succès.\n\n📥 *Voici votre lien d'accès immédiat :*\n${driveLink}\n\n💬 *Rejoignez le groupe VIP ici :*\nhttps://chat.whatsapp.com/TON_LIEN_ICI\n\nN'oubliez pas de créer votre compte sur DrenoLearn avec cet email (${customer.email}) pour sauvegarder votre achat à vie !`;

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