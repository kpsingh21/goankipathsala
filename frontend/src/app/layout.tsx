import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Goan Ki Pathshala (गाँव की पाठशाला) - School SaaS",
  description: "Production-grade multi-tenant school management and digital learning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-full antialiased">
      <body className="min-h-full font-sans bg-slate-50 text-slate-900 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
