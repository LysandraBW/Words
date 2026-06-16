import "./globals.css";
import clsx from "clsx";
import type { Metadata } from "next";
import { abcDiatype, nunito } from "@/app/fonts";


export const metadata: Metadata = {
  title: "Words",
  description: "Learn words!",
};


export default function RootLayout({children}: {children: React.ReactNode}) {
	return (
    	<html 
			lang="en"
			className={clsx(
				"w-screen min-w-screen max-w-screen h-screen bg-neutral-950",
				abcDiatype.className
			)}
		>
			<body className="w-full h-full">
				{children}
			</body>
    	</html>
  	);
}