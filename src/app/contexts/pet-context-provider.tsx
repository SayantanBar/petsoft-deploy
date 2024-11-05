"use client";
import { Pet } from "@prisma/client";
import { PetEssentials } from "@/lib/types";
import { createContext, useState, useOptimistic } from "react";
import { addPet, deletePet, editPet } from "@/actions/actions";
import { toast } from "sonner";

type PetContextProviderProps = {
  data: Pet[];
  children: React.ReactNode;
};

// type of the context
type TPetContext = {
  pets: Pet[];
  selectedPetId: Pet["id"] | null;
  handleChangeSelectedPetId: (id: string) => void;
  selectedPet: Pet | undefined;
  lengthOfPets: number;
  handleNewPet: (newPet: PetEssentials) => Promise<void>;
  handleEditPet: (id: Pet["id"], newPet: PetEssentials) => Promise<void>;
  handleCheckoutPets: (petId: Pet["id"]) => Promise<void>;
};

// creating the context
export const PetContext = createContext<TPetContext | null>(null);

const PetContextProvider = ({ data, children }: PetContextProviderProps) => {
  const [optimisticPets, setOptimisticPets] = useOptimistic(
    data,
    (state, { action, payload }) => {
      switch (action) {
        case "add":
          return [...state, { ...payload, id: Math.random().toString() }];
        case "edit":
          return state.map((pet) => {
            if (pet.id === payload.id) {
              return { ...pet, ...payload.newPet };
            }
            return pet;
          });
        case "delete":
          return state.filter((pet) => pet.id !== payload);
        default:
          return state;
      }
    },
  );
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId);
  const lengthOfPets = optimisticPets.length;

  //event handler

  const handleNewPet = async (newPet: PetEssentials) => {
    setOptimisticPets({ action: "add", payload: newPet });
    const error = await addPet(newPet);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleEditPet = async (id: Pet["id"], newPet: PetEssentials) => {
    setOptimisticPets({ action: "edit", payload: { id, newPet } });
    const error = await editPet(id, newPet);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleCheckoutPets = async (petId: Pet["id"]) => {
    setOptimisticPets({ action: "delete", payload: petId });
    const error = await deletePet(petId);

    if (error) {
      toast.warning(error.message);
      return;
    }
    setSelectedPetId(null);
  };

  const handleChangeSelectedPetId = (id: Pet["id"]) => {
    setSelectedPetId(id);
  };
  return (
    <PetContext.Provider
      value={{
        pets: optimisticPets,
        handleCheckoutPets,
        selectedPetId,
        handleChangeSelectedPetId,
        selectedPet,
        handleNewPet,
        handleEditPet,
        lengthOfPets,
      }}
    >
      {children}
    </PetContext.Provider>
  );
};

export default PetContextProvider;
