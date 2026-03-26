'use client'

import { logout } from "@/services/api-login";
import { useRouter } from "next/navigation";

export default function logout_session() {
    const router = useRouter();

    const logoutFunc = () => {
        logout().then(() => {
            router.push('/');
        });
    };

    logoutFunc();
}