import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevNest",
  description: "Your developer knowledge hub — organize snippets, prompts, commands, notes, and more.",
  openGraph: {
    title: "DevNest",
    description: "Your developer knowledge hub — organize snippets, prompts, commands, notes, and more.",
    siteName: "DevNest",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${firaCode.variable} dark`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        {children}
        <Toaster richColors theme="dark" />
      </body>
    </html>
  );
}
