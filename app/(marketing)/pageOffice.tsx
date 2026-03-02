import { Footer } from "@/components/Footer";
import { Categories } from "@/components/sections/Categories";
import { Features } from "@/components/sections/Features";
import { Hero } from "@/components/sections/Hero";
import { PopularCourses } from "@/components/sections/PopularCourses";
import { Testimonials } from "@/components/sections/Testimonials";
import { SocialProofPopup } from "@/components/ui/socialProofPopup";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <PopularCourses />
      <Features />
      <Testimonials/>
      <Footer/>

      <SocialProofPopup/>

      {/* On ajoutera ici les sections suivantes (Catégories, Top Courses, etc.) */}
    </>
  );
}