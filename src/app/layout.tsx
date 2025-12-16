import "./globals.css";
import Providers from "./providers";
import { ToastContainer } from "react-toastify";


export default function Layout({ children }: { children: React.ReactNode }) {

  return (
  <html lang="es">
      <body>

  <Providers>{children}</Providers >
  <ToastContainer />

      </body>

  </html>
 
  );
}