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
  let countryCode: CountryCode = "CM"; // Par défaut Cameroun selon ta capture

  try {
    const phoneNumber = parsePhoneNumber(formData.phone);
    if (phoneNumber) {
      cleanNumber = phoneNumber.nationalNumber as string;
      countryCode = phoneNumber.country as CountryCode;
    }
  } catch (e) {
    cleanNumber = formData.phone.replace(/\D/g, "");
  }

  // FORCE L'URL ABSOLUE (Règle l'erreur de ta 2ème capture)
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
        // ✅ CORRECTION : Utilisation de discount_code selon la doc Chariow
        discount_code: formData.promo_code ? formData.promo_code.trim().toUpperCase() : null, 
        redirect_url: `${baseUrl}/courses/success`,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      // Renvoie l'erreur propre de l'API ou un message par défaut
      return { error: result.message || "La validation du paiement a échoué" };
    }

    // ✅ CORRECTION : Accès sécurisé à l'URL (vérifie si c'est .data.checkout_url ou .data.payment.checkout_url)
    const checkoutUrl = result.data?.checkout_url || result.data?.payment?.checkout_url;
    
    if (!checkoutUrl) {
        return { error: "Impossible de générer l'URL de paiement. Vérifiez votre configuration Chariow." };
    }

    return { url: checkoutUrl };

  } catch (error: any) {
    console.error("Erreur Checkout Chariow:", error);
    return { error: error.message || "Une erreur inattendue est survenue" };
  }
}