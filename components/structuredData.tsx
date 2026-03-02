export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Guide Entrée Express Canada 2026",
    "image": "https://res.cloudinary.com/dcsl6xhli/image/upload/v1772423462/guide_entr%C3%A9e_express_canada_3_hqgkmm.png",
    "description": "Un guide numérique complet pour aider les candidats africains à immigrer au Canada via le système Entrée Express sans passer par une agence.",
    "brand": {
      "@type": "Brand",
      "name": "DrenoLearn"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://drenolearn.com",
      "priceCurrency": "XAF",
      "price": "2900",
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock",
      "category": "Digital Guide"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "842"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "Travailleurs qualifiés, Étudiants, Francophones"
    }
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Peut-on immigrer au Canada sans agence ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, absolument. Le système Entrée Express est conçu pour gérer les candidatures en ligne. Notre guide vous montre étape par étape comment créer votre profil, soumettre vos documents et recevoir une invitation sans intermédiaire."
        }
      },
      {
        "@type": "Question",
        "name": "Quel est le coût du guide DrenoLearn ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Le guide est actuellement en promotion à 2900 FCFA (environ 5 USD) au lieu de 15000 FCFA. Il inclut le PDF, des modèles de CV canadiens et l'accès à un groupe WhatsApp d'entraide."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </>
  );
}