import { Option } from "@/components/input/InputDropdown";
import { useEffect, useState } from "react";

export const ASCENDING = true;
export const DESCENDING = false;

interface Parameters<ObjectType extends {[k: string]: any}> {
    objects: ObjectType[];
    pageSize?: number;
    getObjectValueCallback?: (key: string, object: ObjectType) => string;
}

export default function useFilterObjects<ObjectType extends {[k: string]: any}>(params: Parameters<ObjectType>) {
    // Sort
    const [sortKey, setSortKey] = useState<string>();
    const [sortDirection, setSortDirection] = useState<boolean|null>(null);
    
    // Search
    const [searchKey, setSearchKey] = useState<string>();
    const [search, setSearch] = useState("");

    // Filtered Objects
    const [filteredObjects, setFilteredObjects] = useState<ObjectType[]>([]);

    // Page
    const pageSize = params.pageSize ?? 10; 
    const [pageIndex, setPageIndex] = useState(0);
    const lastPageIndex = Math.ceil(filteredObjects.length / pageSize) - 1;

    const getObjectValue = (key: string, object: ObjectType) => {
        if (key in object)
            return String(object[key]);
        if (params.getObjectValueCallback)
            return params.getObjectValueCallback(key, object)
        return "";
    }

    const sortObjects = (sortKey: string, sortDirection: boolean | null, objects: ObjectType[]) => {
        const sorted: ObjectType[] = objects.toSorted((a: ObjectType, b: ObjectType) => getObjectValue(sortKey, a).localeCompare(getObjectValue(sortKey, b)));
        if (sortDirection === DESCENDING)
            return sorted.reverse();
        return sorted;
    }

    const searchObjects = (searchKey: string, search: string, objects: ObjectType[]) => {
        const searchLowered = search.toLowerCase();
        return objects.filter(object => getObjectValue(searchKey, object).toLowerCase().includes(searchLowered)).sort((a, b) => {
            const aValue = getObjectValue(searchKey, a).toLowerCase();
            const bValue = getObjectValue(searchKey, b).toLowerCase();
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

    const goToPageStr = (pageNumber: string) => {
        pageNumber = pageNumber.trim();
        if (!/^[0-9]+$/.test(pageNumber))
            return;
        goToPage(parseInt(pageNumber));
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
        goToPageStr,
        filteredObjects
    }
}