// Données pour l'utilisateur
export const MOCK_USER = {
  id: "user_01",
  name: "Tresor",
  email: "tresor@drenolearn.com",
  is_premium: true,
  points: 1250,
  streak: 3
};

// Données pour les cours (Design Premium)
export const MOCK_COURSES = [
  {
    id: "c_01",
    title: "Importation Chine : Le Guide Ultime 2026",
    slug: "importation-chine-2026",
    price: 20000,
    old_price: 35000,
    image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
    category: "Business",
    duration: "8h 30m",
    rating: 4.8
  },
  {
    id: "c_02",
    title: "Maîtriser Facebook Ads pour le Marché Africain",
    slug: "facebook-ads-afrique",
    price: 15000,
    old_price: 25000,
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    category: "Marketing",
    duration: "12h 15m",
    rating: 4.9
  },
  {
    id: "c_03",
    title: "Design Graphique : De Zéro à Pro avec Canva",
    slug: "canva-pro-design",
    price: 10000,
    old_price: 18000,
    image_url: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop",
    category: "Design",
    duration: "6h 45m",
    rating: 4.7
  }
];

// Données pour les notifications
export const MOCK_NOTIFICATIONS = [
  { id: 1, title: "Bienvenue sur la plateforme !", description: "Votre accès Elite est maintenant activé.", type: "welcome" },
  { id: 2, title: "Nouvelle formation disponible", description: "Découvrez le guide sur le Mindset d'investisseur.", type: "new_course" }
];