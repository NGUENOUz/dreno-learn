"use server";

import { parsePhoneNumber, CountryCode } from 'libphonenumber-js';

export async function initiateChariowCheckout(formData: {
  product_id: string;
  email: string;
  full_name: string;
  phone: string; // Reçoit le format E.164 (ex: +2376...)
  promo_code: string; // Nouveau champ promo
}) {
  const nameParts = formData.full_name.trim().split(" ");
  const first_name = nameParts[0] || "Client";
  const last_name = nameParts.slice(1).join(" ") || "Elite";

  let cleanNumber = "";
  let countryCode: CountryCode = "SN"; // Valeur de repli

  try {
    // 1. ANALYSE INTELLIGENTE DU NUMÉRO
    // Grâce au format +XXX envoyé par ton nouveau champ, on extrait tout proprement
    const phoneNumber = parsePhoneNumber(formData.phone);
    if (phoneNumber) {
      cleanNumber = phoneNumber.nationalNumber as string; // Le numéro sans le préfixe pays
      countryCode = phoneNumber.country as CountryCode;  // Le code ISO (CM, SN, CI, etc.)
    }
  } catch (e) {
    // Repli sécurisé si l'analyse échoue
    cleanNumber = formData.phone.replace(/\D/g, "");
  }

  try {
    const response = await fetch("https://api.chariow.com/v1/checkout", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CHARIOW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: formData.product_id,
        email: formData.email,
        first_name: first_name,
        last_name: last_name,
        phone: {
          number: cleanNumber,
          country_code: countryCode, // CM, SN, CI... détecté automatiquement
        },
        // Transmission du code promo à l'API
        promo_code: formData.promo_code || null, 
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/success`,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      // On capture l'erreur spécifique pour l'afficher sur le design Premium
      throw new Error(result.message || "La validation du paiement a échoué");
    }

    return { url: result.data.payment.checkout_url };
  } catch (error: any) {
    console.error("Erreur Checkout Chariow:", error);
    return { error: error.message };
  }
}