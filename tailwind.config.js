/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                dmsans: ['"DM Sans"', 'sans-serif'],
                dmserif: ['"DM Serif Display"', 'serif'],
            }
        },
    },
    plugins: [],
}