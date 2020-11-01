import theme from '@rebass/preset';

const mTheme = {
    ...theme,
    breakpoints: ['40em', '52em', '64em'],
    colors: {
        ...theme.colors,
        black: '#242322',
        grey: '#c9c9c9',
        medGrey: '#575c62',
        darkGrey: '#2d333a',
        white: '#f7f5f5',
        background: '#f5f5f5',
        secondary: '#2d53cc',
        blue: '#07c',
        lightgray: '#f6f6ff',
        primary: '#1d53ff',
        accent: '#f72f5a',
    },
};

export type Theme = ReturnType<typeof mTheme>;

export default mTheme;
