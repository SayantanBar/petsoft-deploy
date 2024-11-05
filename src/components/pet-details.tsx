"use client";
import Image from "next/image";
import { usePetContext } from "@/lib/hook";
import PetButton from "./pet-button";
import { useForm } from "react-hook-form";
const PetDetails = () => {
  const { selectedPet, handleCheckoutPets } = usePetContext();

  return (
    <section className="h-full w-full flex flex-col">
      {!selectedPet ? (
        <div className="h-full flex justify-center items-center">
          <EmptyView />
        </div>
      ) : (
        <>
          <div className="flex items-center bg-white px-8 py-5 border-b border-light">
            <Image
              src={selectedPet.imageUrl}
              alt="pet image"
              height={75}
              width={75}
              className="w-[75px] h-[75px] rounded-full object-cover"
            />
            <h2 className="text-3xl font-semibold leading-7 ml-5">
              {selectedPet.name}
            </h2>
            <div className="ml-auto space-x-3">
              <PetButton actionType="edit">Edit</PetButton>
              <PetButton
                actionType="checkout"
                onClick={async () => await handleCheckoutPets(selectedPet.id)}
              >
                Checkout
              </PetButton>
            </div>
          </div>
          <div className="flex justify-around px-5 py-10 text-center">
            <div>
              <h3 className="text-[13px] font-medium uppercase text-zinc-700">
                Owner Name
              </h3>
              <p className="mt-1 text-lg text-zinc-800">
                {selectedPet.ownerName}
              </p>
            </div>
            <div>
              <h3 className="text-[13px] font-medium uppercase text-zinc-700">
                Age
              </h3>
              <p className="mt-1 text-lg text-zinc-800">{selectedPet.age}</p>
            </div>
            <div></div>
          </div>
          <section className="bg-white flex-1 px-7 py-5 rounded-md mb-9 mx-8 border border-light">
            {selectedPet.notes}
          </section>
        </>
      )}
    </section>
  );
};

function EmptyView() {
  return <p className="font-medium text-2xl">No pet selected</p>;
}

export default PetDetails;
