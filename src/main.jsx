import React from "react"
import ReactDOM from "react-dom/client"
import { Toaster } from "react-hot-toast"
import App from "./App"
import "./index.css"

// punto de entrada de la app
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* notificaciones globales */}
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 1800,
        style: {
          background: "#240616",
          color: "#FAF7F5",
          border: "1px solid #871C53",
          fontFamily: "Outfit, sans-serif",
        },
      }}
    />
    <App />
  </React.StrictMode>
)
