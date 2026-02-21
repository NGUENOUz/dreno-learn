"use client";

import { CourseCard } from "@/components/ui/CourseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const MOCK_COURSES = [
  {
    id: "1",
    title: "Marketing Digital : Devenez un Expert en 2026",
    category: "Marketing",
    price: "15 000 FCFA",
    oldPrice: "25 000 FCFA",
    rating: 4.9,
    reviews: 128,
    duration: "04 Semaines",
    instructor: "Kevin Perry",
    badge: "-40%",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "Importation Chine : Le Guide Ultime de l'Acheteur",
    category: "Business",
    price: "20 000 FCFA",
    rating: 4.8,
    reviews: 95,
    duration: "03 Semaines",
    instructor: "Max Alexix",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "UI/UX Design : Créez des Interfaces Modernes",
    category: "Design",
    price: "25 000 FCFA",
    oldPrice: "35 000 FCFA",
    rating: 5.0,
    reviews: 64,
    duration: "06 Semaines",
    instructor: "Sarah Design",
    badge: "Populaire",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=800&auto=format&fit=crop"
  }
];

export function PopularCourses() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-blue-600 text-blue-600 font-bold px-4 py-1 rounded-full uppercase tracking-widest text-[10px]">
            Apprenez des meilleurs
          </Badge>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">
            Nos Formations <span className="text-blue-600">Populaires</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">
            Découvrez les cours qui transforment la vie de milliers d&apos;étudiants à travers le continent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_COURSES.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button asChild size="lg" className="rounded-full bg-slate-900 hover:bg-blue-600 text-white px-10 h-14 font-bold transition-all shadow-xl shadow-slate-200">
            <Link href="/courses">Voir tout le catalogue</Link>
          </Button>
        </div>

      </div>
    </section>
  );
}