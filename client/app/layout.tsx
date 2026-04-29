"use client";
import "./globals.css";
import clsx from "clsx";
import type { Metadata } from "next";
import { abcDiatype } from "@/app/fonts";
import { usePathname as usePathName, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { ReaderType, selectReader } from "@/services/server/reader";


// export const metadata: Metadata = {
//   title: "Words",
//   description: "Learn words!",
// };


const RootContext = createContext<Partial<{user: ReaderType}>>({});


export function useRootContext() {
	const context = useContext(RootContext);
	if (!context)
		throw new Error("Missing Context");
  	return context;
}


export default function RootLayout({children}: {children: React.ReactNode}) {
	const router = useRouter();
	const pathName = usePathName();
	const [user, setUser] = useState<ReaderType>();


	useEffect(() => {
		const load = async () => {
			try {
				const user = await selectReader();
				setUser(user);
			}
			catch (err) {
				if (pathName.startsWith('/signIn') || pathName.startsWith('/signUp'))
					return;
				return router.push('/signIn');
			}
		}
		load();
	}, []);


	return (
    	<html 
			lang="en"
			className={clsx(
				"w-screen min-w-screen max-w-screen h-screen",
				abcDiatype.className
			)}
		>
			<RootContext.Provider value={{user}}>
				<body className="w-full h-full overflow-hidden">
					{children}
				</body>
			</RootContext.Provider>
    	</html>
  	);
}
