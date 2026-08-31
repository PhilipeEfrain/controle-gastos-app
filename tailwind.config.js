/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        finance: {
          surplus: "#10B981", // Verde Esmeralda (Entrada/Positivo)
          deficit: "#EF4444", // Vermelho Alerta (Saída/Negativo)
          darkBg: "#0F172A",  // Slate escuro fundo
          cardDark: "#1E293B", // Slate card fundo
          borderDark: "#334155",
        },
      },
    },
  },
  plugins: [],
};
