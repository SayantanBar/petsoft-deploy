import { PetContext } from "@/app/contexts/pet-context-provider";
import { SearchContext } from "@/app/contexts/search-context-provider";
import { useContext } from "react";

export function usePetContext() {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error("usePetContext must be used with petcontext provider");
  }
  return context;
}
export function useSearchContext() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch context must be used in SearchContext provider");
  }
  return context;
}
