"use client";
import { usePetContext, useSearchContext } from "@/lib/hook";
import Image from "next/image";
import { cn } from "@/lib/utils";
const PetList = () => {
  const { pets, selectedPetId, handleChangeSelectedPetId } = usePetContext();
  const { searchQuery } = useSearchContext();

  const filterPets = pets.filter((pet) =>
    pet.name.toLowerCase().includes(searchQuery),
  );
  return (
    <ul className="bg-white border-b border-light">
      {filterPets.map((pet) => (
        <li key={pet.id}>
          <button
            onClick={() => handleChangeSelectedPetId(pet.id)}
            className={cn(
              "flex px-5 text-base transition items-center h-[70px] w-full cursor-pointer gap-3 hover:bg-[#EFF1F2] focus:bg-[#EFF1F2]",
              {
                "bg-[#EFF1F2]": selectedPetId === pet.id,
              },
            )}
          >
            <Image
              src={pet.imageUrl}
              alt="placeholder image"
              height={45}
              width={45}
              className="w-[45px] h-[45px] rounded-full object-cover"
            />
            <p className="font-semibold">{pet.name}</p>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default PetList;
