import React from "react";

export function Table({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <table className={`min-w-full text-sm ${className}`}>{children}</table>;
}

export function THead({ children }: { children: React.ReactNode }) {
  return <thead>{children}</thead>;
}

export function TBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TR({ children }: { children: React.ReactNode }) {
  return <tr className="border-t">{children}</tr>;
}

export function TH({ children }: { children: React.ReactNode }) {
  return <th className="py-2 pr-4 text-left text-gray-600">{children}</th>;
}

export function TD({ children }: { children: React.ReactNode }) {
  return <td className="py-2 pr-4">{children}</td>;
}


