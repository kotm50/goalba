/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderColor: {
        light: "#EAEAEA",
        normal: "#CCCCCC",
      },
      height: {
        "nav-mobile": "75px",
      },
      minHeight: {
        "nav-mobile": "75px",
      },
      fontSize: {
        xxs: "0.625rem",
      },
      backgroundColor: {
        main: "#F0F2F5",
        banner: "#F59E0B",
      },
      gap: {
        2.5: "0.625rem",
      },
      screens: {
        pc: "1240px", // break point for pc
      },
      dropShadow: {
        post: "0 4px 10px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
