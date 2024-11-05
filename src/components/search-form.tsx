"use client";
import { useSearchContext } from "@/lib/hook";

const SearchForm = () => {
  const { searchQuery, handleChangeSearchQuery } = useSearchContext();
  return (
    <form className="w-full h-full">
      <input
        className="w-full h-full bg-white/20 rounded-md outline-none px-5 transition focus:bg-white/50 hover:bg-white/30 placeholder:text-white/50"
        placeholder="search pets"
        type="search"
        onChange={(e) => handleChangeSearchQuery(e.target.value)}
        value={searchQuery}
      />
    </form>
  );
};

export default SearchForm;
