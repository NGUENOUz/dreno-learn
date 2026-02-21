"use server";

export async function initiateChariowCheckout(formData: {
  product_id: string;
  email: string;
  full_name: string;
  phone: string;
}) {
  const nameParts = formData.full_name.trim().split(" ");
  const first_name = nameParts[0] || "Client";
  const last_name = nameParts.slice(1).join(" ") || "Dreno";

  // Nettoyage : on garde uniquement les chiffres
  let cleanPhone = formData.phone.replace(/\D/g, "");
  
  // Logique de détection simple du code pays (Ex: 237 pour CM, 221 pour SN, 225 pour CI)
  let countryCode = "SN"; // Par défaut
  
  if (cleanPhone.startsWith("237")) {
    countryCode = "CM";
    cleanPhone = cleanPhone.substring(3); // On enlève le 237 pour envoyer juste le numéro
  } else if (cleanPhone.startsWith("225")) {
    countryCode = "CI";
    cleanPhone = cleanPhone.substring(3);
  } else if (cleanPhone.startsWith("221")) {
    countryCode = "SN";
    cleanPhone = cleanPhone.substring(3);
  } else if (cleanPhone.length > 9) {
    // Si le numéro est long et qu'on n'a pas détecté le préfixe, 
    // on peut laisser Chariow essayer de deviner ou forcer un code.
    // Pour DrenoLearn, le mieux est de demander à l'utilisateur de choisir ou d'envoyer tel quel.
  }

  try {
    const response = await fetch("https://api.chariow.com/v1/checkout", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CHARIOW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: formData.product_id, // L'ID prd_ju2u42 est bien reçu ici désormais
        email: formData.email,
        first_name: first_name,
        last_name: last_name,
        phone: {
          number: cleanPhone, // Le numéro sans le préfixe pays
          country_code: countryCode, // Le code ISO (CM, SN, CI, etc.)
        },
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/success`,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      // On renvoie l'erreur précise de Chariow pour aider l'utilisateur
      throw new Error(result.message || "Erreur de validation");
    }

    return { url: result.data.payment.checkout_url };
  } catch (error: any) {
    return { error: error.message };
  }
}