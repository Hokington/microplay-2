const BASE_URL = import.meta.env.API_URL;

export async function register({ data }: { data: FormData }) {
    const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        body: data,
    });
    
    if (!res.ok) throw new Error("Error registering user");
    return res.json();
}

export async function login({ data }: { data: FormData }) {
    const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        body: data,
    });

    if (!res.ok) throw new Error("Error logging in user");
    return res.json();
}

export async function logout(token: string) {
    const res = await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        headers: {
            Authorization: `Token ${token}`,
        },
    });
    if (!res.ok) throw new Error("Error fetching platforms");
    return res.json();
}

export function isLoggedIn(cookieHeader: string | null): boolean {
    if (!cookieHeader) return false;
  
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((cookie) => {
        const [key, ...rest] = cookie.trim().split("=");
        return [key, decodeURIComponent(rest.join("="))];
      })
    );
  
    return !!cookies["token"];
}

export function isAdmin(cookieHeader: string | null): boolean {
    if (!cookieHeader) return false;
    
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((cookie) => {
        const [key, ...rest] = cookie.trim().split("=");
        return [key, decodeURIComponent(rest.join("="))];
      })
    );

    return JSON.parse(cookies.user).role === "administrativo";
}
