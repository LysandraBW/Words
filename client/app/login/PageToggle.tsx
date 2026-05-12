import clsx from "clsx";
import { LogInIcon, UserRoundPlusIcon } from "lucide-react";

interface PageToggleProps {
    page: string;
    onClickPage: (page: string) => void;
}


export default function PageToggle(props: PageToggleProps) {
    const signUp = props.page === "signUp";
    const signIn = props.page === "signIn";

    
    return (
        <div className="w-min p-1 flex gap-x-1 bg-neutral-900 border border-neutral-800 rounded-[9px]">
            <button 
                className={clsx(
                    "px-2 py-0.5 flex items-center gap-x-1",
                    signIn && "bg-neutral-800 rounded-md shadow",
                    !signIn && "hover:bg-neutral-950"
                )}
                onClick={() => props.onClickPage("signIn")}
            >
                <LogInIcon
                    size={12}
                    className={clsx(
                        signIn && "text-neutral-100",
                        !signIn && "text-neutral-500",
                    )}
                />
                <label 
                    className={clsx(
                        "text-xs whitespace-nowrap",
                        signIn && "text-neutral-100",
                        !signIn && "text-neutral-500"
                    )}
                >
                    Log In
                </label>
            </button>
            <button 
                className={clsx(
                    "px-2 py-0.5 flex items-center gap-x-1 rounded-md hover:bg-neutral-950",
                    signUp && "bg-neutral-800 rounded-md shadow",
                    !signUp && "hover:bg-neutral-950"
                )}
                onClick={() => props.onClickPage("signUp")}
            >
                <UserRoundPlusIcon
                    size={12}
                    className={clsx(
                        signUp && "text-neutral-100",
                        !signUp && "text-neutral-500",
                    )}
                />
                <label 
                    className={clsx(
                        "text-xs whitespace-nowrap",
                        signUp && "text-neutral-100",
                        !signUp && "text-neutral-500"
                    )}
                >
                    Sign Up
                </label>
            </button>
        </div>
    )
}