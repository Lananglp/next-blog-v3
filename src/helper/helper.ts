import moment from "moment";
// import 'moment/locale/id';

export const formatDateTime = (date: string) => {
    return moment(date).locale('en').format('dddd, DD MMMM YYYY HH:mm');
}

export const formatDate = (date: string) => {
    return moment(date).locale('en').format('dddd, DD MMMM YYYY');
}

export const generateUniqueUrl = (url: string) => {
    if (typeof window !== 'undefined') {
        return `${url}?t=${new Date().getTime()}`;
    }
    return url;
};

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

export const formatTimeAgo = (created_at: string | Date): string => {
    return moment(created_at).locale('en').fromNow();
};

export const decodeCategory = (category: string, slug?: string) => {
    const origin = process.env.NEXT_PUBLIC_API_URL;
    return `${origin}/${category.split(' ').join('-').toLowerCase()}${slug ? `/${slug}` : ''}`
}