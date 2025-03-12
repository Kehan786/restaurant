import React from "react";

type TableProps = {
  children: React.ReactNode;
};

const Table: React.FC<TableProps> = ({ children }) => {
  return (
    <table className="w-full border-collapse border border-gray-200">
      {children}
    </table>
  );
};

export default Table;