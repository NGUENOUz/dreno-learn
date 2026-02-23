"use server";

import { parsePhoneNumber, CountryCode } from 'libphonenumber-js';

export async function initiateChariowCheckout(formData: {
  product_id: string;
  email: string;
  full_name: string;
  phone: string; // Format international reçu du client
  promo_code: string; 
}) {
  // 1. Préparation des noms pour Chariow
  const nameParts = formData.full_name.trim().split(" ");
  const first_name = nameParts[0] || "Client";
  const last_name = nameParts.slice(1).join(" ") || "Elite";

  // 2. Analyse et nettoyage du numéro de téléphone
  let cleanNumber = "";
  let countryCode: CountryCode = "CM"; 

  try {
    const phoneNumber = parsePhoneNumber(formData.phone);
    if (phoneNumber) {
      cleanNumber = phoneNumber.nationalNumber as string;
      countryCode = phoneNumber.country as CountryCode;
    }
  } catch (e) {
    // Repli si le parsing échoue
    cleanNumber = formData.phone.replace(/\D/g, "");
  }

  // 3. Configuration des URLs (Base URL + Redirection avec paramètres)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreno-learn.vercel.app";
  
  // On encode les données pour les passer en toute sécurité dans l'URL de succès
  const successParams = new URLSearchParams({
    email: formData.email,
    name: formData.full_name,
    phone: formData.phone
  }).toString();

  const finalRedirectUrl = `${baseUrl}/courses/success?${successParams}`;

  try {
    // 4. Appel à l'API Chariow
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
        // Utilisation correcte du champ selon la documentation Chariow
        discount_code: formData.promo_code ? formData.promo_code.trim().toUpperCase() : null, 
        redirect_url: finalRedirectUrl,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.message || "La validation du paiement a échoué" };
    }

    // 5. GESTION ÉLITE DU PARCOURS SANS COUTURE
    const checkoutUrl = result.data?.checkout_url || result.data?.payment?.checkout_url;
    
    // Vérification si la commande est déjà marquée comme payée (ex: réduction 100% / Gratuit)
    const isCompleted = result.data?.status === 'completed' || result.data?.payment?.status === 'completed';

    // Si c'est gratuit ou complété, on renvoie vers l'URL de succès avec les données
    if (isCompleted || !checkoutUrl) {
        return { url: finalRedirectUrl };
    }

    // Sinon on renvoie l'URL de la passerelle Chariow
    return { url: checkoutUrl };

  } catch (error: any) {
    console.error("Erreur critique Checkout Chariow:", error);
    return { error: "Une erreur est survenue lors de l'initialisation du paiement" };
  }
}