"use server";

import { parsePhoneNumber, CountryCode } from 'libphonenumber-js';

export async function initiateChariowCheckout(formData: {
  product_id: string;
  email: string;
  full_name: string;
  phone: string;
  promo_code: string;
  product_type?: "guide" | "course"; // ✅ Nouveau paramètre optionnel
}) {
  const nameParts = formData.full_name.trim().split(" ");
  const first_name = nameParts[0] || "Client";
  const last_name = nameParts.slice(1).join(" ") || "Elite";

  let cleanNumber = "";
  let countryCode: CountryCode = "CM"; 

  try {
    const phoneNumber = parsePhoneNumber(formData.phone);
    if (phoneNumber) {
      cleanNumber = phoneNumber.nationalNumber as string;
      countryCode = phoneNumber.country as CountryCode;
    }
  } catch (e) {
    cleanNumber = formData.phone.replace(/\D/g, "");
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreno-learn.vercel.app";
  
  // ✅ LOGIQUE DE REDIRECTION DYNAMIQUE
  // Si c'est un guide, on va vers /checkout/success, sinon vers /courses/success
  const successPath = formData.product_type === "guide" ? "/guides/success" : "/courses/success";

  const successParams = new URLSearchParams({
    chariow_id: formData.product_id, // ✅ On passe l'ID pour que la page de succès récupère le bon guide
    email: formData.email,
    name: formData.full_name,
    phone: formData.phone
  }).toString();

  const finalRedirectUrl = `${baseUrl}${successPath}?${successParams}`;

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
        discount_code: formData.promo_code ? formData.promo_code.trim().toUpperCase() : null, 
        redirect_url: finalRedirectUrl,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.message || "La validation du paiement a échoué" };
    }

    const checkoutUrl = result.data?.checkout_url || result.data?.payment?.checkout_url;
    const isCompleted = result.data?.status === 'completed' || result.data?.payment?.status === 'completed';

    if (isCompleted || !checkoutUrl) {
        return { url: finalRedirectUrl };
    }

    return { url: checkoutUrl };

  } catch (error: any) {
    console.error("Erreur critique Checkout Chariow:", error);
    return { error: "Une erreur est survenue lors de l'initialisation du paiement" };
  }
}