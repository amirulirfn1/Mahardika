'use client';
import React from 'react';

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="signup-wizard-container">{children}</div>;
}
