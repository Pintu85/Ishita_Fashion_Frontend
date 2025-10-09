import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
    size?: number;
    className?: string;
    fullScreen?: boolean;
    color?: string; // text color
    text?: string; // optional loading text
    overlayOpacity?: number; // background opacity for fullscreen overlay
}

export function Loader({
    size = 24,
    className,
    fullScreen = false,
    color = "text-primary",
    text,
    overlayOpacity = 50, // default 50% opacity
}: LoaderProps) {
    const loaderElement = (
        <div className="flex flex-col items-center justify-center gap-2">
            <Loader2 className={cn("animate-spin", color, className)} size={size} />
            {text && <span className="text-sm text-muted-foreground">{text}</span>}
        </div>
    );

    if (fullScreen) {
        return (
            <div
                className={cn(
                    "fixed inset-0 flex items-center justify-center bg-black",
                    `bg-opacity-${overlayOpacity}`
                )}
            >
                {loaderElement}
            </div>
        );
    }

    return loaderElement;
}
