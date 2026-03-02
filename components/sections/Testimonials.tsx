"use client";

import * as React from "react";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const TESTIMONIALS = [
  {
    name: "Awa Diop",
    role: "Entrepreneuse",
    content: "Grâce à la formation Importation Chine, j'ai pu lancer ma boutique en ligne en seulement 2 semaines. Le support WhatsApp est un vrai plus !",
    avatar: "https://picsum.photos/seed/awa/100/100",
    rating: 5
  },
  {
    name: "Jean-Marc Koffi",
    role: "Freelance",
    content: "Le cours sur le Marketing Digital est incroyablement complet. J'ai doublé mon nombre de clients en appliquant les stratégies de Kevin.",
    avatar: "https://picsum.photos/seed/jean/100/100",
    rating: 5
  },
  {
    name: "Sarah Toure",
    role: "Étudiante",
    content: "Je n'y connaissais rien en montage vidéo. Aujourd'hui, je crée des Reels professionnels pour des marques. Merci Dreno learn !",
    avatar: "https://picsum.photos/seed/sarah/100/100",
    rating: 5
  },
  {
    name: "Moussa Traoré",
    role: "Commerçant",
    content: "Une plateforme simple et efficace. On sent que les formations sont pensées pour notre réalité en Afrique. Je recommande à 100%.",
    avatar: "https://picsum.photos/seed/moussa/100/100",
    rating: 4
  }
];

export function Testimonials() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <section className="py-20 bg-blue-600 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ce que nos <span className="text-blue-200">étudiants</span> disent
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto font-medium">
            Rejoignez des milliers de personnes qui ont transformé leur carrière avec nos formations.
          </p>
        </div>

        <Carousel
          plugins={[plugin.current]}
          className="w-full max-w-5xl mx-auto"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-4">
            {TESTIMONIALS.map((t, i) => (
              <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="bg-white p-8 rounded-4xl h-full flex flex-col shadow-xl">
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <div className="relative mb-6">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-blue-50 opacity-10" />
                    <p className="text-slate-600 italic leading-relaxed relative z-10">
                      &quot;{t.content}&quot;
                    </p>
                  </div>

                  <div className="mt-auto flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-100">
                      <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 leading-none mb-1">{t.name}</h4>
                      <p className="text-xs text-slate-400 font-medium">{t.role}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="bg-white/20 border-none text-white hover:bg-white hover:text-blue-600" />
            <CarouselNext className="bg-white/20 border-none text-white hover:bg-white hover:text-blue-600" />
          </div>
        </Carousel>

      </div>
    </section>
  );
}