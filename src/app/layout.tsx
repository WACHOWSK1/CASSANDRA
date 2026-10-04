import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'CASSANDRA: O Resgate e a Ascensão Profana | Painel do Mestre',
  description: 'Sistema Tático e Navegador Interativo do Mestre para a aventura Cassandra (Tormenta20 / Dark Fantasy).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased select-none">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
