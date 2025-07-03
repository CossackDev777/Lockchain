"use client";

import { AppFooter } from "@/components/layouts/app-footer";
import { AppHeader } from "@/components/layouts/app-header";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/feature";
import { Soroban } from "@/components/landing/soroban";
import { Coming } from "@/components/landing/coming";
import { Iconic } from "@/components/landing/iconic";
import { Final } from "@/components/landing/final";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0B0F19]">
      <div className="bg-[#0B0F19] relative overflow-hidden">
        <AppHeader />
      </div>
      <main className="flex-1">
        <Hero></Hero>
        <Features></Features>
        <Soroban></Soroban>
        <Coming></Coming>
        <Iconic></Iconic>
        <Final></Final>
        <AppFooter />
      </main>
    </div>
  );
}
