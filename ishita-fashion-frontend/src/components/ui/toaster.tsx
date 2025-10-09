import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { CheckCircle2, XCircle } from "lucide-react";

export function Toaster() {
    const { toasts } = useToast();

    return (
        <ToastProvider>
            {toasts.map(function ({ id, title, description, action, ...props }) {
                const isDestructive = props.variant === "destructive";
                const Icon = isDestructive ? XCircle : CheckCircle2;
                const iconColor = isDestructive ? "text-red-500" : "text-green-500";

                return (
                    <Toast key={id} {...props}>
                        <Icon className={`h-5 w-5 ${iconColor} flex-shrink-0`} />
                        <div className="grid gap-1 flex-1">
                            {title && <ToastTitle>{title}</ToastTitle>}
                            {description && <ToastDescription>{description}</ToastDescription>}
                        </div>
                        {action}
                        <ToastClose />
                    </Toast>
                );
            })}
            <ToastViewport />
        </ToastProvider>
    );
}
