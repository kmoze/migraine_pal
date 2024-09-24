/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundImage: {
        'custom-gradient':
          'linear-gradient(to right, hsl(74deg 3.14% 76.22%), hsl(37.5deg 9.82% 85.03%))',
      },
      fontFamily: {
        custom: ['Comfortaa'],
        customText: ['Sarabun'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
          dashboard: 'hsl(223.36 23.08% 9.53%)',
          coolorsPrimary: 'hsl(209, 53%, 16%)',
          coolorsSecondary: 'hsl(199, 100%, 29%)',
          coolorsAccent: 'hsl(198, 63%, 38%)',
          lightMode: 'hsl(205, 87%, 94%)',
          lightModeSecondary: 'hsl(198, 33%, 76%)',
          lightModeTertiary: 'hsl(187, 100%, 91%)',
          lightModeOther: 'hsl(201, 100%, 81%)',
          lightModeDashboard: 'hsl(201, 43%, 81%)',
          lightModeRadar: 'hsl(180,100%,93.7%)',
          darkModePrimary: 'hsl(231, 12%, 21%)',
          darkModeTextPrimary: 'hsl(111, 24%, 94%)',
          darkModeSecondary: 'hsl(244, 16%, 18%)',
          darkModeTertiary: 'hsl(207, 43%, 16%)',
          darkModeOther: 'hsl(220, 40%, 13%)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
