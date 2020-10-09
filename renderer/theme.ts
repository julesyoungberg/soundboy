import theme from '@rebass/preset';

const mTheme = {
    ...theme,
    colors: {
        ...theme.colors,
        blue: '#07c',
        lightgray: '#f6f6ff',
        primary: '#73e',
    },
};

export type Theme = ReturnType<typeof mTheme>;

export default mTheme;
