import { useEffect, useState, useMemo } from "react";
import debounce from "lodash.debounce";

export default function usePaginatedSearch({
  activeTab,
  activeKey = "ExamendeGrado",
  initialPage = 1,
  initialPageSize = 10,
  loader, // (page, pageSize, word) => Promise
}) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchTerm, setSearchTerm] = useState("");

  // carga inicial y cambio de pestaña
  useEffect(() => {
    if (activeTab === activeKey) loader(page, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page, pageSize]);

  // reset al cambiar pestaña
  useEffect(() => {
    setPage(initialPage);
    setPageSize(initialPageSize);
  }, [activeTab, initialPage, initialPageSize]);

  // debounce de búsqueda
  const runDebounced = useMemo(
    () =>
      debounce((term) => {
        if (activeTab === activeKey) {
          loader(1, pageSize, term);
        }
      }, 500),
    [activeTab, activeKey, loader, pageSize]
  );

  useEffect(() => {
    runDebounced(searchTerm);
    return () => runDebounced.cancel();
  }, [searchTerm, runDebounced]);

  const onPageChange = (event) => {
    setPage(event.page + 1);
    setPageSize(event.rows);
  };

  return {
    page,
    pageSize,
    searchTerm,
    setSearchTerm,
    onPageChange,
    setPage,
    setPageSize,
  };
}
