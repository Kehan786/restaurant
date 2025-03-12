import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div
      className={`border p-4 rounded-lg shadow-sm ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;