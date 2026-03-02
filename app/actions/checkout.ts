"use server";

import { parsePhoneNumber, CountryCode } from 'libphonenumber-js';
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";

export async function initiateChariowCheckout(formData: {
  product_id: string;
  email: string;
  full_name: string;
  phone: string;
  promo_code: string;
  product_type: "courses" | "guides";
}) {
  const cleanProductId = String(formData.product_id).trim();
  const cleanEmail = String(formData.email).trim();
  const cleanFullName = String(formData.full_name).trim();

  // 1. Préparation Identité
  const nameParts = cleanFullName.split(" ");
  const first_name = nameParts[0] || "Client";
  const last_name = nameParts.slice(1).join(" ") || "Elite";

  let cleanNumber = formData.phone.replace(/\D/g, "");
  let countryCode: CountryCode = "CM"; 
  try {
    const phoneNumber = parsePhoneNumber(formData.phone);
    if (phoneNumber) {
      cleanNumber = phoneNumber.nationalNumber as string;
      countryCode = phoneNumber.country as CountryCode;
    }
  } catch (e) {
    console.error("Erreur formatage téléphone:", e);
  }

  // 2. URL de retour
  const rawBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreno-learn.vercel.app";
  const baseUrl = rawBaseUrl.replace(/\/$/, ""); 
  const successPath = formData.product_type === "guides" ? "/guide-success" : "/course-success";

  const securityToken = randomUUID();
  const cookieStore = await cookies();
  
  cookieStore.set("drenolearn_secure_payment", securityToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60,
    path: "/",
    sameSite: "lax",
  });

  const successParams = new URLSearchParams({
    email: cleanEmail,
    name: cleanFullName,
    phone: formData.phone,
    chariow_id: cleanProductId,
    type: formData.product_type,
    token: securityToken
  }).toString();

  const finalRedirectUrl = `${baseUrl}${successPath}?${successParams}`;

  try {
    // 3. Appel API Chariow
    const response = await fetch("https://api.chariow.com/v1/checkout", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CHARIOW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: cleanProductId,
        email: cleanEmail,
        first_name: first_name,
        last_name: last_name,
        phone: { number: cleanNumber, country_code: countryCode },
        discount_code: formData.promo_code ? formData.promo_code.trim().toUpperCase() : null, 
        redirect_url: finalRedirectUrl,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.message || "Erreur lors de l'initiation" };
    }

    const checkoutUrl = result.data?.checkout_url || result.data?.payment?.checkout_url;
    const isCompleted = result.data?.status === 'completed' || result.data?.payment?.status === 'completed';

    // ============================================================
    // 🔒 SÉCURITÉ RENFORCÉE
    // On détecte si c'est un cas "GRATUIT" légitime
    // ============================================================
    const hasPromoCode = formData.promo_code && formData.promo_code.trim().length > 0;
    
    // C'est validé SI : (Statut Completed) OU (Pas d'URL MAIS il y a un code promo)
    const isValidFreeOrder = isCompleted || (!checkoutUrl && hasPromoCode);

    if (isValidFreeOrder) {
        console.log("✅ [CHECKOUT] Commande validée (Gratuit/Promo). Enregistrement...");

        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // A. ID Produit
        let internalId = null;
        const { data: guide } = await supabaseAdmin.from("guides").select("id").eq("chariow_id", cleanProductId).maybeSingle();
        if (guide) { internalId = guide.id; } 
        else {
            const { data: course } = await supabaseAdmin.from("courses").select("id").eq("chariow_id", cleanProductId).maybeSingle();
            if (course) internalId = course.id;
        }

        if (!internalId) {
             console.error("❌ ERREUR : Produit introuvable :", cleanProductId);
             return { url: finalRedirectUrl }; // On redirige quand même
        }

        // B. User ID
        const { data: profile } = await supabaseAdmin.from("profiles").select("id").eq("email", cleanEmail).maybeSingle();
        const userId = profile ? profile.id : null;

        // C. Commande
        await supabaseAdmin.from('orders').insert({
            email: cleanEmail,
            user_id: userId,
            item_id: internalId,
            item_type: formData.product_type === "guides" ? "guide" : "course",
            status: 'completed',
            amount: 0
        });

        // D. Accès
        if (userId) {
             await supabaseAdmin.from('user_access').insert({
                user_id: userId,
                item_id: internalId,
                item_type: formData.product_type === "guides" ? "guide" : "course"
            });
        }

        return { url: finalRedirectUrl };
    }

    // 🚨 SI ON ARRIVE ICI : C'est payant MAIS on n'a pas de lien -> ERREUR
    if (!checkoutUrl) {
        console.error("❌ TENTATIVE DE FRAUDE OU BUG : Pas de lien pour un produit payant sans code promo.");
        return { error: "Erreur technique : Impossible d'obtenir le lien de paiement." };
    }

    return { url: checkoutUrl };

  } catch (error: any) {
    console.error("Critical Error:", error);
    return { error: "Erreur technique serveur" };
  }
}