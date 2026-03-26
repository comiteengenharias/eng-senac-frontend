import Link from 'next/link';
import { ReactNode } from 'react';

interface SubtitleProps {
    link: string;
    children: ReactNode;
}

export default function InternalButton({ link, children }: SubtitleProps) {
    return (
        <Link href={link} className='w-max'>
            <button className="mt-6 px-12 py-3 bg-[var(--orange)] text-[var(--white)] text-sm font-semibold rounded shadow hover:brightness-110 active:brightness-95 cursor-pointer transition-all duration-200">
                {children}
            </button>
        </Link>
    );
}
