export const stripHtml = (html: string): string => {
    if (typeof window !== "undefined") {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent || "";
    }
    return html.replace(/<\/?[^>]+(>|$)/g, ""); // Fallback di server-side
}