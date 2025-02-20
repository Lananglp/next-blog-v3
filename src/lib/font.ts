import localFont from "next/font/local";

export const fontPoppins = localFont({
    src: [
        {
            path: "../../public/fonts/poppins/Poppins-ExtraLightItalic.ttf",
            weight: "100",
            style: "italic",
        },
        {
            path: "../../public/fonts/poppins/Poppins-Light.ttf",
            weight: "200",
            style: "normal",
        },
        {
            path: "../../public/fonts/poppins/Poppins-Regular.ttf",
            weight: "300",
            style: "normal",
        },
        {
            path: "../../public/fonts/poppins/Poppins-Regular.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../../public/fonts/poppins/Poppins-Medium.ttf",
            weight: "500",
            style: "normal",
        },
        {
            path: "../../public/fonts/poppins/Poppins-SemiBold.ttf",
            weight: "600",
            style: "normal",
        },
        {
            path: "../../public/fonts/poppins/Poppins-Bold.ttf",
            weight: "700",
            style: "normal",
        },
        {
            path: "../../public/fonts/poppins/Poppins-ExtraBold.ttf",
            weight: "800",
            style: "normal",
        },
        {
            path: "../../public/fonts/poppins/Poppins-Black.ttf",
            weight: "900",
            style: "normal",
        },
    ],
    variable: "--font-poppins",
});