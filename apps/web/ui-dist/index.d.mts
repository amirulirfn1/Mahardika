import React from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';

/**
 * Mahardika Brand Colors
 * Official brand palette for consistent styling across all components
 */
declare const colors: {
    readonly navy: "#0D1B2A";
    readonly gold: "#F4B400";
    readonly primary: "#0D1B2A";
    readonly secondary: "#F4B400";
    readonly white: "#FFFFFF";
    readonly black: "#000000";
    readonly gray: {
        readonly 50: "#F9FAFB";
        readonly 100: "#F3F4F6";
        readonly 200: "#E5E7EB";
        readonly 300: "#D1D5DB";
        readonly 400: "#9CA3AF";
        readonly 500: "#6B7280";
        readonly 600: "#4B5563";
        readonly 700: "#374151";
        readonly 800: "#1F2937";
        readonly 900: "#111827";
    };
    readonly success: "#10B981";
    readonly warning: "#F59E0B";
    readonly error: "#EF4444";
    readonly info: "#3B82F6";
    readonly background: {
        readonly primary: "#0D1B2A";
        readonly secondary: "#F4B400";
        readonly neutral: "#F9FAFB";
        readonly dark: "#111827";
    };
    readonly text: {
        readonly primary: "#0D1B2A";
        readonly secondary: "#6B7280";
        readonly light: "#FFFFFF";
        readonly muted: "#9CA3AF";
    };
    readonly border: {
        readonly light: "#E5E7EB";
        readonly medium: "#D1D5DB";
        readonly dark: "#374151";
        readonly brand: "#0D1B2A";
    };
};
type Colors = typeof colors;
type ColorKey = keyof Colors;

/**
 * Mahardika Brand Theme System
 * Comprehensive design system for consistent styling across all components
 */
