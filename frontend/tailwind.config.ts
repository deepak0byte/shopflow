import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1a1a2e",
          accent:  "#e94560",
        },
      },
    },
  },
  plugins: [],
};

export default config;
