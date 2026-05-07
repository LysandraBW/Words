import { usePathname as usePathName, useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ReaderType, selectReader } from "@/services/server/reader";


const UserContext = createContext<Partial<{user: ReaderType|null}>>({});


export function useRootContext() {
	const context = useContext(UserContext);
	if (!context)
		throw new Error("Missing Context");
  	return context;
}


export default function UserContextProvider(props: {children: ReactNode}) {
    const router = useRouter();
    const pathName = usePathName();
    const [user, setUser] = useState<ReaderType|null>();

    
    useEffect(() => {
        const load = async () => {
            try {
                const user = await selectReader();
                setUser(user);
            }
            catch (err) {
                if ((pathName.startsWith('/signIn')) || (pathName.startsWith('/signUp'))) {
                    setUser(null);
                    return;
                }
                return router.push('/signIn');
            }
        }
        load();
    }, []);


    return (
        <UserContext.Provider value={{user}}>
            {user === undefined ? null : props.children}
        </UserContext.Provider>
    )
}