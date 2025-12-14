import "./globals.css";
import Providers from "./providers";


export default function Layout({ children }: { children: React.ReactNode }) {

  return (
  <html lang="es">
      <body>

  <Providers>{children}</Providers>

      </body>
  </html>
 
  );
}