import type React from "react";

interface TableProps<T, M extends string | null> {
  columnTemplate: string;
  headers: string[];
  tableItems: T[];
  tableCardType: React.ComponentType<{
    item: T;
    isLast: boolean;
    columnTemplate: string;
    gap: number;
    setOpenModal: React.Dispatch<React.SetStateAction<M>>;
  }>;
  getKey: (item: T, index: number) => string | number;
  gap: number;
  setOpenModal: React.Dispatch<React.SetStateAction<M>>;
}

const Table = <T, M extends string | null>({
  columnTemplate,
  headers,
  tableItems,
  tableCardType: TableCard,
  getKey,
  gap,
  setOpenModal,
}: TableProps<T, M>) => {
  return (
    <div className="flex flex-col items-center w-full ring-1 rounded-xl ring-gray-200">
      <div
        className={`grid ${columnTemplate} w-full gap-${gap} bg-gray-100 rounded-t-xl items-center h-12 px-8 text-sm border-b-1 border-gray-200`}
      >
        {headers.map((header, i) => (
          <p key={i} className="font-semibold hover:cursor-pointer">
            {header}
          </p>
        ))}
      </div>
      <div className="flex flex-col w-full">
        {tableItems.map((item, i) => (
          <TableCard
            key={getKey(item, i)}
            item={item}
            isLast={i === tableItems.length - 1}
            columnTemplate={columnTemplate}
            gap={gap}
            setOpenModal={setOpenModal}
          />
        ))}
        {tableItems.length === 0 && (
          <p className="flex justify-center items-center text-sm text-gray-400 h-48">
            No results. Please adjust your filters or try another search.
          </p>
        )}
      </div>
    </div>
  );
};

export default Table;
