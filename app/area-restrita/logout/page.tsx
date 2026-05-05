'use client'

import { logout } from "@/services/api-login";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function logout_session() {
    const router = useRouter();

    useEffect(() => {
        logout().then(() => {
            router.push('/');
        });
    }, []);
}