declare const bootstrapColorOverrides: {
    readonly primary: "#0D1B2A";
    readonly secondary: "#6B7280";
    readonly success: "#10B981";
    readonly info: "#3B82F6";
    readonly warning: "#F4B400";
    readonly danger: "#EF4444";
    readonly light: "#F9FAFB";
    readonly dark: "#111827";
};
declare const scssVariables = "\n// Mahardika Brand Colors for Bootstrap\n$primary: #0D1B2A;\n$secondary: #6B7280;\n$success: #10B981;\n$info: #3B82F6;\n$warning: #F4B400;\n$danger: #EF4444;\n$light: #F9FAFB;\n$dark: #111827;\n\n// Mahardika specific variables\n$mahardika-navy: #0D1B2A;\n$mahardika-gold: #F4B400;\n$mahardika-border-radius: 0.5rem;\n\n// Bootstrap overrides\n$border-radius: $mahardika-border-radius;\n$border-radius-sm: 0.25rem;\n$border-radius-lg: 0.75rem;\n$border-radius-xl: 1rem;\n$border-radius-pill: 50rem;\n\n// Component specific overrides\n$btn-border-radius: $mahardika-border-radius;\n$card-border-radius: $mahardika-border-radius;\n$input-border-radius: $mahardika-border-radius;\n$modal-border-radius: $mahardika-border-radius;\n$popover-border-radius: $mahardika-border-radius;\n$tooltip-border-radius: $mahardika-border-radius;\n\n// Typography\n$font-family-sans-serif: system-ui, -apple-system, \"Segoe UI\", Roboto, sans-serif;\n$font-family-monospace: \"SF Mono\", \"Monaco\", \"Inconsolata\", \"Roboto Mono\", monospace;\n";
declare const theme: {
    readonly colors: {
        readonly navy: "#0D1B2A";
        readonly gold: "#F4B400";
        readonly primary: "#0D1B2A";
        readonly secondary: "#F4B400";
        readonly white: "#FFFFFF";
        readonly black: "#000000";
        readonly transparent: "transparent";
        readonly gray: {
            readonly 50: "#F9FAFB";
            readonly 100: "#F3F4F6";
            readonly 200: "#E5E7EB";
            readonly 300: "#D1D5DB";
            readonly 400: "#9CA3AF";
            readonly 500: "#6B7280";
            readonly 600: "#4B5563";
            readonly 700: "#374151";
            readonly 800: "#1F2937";
            readonly 900: "#111827";
        };
        readonly success: "#10B981";
        readonly warning: "#F59E0B";
        readonly error: "#EF4444";
        readonly info: "#3B82F6";
        readonly background: {
            readonly primary: "#0D1B2A";
            readonly secondary: "#F4B400";
            readonly neutral: "#F9FAFB";
            readonly dark: "#111827";
            readonly light: "#FFFFFF";
            readonly glass: {
                readonly navy: "rgba(13, 27, 42, 0.85)";
                readonly gold: "rgba(244, 180, 0, 0.85)";
            };
        };
        readonly text: {
            readonly primary: "#0D1B2A";
            readonly secondary: "#6B7280";
            readonly light: "#FFFFFF";
            readonly muted: "#9CA3AF";
            readonly inverse: "#FFFFFF";
        };
        readonly border: {
            readonly light: "#E5E7EB";
            readonly medium: "#D1D5DB";
            readonly dark: "#374151";
            readonly navy: "#0D1B2A";
            readonly gold: "#F4B400";
        };
        readonly hover: {
            readonly navy: "#1a2332";
            readonly gold: "#FFD23F";
            readonly navyLight: "rgba(13, 27, 42, 0.05)";
            readonly goldLight: "rgba(244, 180, 0, 0.05)";
        };
        readonly active: {
            readonly navy: "#0a1520";
            readonly gold: "#E6A200";
        };
        readonly gradients: {
            readonly primary: "linear-gradient(135deg, #0D1B2A 0%, #1a2332 100%)";
            readonly secondary: "linear-gradient(135deg, #F4B400 0%, #FFD23F 100%)";
            readonly brand: "linear-gradient(135deg, #0D1B2A 0%, #F4B400 100%)";
            readonly brandReverse: "linear-gradient(135deg, #F4B400 0%, #0D1B2A 100%)";
            readonly animated: "linear-gradient(135deg, #0D1B2A 0%, #F4B400 50%, #0D1B2A 100%)";
        };
    };
    readonly typography: {
        readonly fontFamily: {
            readonly primary: "system-ui, -apple-system, \"Segoe UI\", Roboto, sans-serif";
            readonly heading: "system-ui, -apple-system, \"Segoe UI\", Roboto, sans-serif";
            readonly mono: "\"SF Mono\", \"Monaco\", \"Inconsolata\", \"Roboto Mono\", monospace";
        };
        readonly fontSize: {
            readonly xs: "0.75rem";
            readonly sm: "0.875rem";
            readonly base: "1rem";
            readonly lg: "1.125rem";
            readonly xl: "1.25rem";
            readonly '2xl': "1.5rem";
            readonly '3xl': "1.875rem";
            readonly '4xl': "2.25rem";
            readonly '5xl': "3rem";
        };
        readonly fontWeight: {
            readonly light: "300";
            readonly normal: "400";
            readonly medium: "500";
            readonly semibold: "600";
            readonly bold: "700";
            readonly extrabold: "800";
        };
        readonly lineHeight: {
            readonly none: "1";
            readonly tight: "1.25";
            readonly snug: "1.375";
            readonly normal: "1.5";
            readonly relaxed: "1.625";
            readonly loose: "2";
        };
        readonly letterSpacing: {
            readonly tighter: "-0.05em";
            readonly tight: "-0.025em";
            readonly normal: "0em";
            readonly wide: "0.025em";
            readonly wider: "0.05em";
            readonly widest: "0.1em";
        };
    };
    readonly spacing: {
        readonly 0: "0";
        readonly px: "1px";
        readonly 0.5: "0.125rem";
        readonly 1: "0.25rem";
        readonly 1.5: "0.375rem";
        readonly 2: "0.5rem";
        readonly 2.5: "0.625rem";
        readonly 3: "0.75rem";
        readonly 3.5: "0.875rem";
        readonly 4: "1rem";
        readonly 5: "1.25rem";
        readonly 6: "1.5rem";
        readonly 7: "1.75rem";
        readonly 8: "2rem";
        readonly 9: "2.25rem";
        readonly 10: "2.5rem";
        readonly 11: "2.75rem";
        readonly 12: "3rem";
        readonly 14: "3.5rem";
        readonly 16: "4rem";
        readonly 20: "5rem";
        readonly 24: "6rem";
        readonly 28: "7rem";
        readonly 32: "8rem";
        readonly 36: "9rem";
        readonly 40: "10rem";
        readonly 44: "11rem";
        readonly 48: "12rem";
        readonly 52: "13rem";
        readonly 56: "14rem";
        readonly 60: "15rem";
        readonly 64: "16rem";
        readonly 72: "18rem";
        readonly 80: "20rem";
        readonly 96: "24rem";
    };
    readonly borderRadius: {
        readonly none: "0";
        readonly sm: "0.125rem";
        readonly default: "0.25rem";
        readonly md: "0.375rem";
        readonly lg: "0.5rem";
        readonly xl: "0.75rem";
        readonly '2xl': "1rem";
        readonly '3xl': "1.5rem";
        readonly full: "9999px";
    };
    readonly shadows: {
        readonly none: "none";
        readonly sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
        readonly default: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)";
        readonly md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
        readonly lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
        readonly xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
        readonly '2xl': "0 25px 50px -12px rgba(0, 0, 0, 0.25)";
        readonly inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)";
        readonly brand: {
            readonly navy: {
                readonly sm: "0 4px 14px 0 rgba(13, 27, 42, 0.39)";
                readonly md: "0 8px 25px 0 rgba(13, 27, 42, 0.5)";
                readonly lg: "0 16px 40px 0 rgba(13, 27, 42, 0.45)";
                readonly xl: "0 20px 50px 0 rgba(13, 27, 42, 0.4)";
            };
            readonly gold: {
                readonly sm: "0 4px 14px 0 rgba(244, 180, 0, 0.39)";
                readonly md: "0 8px 25px 0 rgba(244, 180, 0, 0.5)";
                readonly lg: "0 16px 40px 0 rgba(244, 180, 0, 0.45)";
                readonly xl: "0 20px 50px 0 rgba(244, 180, 0, 0.4)";
            };
        };
    };
    readonly transitions: {
        readonly none: "none";
        readonly all: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)";
        readonly default: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)";
        readonly colors: "color 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 150ms cubic-bezier(0.4, 0, 0.2, 1)";
        readonly opacity: "opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)";
        readonly shadow: "box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)";
        readonly transform: "transform 150ms cubic-bezier(0.4, 0, 0.2, 1)";
        readonly brand: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
        readonly smooth: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    };
    readonly breakpoints: {
        readonly xs: "0px";
        readonly sm: "576px";
        readonly md: "768px";
        readonly lg: "992px";
        readonly xl: "1200px";
        readonly xxl: "1400px";
    };
    readonly zIndex: {
        readonly hide: "-1";
        readonly auto: "auto";
        readonly base: "0";
        readonly docked: "10";
        readonly dropdown: "1000";
        readonly sticky: "1020";
        readonly banner: "1030";
        readonly overlay: "1040";
        readonly modal: "1050";
        readonly popover: "1060";
        readonly skipLink: "1070";
        readonly toast: "1080";
        readonly tooltip: "1090";
    };
    readonly components: {
        readonly button: {
            readonly sizes: {
                readonly sm: {
                    readonly padding: "0.75rem 1.25rem";
                    readonly fontSize: "0.875rem";
                    readonly lineHeight: "1.25rem";
                    readonly gap: "0.5rem";
                };
                readonly md: {
                    readonly padding: "1rem 2rem";
                    readonly fontSize: "1rem";
                    readonly lineHeight: "1.5rem";
                    readonly gap: "0.75rem";
                };
                readonly lg: {
                    readonly padding: "1.25rem 2.5rem";
                    readonly fontSize: "1.125rem";
                    readonly lineHeight: "1.75rem";
                    readonly gap: "1rem";
                };
            };
            readonly variants: {
                readonly navy: {
                    readonly backgroundColor: "#0D1B2A";
                    readonly borderColor: "#0D1B2A";
                    readonly color: "#FFFFFF";
                };
                readonly gold: {
                    readonly backgroundColor: "#F4B400";
                    readonly borderColor: "#F4B400";
                    readonly color: "#0D1B2A";
                };
                readonly 'outline-navy': {
                    readonly backgroundColor: "transparent";
                    readonly borderColor: "#0D1B2A";
                    readonly color: "#0D1B2A";
                };
                readonly 'outline-gold': {
                    readonly backgroundColor: "transparent";
                    readonly borderColor: "#F4B400";
                    readonly color: "#F4B400";
                };
            };
        };
        readonly card: {
            readonly sizes: {
                readonly sm: {
                    readonly padding: "1.25rem";
                    readonly minHeight: "120px";
                };
                readonly md: {
                    readonly padding: "1.75rem";
                    readonly minHeight: "160px";
                };
                readonly lg: {
                    readonly padding: "2.5rem";
                    readonly minHeight: "200px";
                };
                readonly xl: {
                    readonly padding: "3.5rem";
                    readonly minHeight: "280px";
                };
            };
            readonly variants: {
                readonly 'navy-primary': {
                    readonly background: "linear-gradient(135deg, #0D1B2A 0%, #1a2332 100%)";
                    readonly border: "1px solid #0D1B2A";
                    readonly color: "#FFFFFF";
                };
                readonly 'gold-primary': {
                    readonly background: "linear-gradient(135deg, #F4B400 0%, #FFD23F 100%)";
                    readonly border: "1px solid #F4B400";
                    readonly color: "#0D1B2A";
                };
                readonly 'navy-outline': {
                    readonly backgroundColor: "transparent";
                    readonly border: "2px solid #0D1B2A";
                    readonly color: "#0D1B2A";
                };
                readonly 'gold-outline': {
                    readonly backgroundColor: "transparent";
                    readonly border: "2px solid #F4B400";
                    readonly color: "#F4B400";
                };
            };
        };
    };
    readonly animations: {
        readonly gradientShift: {
            readonly '0%': {
                readonly backgroundPosition: "0% 50%";
            };
            readonly '50%': {
                readonly backgroundPosition: "100% 50%";
            };
            readonly '100%': {
                readonly backgroundPosition: "0% 50%";
            };
        };
        readonly fadeIn: {
            readonly '0%': {
                readonly opacity: "0";
            };
            readonly '100%': {
                readonly opacity: "1";
            };
        };
        readonly slideUp: {
            readonly '0%': {
                readonly transform: "translateY(10px)";
                readonly opacity: "0";
            };
            readonly '100%': {
                readonly transform: "translateY(0)";
                readonly opacity: "1";
            };
        };
        readonly slideDown: {
            readonly '0%': {
                readonly transform: "translateY(-10px)";
                readonly opacity: "0";
            };
            readonly '100%': {
                readonly transform: "translateY(0)";
                readonly opacity: "1";
            };
        };
        readonly scaleIn: {
            readonly '0%': {
                readonly transform: "scale(0.9)";
                readonly opacity: "0";
            };
            readonly '100%': {
                readonly transform: "scale(1)";
                readonly opacity: "1";
            };
        };
        readonly pulse: {
            readonly '0%, 100%': {
                readonly opacity: "1";
            };
            readonly '50%': {
                readonly opacity: "0.5";
            };
        };
        readonly spin: {
            readonly '0%': {
                readonly transform: "rotate(0deg)";
            };
            readonly '100%': {
                readonly transform: "rotate(360deg)";
            };
        };
        readonly bounce: {
            readonly '0%, 100%': {
                readonly transform: "translateY(-25%)";
                readonly animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)";
            };
            readonly '50%': {
                readonly transform: "translateY(0)";
                readonly animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)";
            };
        };
    };
};
type Theme = typeof theme;
type ThemeColors = typeof theme.colors;
type ThemeSpacing = typeof theme.spacing;
type ThemeBreakpoints = typeof theme.breakpoints;
type ComponentVariant = keyof typeof theme.components.button.variants | keyof typeof theme.components.card.variants;
type ComponentSize = keyof typeof theme.components.button.sizes | keyof typeof theme.components.card.sizes;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    disabled?: boolean;
}
declare const Button: React.FC<ButtonProps>;

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'branded' | 'outlined';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
}
declare const Card: React.FC<CardProps>;

