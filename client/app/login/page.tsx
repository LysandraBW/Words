'use client';
import clsx from "clsx";
import Logo from "@/components/Logo";
import InputText from "@/components/input/InputText";
import InputButton from "@/components/input/InputButton";
import { Fragment } from "react/jsx-runtime";


type Book = {
    title: string;
    author: string;
    color: string;
    darkerColor: string;
    height: number;
};


const books: Book[] = [
    { title: "The Republic", author: "Plato", color: "#9E2B25", darkerColor: "#84241F", height: 0.92 },       
    { title: "The Prince", author: "Machiavelli", color: "#FFBA08", darkerColor: "#E0A100", height: 0.65 },   
    { title: "Leviathan", author: "Hobbes", color: "#1E3888", darkerColor: "#1A3175", height: 0.98 },         
    { title: "Social Contract", author: "Rousseau", color: "#9E2B25", darkerColor: "#84241F", height: 0.75 },
    { title: "On Liberty", author: "Mill", color: "#FFBA08", darkerColor: "#E0A100", height: 0.60 },         
    { title: "The Federalist", author: "Hamilton", color: "#1E3888", darkerColor: "#1A3175", height: 0.88 }, 
    { title: "Democracy", author: "Tocqueville", color: "#9E2B25", darkerColor: "#84241F", height: 0.75 },   
    { title: "Das Kapital", author: "Marx", color: "#FFBA08", darkerColor: "#E0A100", height: 0.95 },         
    { title: "The Second Sex", author: "Beauvoir", color: "#1E3888", darkerColor: "#1A3175", height: 0.82 },  
    { title: "Orientalism", author: "Said", color: "#9E2B25", darkerColor: "#84241F", height: 0.68 },         
    { title: "The Road to Serfdom", author: "Hayek", color: "#FFBA08", darkerColor: "#E0A100", height: 0.5 },
    { title: "The Second Sex", author: "Beauvoir", color: "#1E3888", darkerColor: "#1A3175", height: 0.82 },  
    { title: "The Republic", author: "Plato", color: "#9E2B25", darkerColor: "#84241F", height: 0.92 },       
    { title: "The Prince", author: "Machiavelli", color: "#FFBA08", darkerColor: "#E0A100", height: 0.65 },   
    { title: "Leviathan", author: "Hobbes", color: "#1E3888", darkerColor: "#1A3175", height: 0.98 },         
    { title: "Social Contract", author: "Rousseau", color: "#9E2B25", darkerColor: "#84241F", height: 0.75 },
    { title: "On Liberty", author: "Mill", color: "#FFBA08", darkerColor: "#E0A100", height: 0.60 },         
    { title: "The Federalist", author: "Hamilton", color: "#1E3888", darkerColor: "#1A3175", height: 0.88 }, 
    { title: "Democracy", author: "Tocqueville", color: "#9E2B25", darkerColor: "#84241F", height: 0.75 },   
    { title: "Das Kapital", author: "Marx", color: "#FFBA08", darkerColor: "#E0A100", height: 0.95 },         
    { title: "The Second Sex", author: "Beauvoir", color: "#1E3888", darkerColor: "#1A3175", height: 0.82 },  
    { title: "Orientalism", author: "Said", color: "#9E2B25", darkerColor: "#84241F", height: 0.68 },         
    { title: "The Road to Serfdom", author: "Hayek", color: "#FFBA08", darkerColor: "#E0A100", height: 0.5 },
    { title: "The Second Sex", author: "Beauvoir", color: "#1E3888", darkerColor: "#1A3175", height: 0.82 },
];



function Book({i}: {i: number}) {
    const color = clsx(
        i % 5 === 0 && "fill-blue-300",
        i % 5 === 1 && "fill-blue-400",
        i % 5 === 2 && "fill-blue-500",
        i % 5 === 3 && "fill-blue-600",
        i % 5 === 4 && "fill-blue-200"
    );

    return (
        <svg 
            viewBox="0 0 50 100" 
            xmlns="http://www.w3.org/2000/svg"
            className={clsx(
                "row-start-1",
                "hover:-translate-y-1/6 [&:hover&:active]:-translate-y-1/4",
                "transition-all duration-500- ease-in-out"
            )}
            style={{
                zIndex: i,
                position: 'relative'
            }}
        >
            <polygon 
                points="0,25 25,25 25,100, 0,100" 
                className={color + ' '}
            />
            <polygon 
                points="25,25 50,0 50,75 25,100" 
                className={color + ' brightness-90'}
            />
            <polygon 
                points="0,25 25,0 50,0 25,25" 
                className={i % 2 === 0 ? 'fill-neutral-100' : 'fill-neutral-100'}
            />
            {/* <path
                d="M0 25 L25 0 L50 0 L25 25 L0 25"
                stroke-width="0.25"
                fill="none"
                className='stroke-black/10'
            />
            <path
                d="M0 25 L0 100 L25 100 L25 25"
                stroke="black"
                stroke-width="0.25"
                fill="none"
                className='stroke-black/10'
            /> */}
        </svg>
    )
}


export default function Page() {
    return (
        <div className="w-full h-full grid grid-cols-12 gap-x-6 gap-y-6">
            <div className="col-start-1 col-span-7 row-start-1 bg-black">
                <div className="w-full h-full flex flex-col justify-end overflow-clip bg-neutral-200 rounded-br-[200px]">
                    <div 
                        className={clsx(
                            "grid grid-cols-[repeat(20,64px)] grid-rows-1 -space-x-[65px]",
                            "relative left-[-64px]",
                            "bg-black"
                        )}
                    >
                        {books.map((book, i) => (
                            <Fragment
                                key={i}
                            >
                                <Book
                                    i={i}
                                />
                            </Fragment>
                        ))}
                    </div>
                </div>
            </div>
            <main
                className={clsx(
                    "m-6 ml-0",
                    "col-start-8 col-span-5 row-start-1",
                    "grid grid-rows-[auto_1fr] grid-cols-12",
                    "gap-x-6 gap-y-6"
                )}
            >
                <Logo/>
                <div className="row-start-2 col-start-4 col-span-6 min-w-3xs flex flex-col gap-y-12 justify-center mb-18">
                    <header className="flex flex-col gap-y-1">
                        <h1 className="text-3xl text-white text-center font-medium">
                            Welcome Be Ye
                        </h1>
                        <p className="text-sm text-center">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </p>
                    </header>
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="flex flex-col gap-y-6"
                    >
                        <InputText
                            label="Email"
                        />
                        <InputText
                            label="Password"
                        />
                        <InputButton
                            label="Sign In"
                        />
                    </form>
                </div>
            </main>
        </div>
    )
}