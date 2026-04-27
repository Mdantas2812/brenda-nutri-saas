import "./globals.css";

export const metadata = {
  title: "Brenda Nutri",
  description: "Sistema completo para nutrição",
  manifest: "/manifest.json"
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
