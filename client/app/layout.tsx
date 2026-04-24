import "./globals.css";
import clsx from "clsx";
import type { Metadata } from "next";
import { abcDiatype } from "@/app/fonts";

export const metadata: Metadata = {
  title: "Words",
  description: "Learn words!",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
	return (
    	<html 
			lang="en"
			className={clsx(
				"w-screen min-w-screen max-w-screen h-screen",
				abcDiatype.className
			)}
		>
			<body className="w-full h-full overflow-hidden">
				{children}
			</body>
    	</html>
  	);
}