interface AIChatProps {
    apiKey?: string;
    onMessage?: (message: string, response: string) => void;
}
declare const AIChat: React.FC<AIChatProps>;

interface SecurityStatusProps {
    isSecure: boolean;
    environment: string;
    className?: string;
    onSecurityClick?: () => void;
}
/**
 * SecurityStatus Component
 * Displays the security status of environment variables and secrets
 * Uses Mahardika brand colors: navy #0D1B2A and gold #F4B400
 */
declare const SecurityStatus: React.FC<SecurityStatusProps>;

interface BrandButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'navy' | 'gold' | 'outline-navy' | 'outline-gold' | 'gradient';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    disabled?: boolean;
    icon?: React.ReactNode;
    prompt?: string;
}
declare const BrandButton: React.FC<BrandButtonProps>;
declare const BrandButtonTemplates: {
    NavyPrimary: (props: Omit<BrandButtonProps, "variant">) => react_jsx_runtime.JSX.Element;
    GoldSecondary: (props: Omit<BrandButtonProps, "variant">) => react_jsx_runtime.JSX.Element;
    NavyOutline: (props: Omit<BrandButtonProps, "variant">) => react_jsx_runtime.JSX.Element;
    GoldOutline: (props: Omit<BrandButtonProps, "variant">) => react_jsx_runtime.JSX.Element;
    GradientFeature: (props: Omit<BrandButtonProps, "variant">) => react_jsx_runtime.JSX.Element;
};

