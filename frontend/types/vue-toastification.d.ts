declare module 'vue-toastification/dist/index.mjs' {
  import { Plugin } from 'vue'
  
  export interface ToastOptions {
    position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left'
    timeout?: number
    closeOnClick?: boolean
    pauseOnFocusLoss?: boolean
    pauseOnHover?: boolean
    draggable?: boolean
    draggablePercent?: number
    showCloseButtonOnHover?: boolean
    hideProgressBar?: boolean
    closeButton?: string | boolean
    icon?: boolean | string
    rtl?: boolean
  }

  export interface Toast {
    (content: string, options?: ToastOptions): void
    success(content: string, options?: ToastOptions): void
    error(content: string, options?: ToastOptions): void
    warning(content: string, options?: ToastOptions): void
    info(content: string, options?: ToastOptions): void
  }

  export function useToast(): Toast

  const plugin: Plugin
  export default plugin
} 