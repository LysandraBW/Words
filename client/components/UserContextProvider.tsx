import { usePathname as usePathName, useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ReaderType, selectReader } from "@/services/server/reader";


const UserContext = createContext<Partial<{user: ReaderType}>>({});


export function useRootContext() {
	const context = useContext(UserContext);
	if (!context)
		throw new Error("Missing Context");
  	return context;
}


export default function UserContextProvider(props: {children: ReactNode}) {
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
                if (
                    (pathName.startsWith('/signIn')) || 
                    (pathName.startsWith('/signUp'))
                )
                    return;
                return router.push('/signIn');
            }
        }
        load();
    }, []);


    return (
        <UserContext.Provider value={{user}}>
            {props.children}
        </UserContext.Provider>
    )
}