interface BrandCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'navy-primary' | 'gold-primary' | 'navy-outline' | 'gold-outline' | 'gradient' | 'navy-glass' | 'gold-glass';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode;
    prompt?: string;
    elevation?: 'low' | 'medium' | 'high';
    pattern?: 'none' | 'dots' | 'grid' | 'diagonal';
}
declare const BrandCard: React.FC<BrandCardProps>;
declare const BrandCardTemplates: {
    NavyHero: (props: Omit<BrandCardProps, "variant">) => react_jsx_runtime.JSX.Element;
    GoldFeature: (props: Omit<BrandCardProps, "variant">) => react_jsx_runtime.JSX.Element;
    NavyOutlineInfo: (props: Omit<BrandCardProps, "variant">) => react_jsx_runtime.JSX.Element;
    GoldOutlineAccent: (props: Omit<BrandCardProps, "variant">) => react_jsx_runtime.JSX.Element;
    GradientShowcase: (props: Omit<BrandCardProps, "variant">) => react_jsx_runtime.JSX.Element;
    NavyGlassModal: (props: Omit<BrandCardProps, "variant">) => react_jsx_runtime.JSX.Element;
    GoldGlassHighlight: (props: Omit<BrandCardProps, "variant">) => react_jsx_runtime.JSX.Element;
};

declare const MahardikaDemo: React.FC;

export { AIChat, type AIChatProps, BrandButton, type BrandButtonProps, BrandButtonTemplates, BrandCard, type BrandCardProps, BrandCardTemplates, Button, type ButtonProps, Card, type CardProps, type ColorKey, type Colors, type ComponentSize, type ComponentVariant, MahardikaDemo, SecurityStatus, type SecurityStatusProps, type Theme, type ThemeBreakpoints, type ThemeColors, type ThemeSpacing, bootstrapColorOverrides, colors, scssVariables, theme };
