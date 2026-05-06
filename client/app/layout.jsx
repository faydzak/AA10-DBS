import { Lora } from "next/font/google";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata = {
  title: "Todos",
  description: "A minimal task manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={lora.variable}>
      <body>{children}</body>
    </html>
  );
}