export const generateUniqueUrl = (url: string) => `${url}?t=${new Date().getTime()}`;

export const validateImageURL = async (url: string, toast: any ) => {
    try {
        const response = await fetch(url, { method: "HEAD" });
        const contentType = response.headers.get("content-type");

        if (response.status === 404) {
            toast({
                title: 'Image not found',
                description: 'The URL of the image you entered was not found.',
            });
        }

        return response.ok && contentType && contentType.startsWith("image/");
    } catch (error) {
        if (error) {
            toast({
                title: 'Invalid URL',
                description: 'Please enter a valid image URL.',
            });
        }
        return false;
    }
};