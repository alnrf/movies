import { useMemo } from "react";

export function useSortByDate<T>(
  data: T[],
  dateField: keyof T,
  order: "asc" | "desc" = "desc"
): T[] {
  const sorted = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return [...data].sort((a, b) => {
      const valueA = a[dateField];
      const valueB = b[dateField];

      const dateA =
        typeof valueA === "string" ? new Date(valueA) : null;
      const dateB =
        typeof valueB === "string" ? new Date(valueB) : null;

      const timeA =
        dateA instanceof Date && !isNaN(dateA.getTime())
          ? dateA.getTime()
          : 0;

      const timeB =
        dateB instanceof Date && !isNaN(dateB.getTime())
          ? dateB.getTime()
          : 0;

      return order === "asc" ? timeA - timeB : timeB - timeA;
    });
  }, [data, dateField, order]);

  return sorted;
}