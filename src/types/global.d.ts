// src/types/global.d.ts
declare global {
  interface Window {
    sender: any;
    Sender: any;
    senderForms?: {
      render: (formId: string) => void;
      destroy?: (formId: string) => void;
      scan?: () => void;
    };
    senderFormsLoaded?: boolean;
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    clarity?: (...args: any[]) => void;
    toggleTheme?: () => void;
    __NEXT_THEME_INITIAL?: 'dark' | 'light';
    __theme?: 'dark' | 'light';
  }
}

export {};