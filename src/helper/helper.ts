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

export const formatInitials = (name: string) => {
    const initials = name.split(" ").slice(0, 2).map(word => word[0]).join("");
    return initials.toUpperCase();
}

export const decodeCategory = (category: string, slug?: string) => {
    const origin = process.env.NEXT_PUBLIC_API_URL;
    return `${origin}/${category.split(' ').join('-').toLowerCase()}${slug ? `/${slug}` : ''}`
}

export const getCooldownRemainingToString = (usernameChangedAt: string | Date, cooldown: number) => {
    const COOLDOWN_DAYS = cooldown || 14;
    const changedDate = new Date(usernameChangedAt);
    const now = new Date();
    const diffMs = now.getTime() - changedDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const remaining = COOLDOWN_DAYS - diffDays;

    if (remaining <= 0) return "0 days";
    return `${remaining} days`;
}

export const getCooldownRemainingNumber = (changedAt: string | Date | null): number => {
    if (!changedAt) return 0;
    const COOLDOWN_DAYS = 14;
    const now = new Date();
    const diffMs = now.getTime() - new Date(changedAt).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return COOLDOWN_DAYS - diffDays;
}