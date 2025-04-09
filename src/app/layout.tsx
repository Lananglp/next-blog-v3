import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ReduxProvider from "@/components/redux-provider";
import { ThemeProvider } from "@/components/theme-provider";
// import { fontPoppins } from "@/lib/font";
import AuthProvider from "@/components/auth-check-provider";
import { Poppins, Turret_Road, Orbitron, Inter, Open_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
})

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const fontTitle = Turret_Road({
  variable: "--font-family-title",
  subsets: ["latin"],
  // weight: ["400", "500", "700", "800", "900"],
  weight: ["200", "300", "400", "500", "700", "800"],
})

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_APP_NAME as string,
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME as string}`,
  },
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION as string,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} ${openSans.variable} ${poppins.variable} ${fontTitle.variable} antialiased`}
      >
        <Analytics />
        <ReduxProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </AuthProvider>
        </ReduxProvider>
        <Toaster />
      </body>
    </html>
  );
}
