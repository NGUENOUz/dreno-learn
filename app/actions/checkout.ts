"use server";

import { parsePhoneNumber, CountryCode } from 'libphonenumber-js';

export async function initiateChariowCheckout(formData: {
  product_id: string;
  email: string;
  full_name: string;
  phone: string; 
  promo_code: string; 
}) {
  const nameParts = formData.full_name.trim().split(" ");
  const first_name = nameParts[0] || "Client";
  const last_name = nameParts.slice(1).join(" ") || "Elite";

  let cleanNumber = "";
  let countryCode: CountryCode = "SN"; 

  try {
    const phoneNumber = parsePhoneNumber(formData.phone);
    if (phoneNumber) {
      cleanNumber = phoneNumber.nationalNumber as string;
      countryCode = phoneNumber.country as CountryCode;
    }
  } catch (e) {
    cleanNumber = formData.phone.replace(/\D/g, "");
  }

  // SÉCURITÉ : Vérifier que l'URL de base est bien définie
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreno-learn.vercel.app";

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
          country_code: countryCode,
        },
        // 🚀 CORRECTION : Remplacement de promo_code par discount_code (selon la doc)
        discount_code: formData.promo_code && formData.promo_code.trim() !== "" 
          ? formData.promo_code.trim().toUpperCase() 
          : null, 
        
        // 🚀 CORRECTION : Assurer une URL absolue pour éviter l'erreur de redirection
        redirect_url: `${baseUrl}/courses/success`,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "La validation du paiement a échoué");
    }

    return { url: result.data.payment.checkout_url };
  } catch (error: any) {
    console.error("Erreur Checkout Chariow:", error);
    return { error: error.message };
  }
}