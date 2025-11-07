import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";
import aspectRatio from "@tailwindcss/aspect-ratio";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef6ff",
          100: "#d6e9ff",
          200: "#a7d0ff",
          300: "#75b5ff",
          400: "#4a9bff",
          500: "#1d82ff",
          600: "#0065e6",
          700: "#004db4",
          800: "#003682",
          900: "#001f51"
        },
        accent: {
          500: "#ffb300"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 10px 40px -15px rgba(29,130,255,0.45)"
      }
    }
  },
  plugins: [typography, forms, aspectRatio]
};

export default config;



