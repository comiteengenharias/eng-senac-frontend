import { ReactNode } from 'react';

interface SubtitleProps {
    children: ReactNode;
    className?: string;
}

export default function Subtitle({ children, className = '' }: SubtitleProps) {

    return (
        <p className={`text-[var(--black)] text-sm opacity-70 ${className}`}>
            {children}
        </p>
    );
}