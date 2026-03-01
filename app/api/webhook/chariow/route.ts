import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    console.log("🔔 Webhook Chariow Reçu :", payload);

    // 1. CORRECTION DE LA STRUCTURE (Adapté à ton JSON)
    // Chariow envoie parfois "event", "sale", "customer" à la racine
    const status = payload.sale?.status || payload.data?.status;
    const customer = payload.customer || payload.data?.customer;
    const product = payload.product || payload.data?.product;

    // Vérification de sécurité de base
    if (!status || !customer || !product) {
        console.error("❌ Payload incomplet ou malformé");
        return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
    }

    // On vérifie que le paiement est complété
    if (status === 'completed') {
      console.log(`✅ Paiement validé pour : ${customer.email}`);
      
      const chariowId = product.id; // Ex: "prd_jnslo7"

      // 2. Initialiser Supabase Admin
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! 
      );

      // 3. Trouver l'ID interne (UUID) du produit acheté
      let internalId = null;
      let itemType = 'guide';
      let driveLink = "Veuillez vérifier votre espace membre.";
      let productTitle = product.name;

      console.log(`🔍 Recherche du produit Chariow ID: ${chariowId}`);

      // Chercher dans les guides
      const { data: guide } = await supabase.from("guides").select("id, title, drive_pdf_link").eq("chariow_id", chariowId).maybeSingle();
      
      if (guide) {
        internalId = guide.id;
        driveLink = guide.drive_pdf_link;
        productTitle = guide.title;
        console.log("-> Produit identifié comme GUIDE");
      } else {
        // Si ce n'est pas un guide, chercher dans les formations
        const { data: course } = await supabase.from("courses").select("id, title").eq("chariow_id", chariowId).maybeSingle();
        if (course) {
          internalId = course.id;
          itemType = 'course';
          productTitle = course.title;
          console.log("-> Produit identifié comme FORMATION");
        }
      }

      if (!internalId) {
          console.error(`❌ ERREUR CRITIQUE : Produit introuvable dans Supabase pour chariow_id: ${chariowId}`);
          // On retourne 200 pour dire à Chariow "J'ai bien reçu", même si on a pas trouvé le produit, pour éviter qu'il renvoie le webhook en boucle.
          return NextResponse.json({ success: true, warning: "Product not found internally" }, { status: 200 });
      }

      // 4. Enregistrer l'achat et donner l'accès
      if (internalId) {
        // A. Sauvegarder la trace de la commande
        const { error: orderError } = await supabase.from('orders').insert({
          email: customer.email,
          item_id: internalId,
          item_type: itemType,
          status: 'completed',
          amount: payload.sale?.amount?.value || 0 // On sauvegarde le montant payé (0 si gratuit)
        });

        if (orderError) console.error("Erreur insertion Order:", orderError);

        // B. Vérifier si l'utilisateur a DÉJÀ un compte DrenoLearn
        const { data: profile } = await supabase.from('profiles').select('id').eq('email', customer.email).maybeSingle();

        if (profile) {
          console.log(`👤 Utilisateur existant trouvé (${profile.id}). Ajout de l'accès...`);
          // S'il a déjà un compte, on lui donne l'accès immédiatement au Dashboard
          const { error: accessError } = await supabase.from('user_access').insert({
            user_id: profile.id,
            item_id: internalId,
            item_type: itemType
          });
          if (accessError) console.error("Erreur insertion Access:", accessError);
        } else {
            console.log("👤 Nouvel utilisateur (pas de compte). L'accès sera lié à la création du compte.");
        }
      }

      // 5. Envoyer le message WhatsApp (Optionnel)
      if (process.env.EVOLUTION_API_URL && process.env.WA_INSTANCE && customer.phone) {
        // ... (Ton code WhatsApp existant)
      }
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("🔥 Erreur Webhook:", error);
    return NextResponse.json({ error: "Erreur de traitement" }, { status: 500 });
  }
}