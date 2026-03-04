"use client";

import React, { useState, useEffect } from "react";

const WhatsAppButton = () => {
  // CONFIGURATION
  const phoneNumber = "237697238790"; // Remplacez par votre numéro
  const defaultMessage = "Bonjour, j'ai une question concernant le guide.";
  const scrollThreshold = 300; // Nombre de pixels à scroller avant apparition

  // ÉTATS
  const [isVisible, setIsVisible] = useState(false); // Visibilité globale (scroll)
  const [showPopup, setShowPopup] = useState(true); // Visibilité du message popup

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  // GESTION DU SCROLL
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > scrollThreshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    // Nettoyage de l'écouteur d'événement
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Si le bouton n'est pas censé être visible (haut de page), on ne rend rien (ou on le cache via CSS)
  // Ici on utilise une classe pour l'animation, donc on garde le rendu mais on joue sur l'opacité/position
  
  return (
    <div 
      className={`fixed bottom-20 right-6 z-50 flex flex-col items-end gap-2 transition-all duration-500 ease-in-out ${
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-20 pointer-events-none"
      }`}
    >
      
      {/* --- LE POPUP (BULLE D'INFO) --- */}
      {showPopup && (
        <div className="relative bg-white text-gray-800 p-4 rounded-xl shadow-xl max-w-[250px] border border-gray-100 mb-1 animate-fade-in-up">
          {/* Croix pour fermer le popup */}
          <button 
            onClick={() => setShowPopup(false)}
            className="absolute top-1 right-2 text-gray-400 hover:text-gray-600 text-xs"
          >
            ✕
          </button>
          
          <p className="text-sm font-medium leading-relaxed">
            👋 Une question sur le guide ? Contactez-nous directement ici 
          </p>
          
          {/* Petit triangle (flèche) en bas du popup */}
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45 border-b border-r border-gray-100"></div>
        </div>
      )}

      {/* --- LE BOUTON WHATSAPP --- */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-110 flex items-center justify-center w-16 h-16"
        aria-label="Contacter sur WhatsApp"
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-8 h-8"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.304-5.266c0-5.437 4.418-9.865 9.869-9.865 2.64 0 5.122 1.03 6.988 2.894a9.842 9.842 0 012.893 6.994c-.003 5.435-4.415 9.875-9.866 9.875m9.971-9.939c0-5.549-4.556-10.081-10.113-10.081-2.7 0-5.242 1.053-7.143 2.953-1.9 1.9-2.953 4.444-2.953 7.113 0 1.778.463 3.497 1.343 5.021l-1.428 5.223 5.374-1.411a9.98 9.98 0 014.807 1.238c5.557 0 10.05-4.538 10.05-9.989" />
        </svg>
      </a>
    </div>
  );
};

export default WhatsAppButton;