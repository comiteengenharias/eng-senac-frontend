import { ReactNode } from 'react';

interface SubtitleProps {
    children: ReactNode;
    className?: string;
}

export default function Subtitle({ children, className = '' }: SubtitleProps) {
    return <h3 className={`text=[var(--black)] text-xl lg:text-2xl ${className}`}>{children}</h3>;
}
