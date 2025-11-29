import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDebounce } from "./useDebouce";

export function useDebouncedSearch(searchFunction: Dispatch<SetStateAction<{}>>) {
    const [searchInput, setSearchInput] = useState('')
    const debouncedSearch = useDebounce(searchInput, 500);

    useEffect(() => {
        searchFunction(prev => ({ ...prev, search: debouncedSearch }))
    }, [debouncedSearch, searchFunction])

    return { searchInput, setSearchInput }
}
