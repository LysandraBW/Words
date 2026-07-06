import { Option } from "@/components/input/InputDropdown";
import { useEffect, useState } from "react";

export const ASCENDING = true;
export const DESCENDING = false;

interface Parameters<ObjectType> {
    objects: ObjectType[]; 
    pageSize?: number;
}

export default function useFilterObjects<ObjectType>(params: Parameters<ObjectType>) {
    // Sort
    const [sortKey, setSortKey] = useState<keyof ObjectType>();
    const [sortDirection, setSortDirection] = useState<boolean|null>(null);
    
    // Search
    const [searchKey, setSearchKey] = useState<keyof ObjectType>();
    const [search, setSearch] = useState("");

    // Filtered Objects
    const [filteredObjects, setFilteredObjects] = useState<ObjectType[]>([]);

    // Page
    const pageSize = params.pageSize ?? 10; 
    const [pageIndex, setPageIndex] = useState(0);
    const lastPageIndex = (filteredObjects.length / pageSize) - 1;

    const sortObjects = (sortKey: keyof ObjectType, sortDirection: boolean | null, objects: ObjectType[]) => {
        const sorted: ObjectType[] = objects.toSorted((a: ObjectType, b: ObjectType) => String(a[sortKey]).localeCompare(String(b[sortKey])));
        if (sortDirection === DESCENDING)
            return sorted.reverse();
        return sorted;
    }

    const searchObjects = (searchKey: keyof ObjectType, search: string, objects: ObjectType[]) => {
        const searchLowered = search.toLowerCase();
        return objects.filter(object => String(object[searchKey]).toLowerCase().includes(searchLowered)).sort((a, b) => {
            const aValue = String(a[searchKey]).toLowerCase();
            const bValue = String(b[searchKey]).toLowerCase();
            const aStarts = aValue.startsWith(searchLowered);
            const bStarts = bValue.startsWith(searchLowered);

            if (aStarts && !bStarts)
                return -1;
            if (!aStarts && bStarts)
                return 1;
            return aValue.localeCompare(bValue);
        });
    }

    const sliceObjects = (pageIndex: number, pageSize: number, objects: ObjectType[]) => {
        return objects.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
    }

    const goToNextSortDirection = (direction: boolean|null) => {
        setSortDirection(direction === false ? null : direction === true ? false : direction === null ? true : null); 
    }

    const goToPrevPage = () => {
        const prevPageIndex = pageIndex - 1;
        if (prevPageIndex < 0) {
            setPageIndex(lastPageIndex);
            return;
        }
        setPageIndex(prevPageIndex);
    }

    const goToNextPage = () => {
        const nextPageIndex = pageIndex + 1;
        if (nextPageIndex > lastPageIndex) {
            setPageIndex(0);
            return;
        }
        setPageIndex(nextPageIndex);
    }

    const goToPage = (pageIndex: number) => {
        if (pageIndex < 0) {
            setPageIndex(0);
        }
        else if (pageIndex > lastPageIndex) {
            setPageIndex(lastPageIndex);
        }
        else {
            setPageIndex(pageIndex);
        }
    }

    useEffect(() => {
        if (!params.objects.length) {
            setFilteredObjects([]);
            return;
        }
        const searchedObjects = searchKey ? searchObjects(searchKey, search, params.objects) : params.objects;
        const sortedObjects = sortKey ? sortObjects(sortKey, sortDirection, searchedObjects) : searchedObjects;
        const slicedObjects = sliceObjects(pageIndex, pageSize, sortedObjects);
        setFilteredObjects(slicedObjects);
    }, [
        sortKey, 
        sortDirection, 
        searchKey, 
        search, 
        pageSize, 
        pageIndex, 
        params.objects.length
    ]);

    return {
        sortKey,
        sortDirection,
        searchKey,
        search,
        pageSize,
        pageIndex,
        lastPageIndex,
        setSortKey,
        setSortDirection,
        setSearchKey,
        setSearch,
        goToNextSortDirection,
        goToPrevPage,
        goToNextPage,
        goToPage,
        filteredObjects
    }
}