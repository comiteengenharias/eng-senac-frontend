import { ReactNode } from 'react';

interface SubtitleProps {
    children: ReactNode;
}

export default function Subtitle({ children }: SubtitleProps) {
    return (
        <div className='mb-8 max-w-[100%] text-center'>
            <h2 className='text-[var(--text)] text-3xl lg:text-4xl w-full mb-4 font-medium'>{children}</h2>
            <div className='w-[40%] h-1 bg-[var(--text)] m-auto'></div>
        </div>
    );
}
