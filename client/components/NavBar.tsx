import { LibraryIcon } from "lucide-react";
import Button from "./Button";
import Logo from "./Logo";

export default function NavBar() {
    return (
        <nav className="w-[256px] h-full px-8 py-4 grid grid-rows-[min-content_1fr_min-content] bg-stone-900">
            <div className="relative pb-4 flex justify-center">
                <Logo
                    spanClassName="text-stone-500"
                />
                <div className="absolute left-0 bottom-[-4px] w-full h-[4px] flex justify-between">
                    {[...Array(20)].map((e, i) => (
                        <div 
                            key={i}
                            className="h-full aspect-square rounded-full bg-stone-500"
                        />
                    ))}
                </div>
            </div>
            <div className="mt-[4px] py-4">
                <Button
                    label="Books"
                    iconL={(
                        <LibraryIcon
                            size={16}
                            className="text-stone-400"
                        />
                    )}
                    labelClassName="text-sm !text-stone-300"
                    outerClassName="!h-[36px] !bg-stone-500"
                    innerClassName="!from-stone-400 !to-stone-500"
                    innerMostClassName="!justify-start !from-stone-500 !to-stone-500"
                />
            </div>
            <div className="flex flex-col gap-y-4 items-center">
                <div className="w-[64px] h-[64px] rounded-full bg-stone-500"/>
            </div>
        </nav>
    )
}