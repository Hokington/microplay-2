const BASE_URL = import.meta.env.API_URL;

export async function getReview(token: string, reviewId: string ) {
    const res = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
}

export async function getReviews(token: string) {
    const res = await fetch(`${BASE_URL}/reviews/`, {
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
}

export async function deleteReview(token: string, reviewId: string) {
    const res = await fetch(`${BASE_URL}/reviews/${reviewId}/`, {
        method: "DELETE",
        headers: {
            Authorization: `Token ${token}`,
        }
    });
    
    if (!res.ok) throw new Error(res.statusText);
}