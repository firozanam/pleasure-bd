"use client"

import { useToast } from "./toast-context"
import { Toast, ToastClose, ToastDescription, ToastTitle, ToastViewport } from "./toast"

export function Toaster() {
  const { toasts, removeToast } = useToast()

  return (
    <>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && (
              <ToastDescription>{description}</ToastDescription>
            )}
          </div>
          {action}
          <ToastClose onClick={() => removeToast(id)} />
        </Toast>
      ))}
      <ToastViewport />
    </>
  )
}