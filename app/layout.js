import './globals.css';

export const metadata = {
  title: 'Taata Owen Supermarket',
  description: "Taata Owen Supermarket on Nizam Road, Jinja — fresh produce, groceries, household goods and our in-house restaurant.",
  icons: { icon: '/images/favicon.png' },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
