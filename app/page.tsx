'use client';

import Break from "@/components/Home/Break";
import Coordinator from "@/components/Home/Coordinator";
import Courses from "@/components/Home/Courses";
import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header";
import Projects from "@/components/Home/Projects";
import Structure from "@/components/Home/Structure";
import Welcome from "@/components/Home/Welcome";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-white overflow-x-hidden">
      {/* Header com navegação fixa */}
      <Header />

      {/* Main content */}
      <main className="pt-16">
        {/* Hero Section */}
        <Welcome />

        {/* Cursos */}
        <Courses />

        {/* Projetos */}
        <Projects />

        {/* Coordenador */}
        <Coordinator />

        {/* Estrutura */}
        <Structure />

        {/* CTA Section */}
        <Break />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
