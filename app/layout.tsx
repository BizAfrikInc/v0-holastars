import { GoogleAnalytics } from '@next/third-parties/google';
import { Metadata } from 'next';
import React from 'react';
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import '@/styles/global.css';
import { GA_MEASUREMENT_ID } from "@/google-analytics";

export const metadata: Metadata = {
  title: 'Feedback & Reputation Management Platform | Hola Stars | AI Powered | Transform Customer Feedback into Growth',
  description: 'Transform customer feedback into your biggest growth engine. Collect, analyze, and leverage customer insights with our all-in-one reputation management platform.',
  keywords: [
    'Feedback Management', 'Feedback Collection', 'Ratings',
    'Reputation Management', 'Feedback', 'Reputation', 'Hola Stars',
    'AI Powered', 'Customer Insights', 'Customer Feedback',
    'Customer Experience', 'Business Growth'
  ],
  openGraph: {
    title: 'Feedback & Reputation Management Platform | Hola Stars | AI Powered',
    description: 'Transform customer feedback into your biggest growth engine.',
    url: 'https://holastars.com',
    siteName: 'Hola Stars',
    images: [
      {
        url: 'https://holastars.com/images/logos/holastars.png',
        width: 1200,
        height: 630,
        alt: 'Hola Stars Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-Powered Feedback & Reputation Management Platform | Hola Stars',
    description: 'Transform customer feedback into your biggest growth engine.',
    images: ['https://holastars.com/images/logos/holastars.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/images/logos/holastars.ico',
    shortcut: '/images/logos/holastars.ico',
    apple: '/images/logos/holastars.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
    <head>
      <link rel="icon" href="/images/logos/holastars.ico" sizes="16x16 32x32" />
      <link rel="apple-touch-icon" href="/images/logos/holastars.png" sizes="180x180" />
      <link rel="manifest" href="/site.webmanifest" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Hola Stars",
            url: "https://holastars.com",
            logo: "https://holastars.com/images/logos/holastars.png",
            sameAs: [
              "https://www.facebook.com/holastars",
              "https://twitter.com/holastars",
              "https://www.instagram.com/holastars",
              "https://www.linkedin.com/company/holastars"
            ]
          }),
        }}
      />
      <title>Feedback & Reputation Management Platform | Hola Stars | AI Powered</title>
    </head>
    <body>
    <Header />
    <TooltipProvider>
      <Toaster />
      <Sonner />
    {children}
    </TooltipProvider>
    <Footer />
    {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
    </body>
    </html>
  );
}
