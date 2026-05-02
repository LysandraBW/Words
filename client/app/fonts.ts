import { Nanum_Pen_Script, Gamja_Flower, Playfair_Display, Pixelify_Sans } from 'next/font/google';
import localFont from 'next/font/local'

export const abcDiatype = localFont({
	src: [
		{ path: '../public/fonts/ABCDiatype/ABCDiatype-Thin-Trial.otf', weight: '100', style: 'normal' },
		{ path: '../public/fonts/ABCDiatype/ABCDiatype-ThinItalic-Trial.otf', weight: '100', style: 'italic' },

		{ path: '../public/fonts/ABCDiatype/ABCDiatype-Ultra-Trial.otf', weight: '200', style: 'normal' },
		{ path: '../public/fonts/ABCDiatype/ABCDiatype-Ultraitalic-Trial.otf', weight: '200', style: 'italic' },

		{ path: '../public/fonts/ABCDiatype/ABCDiatype-Light-Trial.otf', weight: '300', style: 'normal' },
		{ path: '../public/fonts/ABCDiatype/ABCDiatype-LightItalic-Trial.otf', weight: '300', style: 'italic' },

		{ path: '../public/fonts/ABCDiatype/ABCDiatype-Regular-Trial.otf', weight: '400', style: 'normal' },
		{ path: '../public/fonts/ABCDiatype/ABCDiatype-RegularItalic-Trial.otf', weight: '400', style: 'italic' },

		{ path: '../public/fonts/ABCDiatype/ABCDiatype-Medium-Trial.otf', weight: '500', style: 'normal' },
		{ path: '../public/fonts/ABCDiatype/ABCDiatype-MediumItalic-Trial.otf', weight: '500', style: 'italic' },

		{ path: '../public/fonts/ABCDiatype/ABCDiatype-Heavy-Trial.otf', weight: '800', style: 'normal' },
		{ path: '../public/fonts/ABCDiatype/ABCDiatype-HeavyItalic-Trial.otf', weight: '800', style: 'italic' },

		{ path: '../public/fonts/ABCDiatype/ABCDiatype-Bold-Trial.otf', weight: '700', style: 'normal' },
		{ path: '../public/fonts/ABCDiatype/ABCDiatype-BoldItalic-Trial.otf', weight: '700', style: 'italic' },

		{ path: '../public/fonts/ABCDiatype/ABCDiatype-Black-Trial.otf', weight: '900', style: 'normal' },
		{ path: '../public/fonts/ABCDiatype/ABCDiatype-BlackItalic-Trial.otf', weight: '900', style: 'italic' },
	],
});

export const playfairDisplay = Playfair_Display({ 
	subsets: ['latin'],
	weight: ['400', '500', '600', '700', '800', '900']
});

export const nanumPenScript = Nanum_Pen_Script({ 
	subsets: ['latin'],
	weight: ['400']
});

export const gamjaFlower = Gamja_Flower({ 
	subsets: ['latin'],
	weight: ['400']
});

export const pixelifySans = Pixelify_Sans({ 
	subsets: ['latin'],
	weight: ['400']
});