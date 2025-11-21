"use client"
import { useAuthStore } from "@/store/userAuthStore";
import { useWebSocketStore } from "@/store/useWebSocketStore";
import { useEffect } from "react";

export default function Connect() {

    const connect = useWebSocketStore((state) => state.connect);
    const loading = useWebSocketStore((state) => state.loading);
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        if (!loading && user) {
            connect();
        }
    }, [user, connect, loading]);

    return null;
}