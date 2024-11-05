"use client";
import { createContext, useState } from "react";
type SearchContextProviderProps = {
  children: React.ReactNode;
};
type TSearchContext = {
  handleChangeSearchQuery: (newValeu: string) => void;
  searchQuery: string;
};
export const SearchContext = createContext<TSearchContext | null>(null);

const SearchContextProvider = ({ children }: SearchContextProviderProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleChangeSearchQuery = (newValue: string) => {
    setSearchQuery(newValue);
  };
  return (
    <SearchContext.Provider value={{ handleChangeSearchQuery, searchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContextProvider;
