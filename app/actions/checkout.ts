"use server";

import { parsePhoneNumber, CountryCode } from 'libphonenumber-js';
import { cookies } from "next/headers"; // 🔐 Ajout de l'import des cookies
import { crypto } from "crypto";

export async function initiateChariowCheckout(formData: {
  product_id: string; // ID Chariow (ex: nouveau-guide-2026)
  email: string;
  full_name: string;
  phone: string;
  promo_code: string;
  product_type: "courses" | "guides";
}) {
  // 1. Nettoyage strict des entrées
  const cleanProductId = String(formData.product_id).trim();
  const cleanEmail = String(formData.email).trim();
  const cleanFullName = String(formData.full_name).trim();

  console.log("=== CHECKOUT SECURE START ===");
  console.log("ID Produit identifié :", cleanProductId);

  // 2. Préparation de l'identité client
  const nameParts = cleanFullName.split(" ");
  const first_name = nameParts[0] || "Client";
  const last_name = nameParts.slice(1).join(" ") || "Elite";

  // 3. Formatage du numéro de téléphone pour Chariow
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

  // 4. Construction de l'URL de retour dynamique vers la page de succès
  const rawBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreno-learn.vercel.app";
  const baseUrl = rawBaseUrl.replace(/\/$/, ""); 
  
  // FIX CRITIQUE : On utilise la nouvelle route hors du dossier dynamique !
  // Assurez-vous d'avoir renommé votre dossier "success" en "guide-success"
  const successPath = formData.product_type === "guides" ? "/guide-success" : "/course-success";


  const securityToken = crypto.randomUUID(); // Génère un ID unique comme "a1b2-c3d4..."
  
  // 🔐 2. CACHER LE SCEAU DANS LE NAVIGATEUR (Valable 1 heure max)
  cookies().set("drenolearn_secure_payment", securityToken, {
    httpOnly: true, // Impossible à voler via Javascript
    secure: process.env.NODE_ENV === "production", // Sécurisé en HTTPS
    maxAge: 60 * 60, // Expire dans 1 heure
    path: "/",
  });

  // IMPORTANT : On s'assure de passer chariow_id
  const successParams = new URLSearchParams({
    email: cleanEmail,
    name: cleanFullName,
    phone: formData.phone,
    chariow_id: cleanProductId, // C'est ici qu'on injecte l'ID exact
    type: formData.product_type,
    token: securityToken
  }).toString();

  const finalRedirectUrl = `${baseUrl}${successPath}?${successParams}`;
  
  console.log("🔗 [CHECKOUT] URL de retour générée :", finalRedirectUrl);

  try {
    // 5. Appel à l'API Chariow pour créer la session de paiement
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
        phone: {
          number: cleanNumber,
          country_code: countryCode,
        },
        discount_code: formData.promo_code ? formData.promo_code.trim().toUpperCase() : null, 
        redirect_url: finalRedirectUrl,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("API Error:", result);
      return { error: result.message || "Erreur lors de l'initiation" };
    }

    const checkoutUrl = result.data?.checkout_url || result.data?.payment?.checkout_url;
    const isCompleted = result.data?.status === 'completed' || result.data?.payment?.status === 'completed';

    // 6. Gestion du cas "Déjà payé" ou "Code Promo 100%"
    // Si le statut est déjà complété, on redirige directement vers notre page de succès locale
    if (isCompleted || !checkoutUrl) {
        console.log("✅ [CHECKOUT] Paiement instantané validé, redirection locale.");
        return { url: finalRedirectUrl };
    }

    // Sinon, on renvoie l'URL de la page de paiement Chariow
    return { url: checkoutUrl };

  } catch (error: any) {
    console.error("Critical Error:", error);
    return { error: "Erreur technique serveur" };
  }
}