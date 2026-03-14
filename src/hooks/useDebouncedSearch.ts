import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDebounce } from "./useDebouce";

export function useDebouncedSearch<T extends { search?: string }>(
  searchFunction: Dispatch<SetStateAction<T>>,
) {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    searchFunction((prev) => {
      if (prev.search === debouncedSearch) return prev;
      return { ...prev, search: debouncedSearch } as T;
    });
  }, [debouncedSearch, searchFunction]);

  return { searchInput, setSearchInput };
}
