// app/mockData/mock.ts
const MOCK_GUIDES = [
  {
    id: "1",
    chariow_id: "prd_dubai_123", // Ajout de l'ID Chariow
    title: "Visa Dubaï sans Agence : La Méthode Directe",
    slug: "visa-dubai-direct",
    description: "Obtenez votre visa pour les Émirats en moins de 72h. Ce guide vous donne les plateformes officielles et évite les commissions inutiles.",
    price: 15000,
    oldPrice: 35000,
    image_url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800",
    savings_text: "Économisez 85 000 FCFA de frais d'agence",
    category: "tourisme",
    is_published: true,
    content: ["Accès GDRFA/ICP", "Checklist documents", "Paiement carte locale"]
  },
  {
    id: "2",
    chariow_id: "prd_canada_456",
    title: "Étudier au Canada : Guide Complet Admission Solo",
    slug: "etudes-canada-admission",
    description: "Tout pour choisir votre université, rédiger votre lettre d'intention et monter votre dossier sans payer un consultant.",
    price: 45000,
    oldPrice: 95000,
    image_url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800",
    savings_text: "Économisez 500 000 FCFA de frais de dossier",
    category: "etudiant",
    is_published: true,
    content: ["Choix université", "Lettre d'intention", "Preuve de fonds"]
  },
  {
    id: "3",
    chariow_id: "prd_turquie_789",
    title: "E-Visa Turquie : Procédure 48h Chrono",
    slug: "evisa-turquie-express",
    description: "La liste exacte des pièces et le lien officiel pour obtenir votre visa turc sans intermédiaire.",
    price: 10000,
    oldPrice: 25000,
    image_url: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800",
    savings_text: "Économisez 40 000 FCFA sur votre voyage",
    category: "tourisme",
    is_published: true,
    content: ["Lien officiel E-Visa", "Liste hôtels", "Assurance voyage"]
  },
  {
    id: "4",
    chariow_id: "prd_france_001",
    title: "Visa Visiteur France : Montage Dossier Béton",
    slug: "visa-france-visiteur",
    description: "Évitez les refus inutiles. Apprenez à justifier vos fonds et votre attache au pays pour convaincre le consulat.",
    price: 25000,
    oldPrice: 50000,
    image_url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800",
    savings_text: "Économisez 200 000 FCFA d'honoraires",
    category: "travail",
    is_published: true,
    content: ["Justificatifs de fonds", "Lettre explicative", "Assurance Schengen"]
  },
  {
    id: "5",
    chariow_id: "prd_dubai_biz_002",
    title: "Business à Dubaï : Créer sa License en Solo",
    slug: "creer-entreprise-dubai",
    description: "Guide étape par étape pour ouvrir votre entreprise en Free-Zone sans passer par des cabinets juridiques coûteux.",
    price: 75000,
    oldPrice: 150000,
    image_url: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800",
    savings_text: "Économisez 1 500 000 FCFA de consulting",
    category: "travail",
    is_published: true,
    content: ["Choix Free-Zone", "Enregistrement du nom", "Visa investisseur"]
  }
];

export default MOCK_GUIDES;