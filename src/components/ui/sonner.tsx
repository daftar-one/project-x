"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner theme="dark" className="toaster group" {...props} />
);

export { Toaster };
