import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: 'Delichon | Custom Software & Web Development Company India',
  description: 'Delichon is a premier software development company in Kerala, India. We engineer custom web applications, mobile apps, and digital products for global businesses.',
  alternates: {
    canonical: 'https://delichon.com/',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
  openGraph: {
    title: 'Delichon | Custom Software & Web Development Company India',
    description: 'Delichon is a premier software development company in Kerala, India. We engineer custom web applications, mobile apps, and digital products for global businesses.',
    url: 'https://delichon.com/',
    siteName: 'Delichon',
    images: [
      {
        url: 'https://delichon.com/logo.png',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Delichon | Custom Software & Web Development Company India',
    description: 'Delichon is a premier software development company in Kerala, India. We engineer custom web applications, mobile apps, and digital products for global businesses.',
    images: ['https://delichon.com/logo.png'],
  },
};

export default function RootLayout({ children }) {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Delichon",
      "url": "https://delichon.com/",
      "logo": "https://delichon.com/logo.png",
      "sameAs": [
        "https://www.linkedin.com/company/delichon"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "",
        "contactType": "customer service",
        "email": "hello@delichon.com",
        "areaServed": "Worldwide",
        "availableLanguage": ["en"]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Delichon",
      "image": "https://delichon.com/logo.png",
      "url": "https://delichon.com/",
      "email": "hello@delichon.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Kochi",
        "addressRegion": "Kerala",
        "addressCountry": "India"
      },
      "priceRange": "$$$",
      "areaServed": [
        { "@type": "Country", "name": "India" },
        { "@type": "Country", "name": "United States" },
        { "@type": "Country", "name": "United Kingdom" }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What custom software development services do you offer?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Delichon offers a comprehensive range of custom software development services, including front-end engineering, full-stack web application development, Android & iOS mobile app development, UI/UX product design, and digital product engineering for startups and global enterprises."
          }
        },
        {
          "@type": "Question",
          "name": "Do you serve clients internationally?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, while our engineering hub is based in Kerala, India, we partner with clients, startups, and enterprises globally to deliver premium, scalable software platforms and web applications."
          }
        },
        {
          "@type": "Question",
          "name": "How do you ensure the performance and maintainability of your web applications?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We approach development with an engineering-led mindset, focusing on precision, modular architectures, extensively documented code, and performance optimization techniques to ensure long-term scalability and reliability."
          }
        }
      ]
    }
  ];

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        {schemas.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        {children}
      </body>
    </html>
  );
}
