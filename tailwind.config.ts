/*eslint no-undef: "error"*/
/*eslint-env node*/
/** @type {import('tailwindcss').Config} */

import plugin from 'tailwindcss/plugin';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        '-3xs': '440px',
        '-2xs': '480px',
        xs: '550px',
        '-2lg': '896px',
        '-2xl': '1152px',
      },
      maxWidth: {
        'static-full': '1232px',
        max: '1920px',
        compact: '860px',
        input: '280px',
      },
      height: {
        input: '60px',
      },
      colors: {
        primary: {
          DEFAULT: '#3861a3',
          dark: '#16438b',
          focus: '#4c81bd',
          'focus-light': '#5da0e2',
          border: '#1c447a',
          'border-light': '#dee8f1',
          shadow: '#1f67a0',
          'hue-purple': '#634193',
          'hue-purple-dark': '#482d72',
          'hue-purple-focus': '#815abf',
          'hue-teal': '#1a7d82',
          'hue-teal-dark': '#155959',
          'hue-teal-focus': '#22a8a4',
          'hue-orange': '#b55906',
          'hue-orange-dark': '#954904',
          'hue-orange-focus': '#d06707',
        },
        secondary: '#e04141',
        accent: '#38526d',
        backdrop: {
          DEFAULT: '#f5fbff',
          focus: '#bde9f4',
          light: '#e8f7fe',
          gray: '#e8ecef',
        },
      },
      fontFamily: {
        body: ['var(--font-body)'],
        display: ['var(--font-display)'],
      },
      fontSize: {
        '13px': '13px',
        '21px': '21px',
        '28px': '28px',
        '32px': '32px',
      },
      borderRadius: {
        '4px': '4px',
        '20px': '20px',
      },
      spacing: {
        '15px': '15px',
        '18px': '18px',
        '26px': '26px',
        '43px': '43px',
        '45px': '45px',
        111: '111%',
      },
      dropShadow: {
        primary: '0 5px 6px rgba(31,103,160,0.2)',
        'primary-sm': '0 4px 6px rgba(31,103,160,0.15)',
        'primary-lg': '0 8px 8px rgba(31,103,160,0.4)',
        'primary-focus': '0 5px 10px rgba(31,103,160,0.6)',
      },
      zIndex: {
        max: '99',
      },
      keyframes: {
        blink: {
          '50%': { opacity: 0 },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pageChange: {
          '0%': { opacity: '0', transform: 'translateY(100px)' },
          '50%': { opacity: '0', transform: 'translateY(100px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)' },
        },
      },
      animation: {
        blink: 'blink 1s step-start 0s infinite',
        fadeIn: 'fadeIn 0.5s ease-in-out 1',
        fastFadeIn: 'fadeIn 0.2s ease-in-out 1',
        pageChange: 'pageChange 1s ease-out 1',
      },
    },
  },
  plugins: [
    import('@tailwindcss/forms'),
    // animation-delay-
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          'animation-delay': (value) => {
            return {
              'animation-delay': value,
            };
          },
        },
        {
          values: theme('transitionDelay'),
        },
      );
    }),
  ],
};
