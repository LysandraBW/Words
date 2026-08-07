'use client';
import { abcDiatype } from '@/app/fonts';
import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';
import React from 'react';
import { toast as sonnerToast } from 'sonner';


interface ToastProps {
    id: string | number;
    title: string;
    description?: string;
    Icon?: LucideIcon;
    type?: 'success' | 'error';
    button?: {
        label: string;
        onClick: () => void;
    };
}


export default function Toast(props: ToastProps) {
    const { title, description, button, id } = props;
 
    return (
        <div 
            className={clsx(
                "flex rounded-lg bg-neutral-900 border border-neutral-800 shadow-lg w-full md:max-w-[364px] items-center overflow-clip",
                abcDiatype.className
            )}
        >
            <div
                className={clsx(
                    "p-4"
                )}
            >
                <div className="flex flex-1 items-center">
                    <div className="w-full">
                        <div className='flex gap-x-2 items-center'>
                            {props.type &&
                                <div
                                    className={clsx(
                                        "w-2 h-2 rounded-full bg-blue-500",
                                        props.type === "error" && "!bg-yellow-300",
                                        props.type === "success" && "!bg-green-400"
                                    )}
                                />
                            }
                            <p 
                                className={clsx(
                                    "text-base font-medium text-neutral-200",
                                    // props.type === "error" && "!text-yellow-300"
                                )}
                            >
                                {title}
                            </p>
                        </div>
                        {description &&
                            <p className="mt-0 text-base text-neutral-400">
                                {description}
                            </p>
                        }
                    </div>
                </div>
                {button &&
                    <div className="ml-5 shrink-0 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden">
                        <button
                            className="rounded bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
                            onClick={() => {
                                button.onClick();
                                sonnerToast.dismiss(id);
                            }}
                            >
                            {button.label}
                        </button>
                    </div>
                }
            </div>
        </div>
    );
}


export function toast(toast: Omit<ToastProps, "id">) {
    return sonnerToast.custom((id) => (
        <Toast
            id={id}
            {...toast}
        />
    ))
}


