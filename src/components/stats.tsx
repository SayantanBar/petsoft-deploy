"use client";
import { usePetContext } from "@/lib/hook";
const Stats = () => {
  const { lengthOfPets } = usePetContext();
  return (
    <section className="text-center">
      <p className="text-2xl font-bold leading-6">{lengthOfPets}</p>
      <p className="opacity-80">current guest</p>
    </section>
  );
};

export default Stats;
