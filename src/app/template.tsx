import NoiseBackground from "@/components/noise-background";

export default function Template({ children }: { children: React.ReactNode }) {

    return (
        <div>
            {/* <NoiseBackground /> */}
            {children}
        </div>
    )
}