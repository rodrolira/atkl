import '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        gradient: {
            bronze: string;
            silver: string;
            gold: string;
        };
        Ink: {
            Darkest: string;
            Darker: string;
            Dark: string;
            Base: string;
            Light: string;
            Lighter: string;
        };
        Sky: {
            Dark: string;
            Base: string;
            Light: string;
            Lighter: string;
            Lightest: string;
            White: string;
        };
        Red: {
            Darkest: string;
            Base: string;
            Light: string;
            Lighter: string;
            Lightest: string;
        },
        Green: {
            Darkest: string;
            Base: string;
            Light: string;
            Lighter: string;
            Lightest: string;
        }
    }

    interface PaletteOptions {
        gradient?: {
            bronze: string;
            silver: string;
            gold: string;
        };
        Ink?: {
            Darkest: string;
            Darker: string;
            Dark: string;
            Base: string;
            Light: string;
            Lighter: string;
        };
        Sky?: {
            Dark: string;
            Base: string;
            Light: string;
            Lighter: string;
            Lightest: string;
            White: string;
        };
        Red?: {
            Darkest: string;
            Base: string;
            Light: string;
            Lighter: string;
            Lightest: string;
        },
        Green?: {
            Darkest: string;
            Base: string;
            Light: string;
            Lighter: string;
            Lightest: string;
        }
    }
}