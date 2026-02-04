"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"    

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {toasts.map(function ({ id, title, description, action, ...props }: any) {
        return (
          // @ts-expect-error - Radix UI Toast type compatibility
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <Toast key={id} {...(props as any)}>
            <div className="grid gap-1">
              {title && (
                // @ts-expect-error - Radix UI Toast type compatibility
                <ToastTitle>{title}</ToastTitle>
              )}
              {description && (
                // @ts-expect-error - Radix UI Toast type compatibility
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            {/* @ts-expect-error - Radix UI Toast type compatibility */}
            <ToastClose />
          </Toast>
        )
      })}
      {/* @ts-expect-error - Radix UI Toast type compatibility */}
      <ToastViewport />
    </ToastProvider>
  )
}
