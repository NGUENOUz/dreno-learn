"use server";

import { parsePhoneNumber, CountryCode } from 'libphonenumber-js';

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
  } catch (e) {}

  const rawBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreno-learn.vercel.app";
  const baseUrl = rawBaseUrl.replace(/\/$/, ""); 
  
  // Routage dynamique vers les bonnes pages de succès
  const successPath = formData.product_type === "guides" ? "/guide-success" : "/course-success";

  const successParams = new URLSearchParams({
    email: cleanEmail,
    name: cleanFullName,
    phone: formData.phone,
    chariow_id: cleanProductId, 
    type: formData.product_type
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
      return { error: result.message || "Erreur lors de l'initiation du paiement." };
    }

    const checkoutUrl = result.data?.checkout_url || result.data?.payment?.checkout_url;
    const isCompleted = result.data?.status === 'completed' || result.data?.payment?.status === 'completed';

    if (isCompleted || !checkoutUrl) {
        return { url: finalRedirectUrl };
    }

    return { url: checkoutUrl };

  } catch (error: any) {
    console.error("Erreur serveur checkout:", error);
    return { error: "Erreur technique serveur. Veuillez réessayer." };
  }
}