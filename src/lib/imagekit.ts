import { getAuthFromImagekit } from "@/app/api/function/imagekit";
import ImageKit from "imagekit";

export const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL!,
});
 
const imageKitAuthenticator = async () => {
    try {
        const response = await getAuthFromImagekit();

        if (!response || response.status !== 200) {
            throw new Error(`Request failed with status ${response?.status}`);
        }

        const { signature, expire, token } = response.data;

        if (!signature || !expire || !token) {
            throw new Error("Invalid authentication response from server");
        }

        return { signature, expire, token };
    } catch (error: any) {
        console.error("Authentication request failed:", error.response?.data || error.message);
        throw new Error(`Authentication request failed: ${error.message}`);
    }
};

export { imageKitAuthenticator };
