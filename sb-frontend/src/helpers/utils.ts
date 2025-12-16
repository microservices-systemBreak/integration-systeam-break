import { toast } from "react-toastify";

type AvailableTypes = "success" | "error" | "warning" | "info";
const defaultTime = 5000;

export const Notificaction = (
  text: string,
  type: AvailableTypes,
  closeTime?: number
) => {
  const baseOptions = {
    position: "top-right" as const,
    autoClose: closeTime ?? defaultTime,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  switch (type) {
    case "success":
      toast.success(text, {
        ...baseOptions,
        theme: "colored",
        style: {
          backgroundColor: "#4c1d95", // morado oscuro
          color: "#ffffff",
        },
      });
      break;

    case "error":
      toast.error(text, {
        ...baseOptions,
        theme: "colored",
        style: {
          backgroundColor: "#7f1d1d", // rojo oscuro
          color: "#ffffff",
        },
      });
      break;

    case "warning":
      toast.warn(text, {
        ...baseOptions,
        theme: "colored",
        style: {
          backgroundColor: "#78350f", // amarillo/marrón
          color: "#ffffff",
        },
      });
      break;

    case "info":
      toast.info(text, {
        ...baseOptions,
        theme: "colored",
        style: {
          backgroundColor: "#6d28d9", // morado medio
          color: "#ffffff",
        },
      });
      break;

    default:
      break;
  }
};
