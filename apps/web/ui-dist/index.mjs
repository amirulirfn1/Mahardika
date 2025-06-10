// @mahardika/ui - Mahardika UI Component Library

// src/colors.ts
var colors = {
  // Primary Mahardika Brand Colors
  navy: "#0D1B2A",
  // Main brand navy
  gold: "#F4B400",
  // Main brand gold
  // Extended Palette
  primary: "#0D1B2A",
  // Alias for navy
  secondary: "#F4B400",
  // Alias for gold
  // Neutral Colors
  white: "#FFFFFF",
  black: "#000000",
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827"
  },
  // State Colors
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
  // Component Variants
  background: {
    primary: "#0D1B2A",
    secondary: "#F4B400",
    neutral: "#F9FAFB",
    dark: "#111827"
  },
  text: {
    primary: "#0D1B2A",
    secondary: "#6B7280",
    light: "#FFFFFF",
    muted: "#9CA3AF"
  },
  border: {
    light: "#E5E7EB",
    medium: "#D1D5DB",
    dark: "#374151",
    brand: "#0D1B2A"
  }
};

// src/theme.ts
var bootstrapColorOverrides = {
  primary: "#0D1B2A",
  // Mahardika Navy
  secondary: "#6B7280",
  // Neutral gray
  success: "#10B981",
  info: "#3B82F6",
  warning: "#F4B400",
  // Mahardika Gold
  danger: "#EF4444",
  light: "#F9FAFB",
  dark: "#111827"
};
var scssVariables = `
// Mahardika Brand Colors for Bootstrap
$primary: #0D1B2A;
$secondary: #6B7280;
$success: #10B981;
$info: #3B82F6;
$warning: #F4B400;
$danger: #EF4444;
$light: #F9FAFB;
$dark: #111827;

// Mahardika specific variables
$mahardika-navy: #0D1B2A;
$mahardika-gold: #F4B400;
$mahardika-border-radius: 0.5rem;

// Bootstrap overrides
$border-radius: $mahardika-border-radius;
$border-radius-sm: 0.25rem;
$border-radius-lg: 0.75rem;
$border-radius-xl: 1rem;
$border-radius-pill: 50rem;

// Component specific overrides
$btn-border-radius: $mahardika-border-radius;
$card-border-radius: $mahardika-border-radius;
$input-border-radius: $mahardika-border-radius;
$modal-border-radius: $mahardika-border-radius;
$popover-border-radius: $mahardika-border-radius;
$tooltip-border-radius: $mahardika-border-radius;

// Typography
$font-family-sans-serif: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
$font-family-monospace: "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace;
`;
var theme = {
  // Brand Colors - Official Mahardika palette
  colors: {
    // Primary brand colors
    navy: "#0D1B2A",
    gold: "#F4B400",
    // Extended brand palette
    primary: "#0D1B2A",
    // Navy alias
    secondary: "#F4B400",
    // Gold alias
    // Neutral colors
    white: "#FFFFFF",
    black: "#000000",
    transparent: "transparent",
    // Gray scale
    gray: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6B7280",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
      900: "#111827"
    },
    // State colors
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
    // Component-specific colors
    background: {
      primary: "#0D1B2A",
      secondary: "#F4B400",
      neutral: "#F9FAFB",
      dark: "#111827",
      light: "#FFFFFF",
      glass: {
        navy: "rgba(13, 27, 42, 0.85)",
        gold: "rgba(244, 180, 0, 0.85)"
      }
    },
    text: {
      primary: "#0D1B2A",
      secondary: "#6B7280",
      light: "#FFFFFF",
      muted: "#9CA3AF",
      inverse: "#FFFFFF"
    },
    border: {
      light: "#E5E7EB",
      medium: "#D1D5DB",
      dark: "#374151",
      navy: "#0D1B2A",
      gold: "#F4B400"
    },
    // Hover and active states
    hover: {
      navy: "#1a2332",
      gold: "#FFD23F",
      navyLight: "rgba(13, 27, 42, 0.05)",
      goldLight: "rgba(244, 180, 0, 0.05)"
    },
    active: {
      navy: "#0a1520",
      gold: "#E6A200"
    },
    // Gradient variations
    gradients: {
      primary: "linear-gradient(135deg, #0D1B2A 0%, #1a2332 100%)",
      secondary: "linear-gradient(135deg, #F4B400 0%, #FFD23F 100%)",
      brand: "linear-gradient(135deg, #0D1B2A 0%, #F4B400 100%)",
      brandReverse: "linear-gradient(135deg, #F4B400 0%, #0D1B2A 100%)",
      animated: "linear-gradient(135deg, #0D1B2A 0%, #F4B400 50%, #0D1B2A 100%)"
    }
  },
  // Typography
  typography: {
    fontFamily: {
      primary: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      heading: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      mono: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace'
    },
    fontSize: {
      xs: "0.75rem",
      // 12px
      sm: "0.875rem",
      // 14px
      base: "1rem",
      // 16px
      lg: "1.125rem",
      // 18px
      xl: "1.25rem",
      // 20px
      "2xl": "1.5rem",
      // 24px
      "3xl": "1.875rem",
      // 30px
      "4xl": "2.25rem",
      // 36px
      "5xl": "3rem"
      // 48px
    },
    fontWeight: {
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800"
    },
    lineHeight: {
      none: "1",
      tight: "1.25",
      snug: "1.375",
      normal: "1.5",
      relaxed: "1.625",
      loose: "2"
    },
    letterSpacing: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0em",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em"
    }
  },
  // Spacing scale
  spacing: {
    0: "0",
    px: "1px",
    0.5: "0.125rem",
    // 2px
    1: "0.25rem",
    // 4px
    1.5: "0.375rem",
    // 6px
    2: "0.5rem",
    // 8px
    2.5: "0.625rem",
    // 10px
    3: "0.75rem",
    // 12px
    3.5: "0.875rem",
    // 14px
    4: "1rem",
    // 16px
    5: "1.25rem",
    // 20px
    6: "1.5rem",
    // 24px
    7: "1.75rem",
    // 28px
    8: "2rem",
    // 32px
    9: "2.25rem",
    // 36px
    10: "2.5rem",
    // 40px
    11: "2.75rem",
    // 44px
    12: "3rem",
    // 48px
    14: "3.5rem",
    // 56px
    16: "4rem",
    // 64px
    20: "5rem",
    // 80px
    24: "6rem",
    // 96px
    28: "7rem",
    // 112px
    32: "8rem",
    // 128px
    36: "9rem",
    // 144px
    40: "10rem",
    // 160px
    44: "11rem",
    // 176px
    48: "12rem",
    // 192px
    52: "13rem",
    // 208px
    56: "14rem",
    // 224px
    60: "15rem",
    // 240px
    64: "16rem",
    // 256px
    72: "18rem",
    // 288px
    80: "20rem",
    // 320px
    96: "24rem"
    // 384px
  },
  // Border radius
  borderRadius: {
    none: "0",
    sm: "0.125rem",
    // 2px
    default: "0.25rem",
    // 4px
    md: "0.375rem",
    // 6px
    lg: "0.5rem",
    // 8px - Mahardika standard
    xl: "0.75rem",
    // 12px
    "2xl": "1rem",
    // 16px
    "3xl": "1.5rem",
    // 24px
    full: "9999px"
  },
  // Shadows
  shadows: {
    none: "none",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    default: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    // Brand-specific shadows
    brand: {
      navy: {
        sm: "0 4px 14px 0 rgba(13, 27, 42, 0.39)",
        md: "0 8px 25px 0 rgba(13, 27, 42, 0.5)",
        lg: "0 16px 40px 0 rgba(13, 27, 42, 0.45)",
        xl: "0 20px 50px 0 rgba(13, 27, 42, 0.4)"
      },
      gold: {
        sm: "0 4px 14px 0 rgba(244, 180, 0, 0.39)",
        md: "0 8px 25px 0 rgba(244, 180, 0, 0.5)",
        lg: "0 16px 40px 0 rgba(244, 180, 0, 0.45)",
        xl: "0 20px 50px 0 rgba(244, 180, 0, 0.4)"
      }
    }
  },
  // Transitions
  transitions: {
    none: "none",
    all: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    default: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
    colors: "color 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    opacity: "opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    shadow: "box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    transform: "transform 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    // Brand-specific transitions
    brand: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    smooth: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
  },
  // Breakpoints
  breakpoints: {
    xs: "0px",
    sm: "576px",
    md: "768px",
    lg: "992px",
    xl: "1200px",
    xxl: "1400px"
  },
  // Z-index scale
  zIndex: {
    hide: "-1",
    auto: "auto",
    base: "0",
    docked: "10",
    dropdown: "1000",
    sticky: "1020",
    banner: "1030",
    overlay: "1040",
    modal: "1050",
    popover: "1060",
    skipLink: "1070",
    toast: "1080",
    tooltip: "1090"
  },
  // Component variants
  components: {
    button: {
      sizes: {
        sm: {
          padding: "0.75rem 1.25rem",
          fontSize: "0.875rem",
          lineHeight: "1.25rem",
          gap: "0.5rem"
        },
        md: {
          padding: "1rem 2rem",
          fontSize: "1rem",
          lineHeight: "1.5rem",
          gap: "0.75rem"
        },
        lg: {
          padding: "1.25rem 2.5rem",
          fontSize: "1.125rem",
          lineHeight: "1.75rem",
          gap: "1rem"
        }
      },
      variants: {
        navy: {
          backgroundColor: "#0D1B2A",
          borderColor: "#0D1B2A",
          color: "#FFFFFF"
        },
        gold: {
          backgroundColor: "#F4B400",
          borderColor: "#F4B400",
          color: "#0D1B2A"
        },
        "outline-navy": {
          backgroundColor: "transparent",
          borderColor: "#0D1B2A",
          color: "#0D1B2A"
        },
        "outline-gold": {
          backgroundColor: "transparent",
          borderColor: "#F4B400",
          color: "#F4B400"
        }
      }
    },
    card: {
      sizes: {
        sm: {
          padding: "1.25rem",
          minHeight: "120px"
        },
        md: {
          padding: "1.75rem",
          minHeight: "160px"
        },
        lg: {
          padding: "2.5rem",
          minHeight: "200px"
        },
        xl: {
          padding: "3.5rem",
          minHeight: "280px"
        }
      },
      variants: {
        "navy-primary": {
          background: "linear-gradient(135deg, #0D1B2A 0%, #1a2332 100%)",
          border: "1px solid #0D1B2A",
          color: "#FFFFFF"
        },
        "gold-primary": {
          background: "linear-gradient(135deg, #F4B400 0%, #FFD23F 100%)",
          border: "1px solid #F4B400",
          color: "#0D1B2A"
        },
        "navy-outline": {
          backgroundColor: "transparent",
          border: "2px solid #0D1B2A",
          color: "#0D1B2A"
        },
        "gold-outline": {
          backgroundColor: "transparent",
          border: "2px solid #F4B400",
          color: "#F4B400"
        }
      }
    }
  },
  // Animation keyframes
  animations: {
    gradientShift: {
      "0%": { backgroundPosition: "0% 50%" },
      "50%": { backgroundPosition: "100% 50%" },
      "100%": { backgroundPosition: "0% 50%" }
    },
    fadeIn: {
      "0%": { opacity: "0" },
      "100%": { opacity: "1" }
    },
    slideUp: {
      "0%": { transform: "translateY(10px)", opacity: "0" },
      "100%": { transform: "translateY(0)", opacity: "1" }
    },
    slideDown: {
      "0%": { transform: "translateY(-10px)", opacity: "0" },
      "100%": { transform: "translateY(0)", opacity: "1" }
    },
    scaleIn: {
      "0%": { transform: "scale(0.9)", opacity: "0" },
      "100%": { transform: "scale(1)", opacity: "1" }
    },
    pulse: {
      "0%, 100%": { opacity: "1" },
      "50%": { opacity: "0.5" }
    },
    spin: {
      "0%": { transform: "rotate(0deg)" },
      "100%": { transform: "rotate(360deg)" }
    },
    bounce: {
      "0%, 100%": {
        transform: "translateY(-25%)",
        animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)"
      },
      "50%": {
        transform: "translateY(0)",
        animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)"
      }
    }
  }
};

// src/Button.tsx
import React from "react";
import { jsx } from "react/jsx-runtime";
var getButtonStyles = (variant, size, disabled) => {
  const baseStyles = {
    fontFamily: "system-ui, -apple-system, sans-serif",
    fontWeight: "600",
    borderRadius: "0.5rem",
    // 0.5rem as specified in requirements
    border: "2px solid",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease-in-out",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    opacity: disabled ? 0.6 : 1
  };
  const sizeStyles = {
    sm: {
      padding: "0.5rem 1rem",
      fontSize: "0.875rem",
      lineHeight: "1.25rem"
    },
    md: {
      padding: "0.75rem 1.5rem",
      fontSize: "1rem",
      lineHeight: "1.5rem"
    },
    lg: {
      padding: "1rem 2rem",
      fontSize: "1.125rem",
      lineHeight: "1.75rem"
    }
  };
  const variantStyles = {
    primary: {
      backgroundColor: colors.navy,
      borderColor: colors.navy,
      color: colors.white,
      ":hover": !disabled ? {
        backgroundColor: colors.gray[800],
        borderColor: colors.gray[800],
        transform: "translateY(-1px)",
        boxShadow: "0 4px 8px rgba(13, 27, 42, 0.2)"
      } : {}
    },
    secondary: {
      backgroundColor: colors.gold,
      borderColor: colors.gold,
      color: colors.navy,
      ":hover": !disabled ? {
        backgroundColor: "#E6A200",
        borderColor: "#E6A200",
        transform: "translateY(-1px)",
        boxShadow: "0 4px 8px rgba(244, 180, 0, 0.2)"
      } : {}
    },
    outline: {
      backgroundColor: "transparent",
      borderColor: colors.navy,
      color: colors.navy,
      ":hover": !disabled ? {
        backgroundColor: colors.navy,
        color: colors.white,
        transform: "translateY(-1px)",
        boxShadow: "0 4px 8px rgba(13, 27, 42, 0.2)"
      } : {}
    }
  };
  return {
    ...baseStyles,
    ...sizeStyles[size || "md"],
    ...variantStyles[variant || "primary"]
  };
};
var Button = ({
  variant = "primary",
  size = "md",
  children,
  disabled = false,
  style,
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const buttonStyles = getButtonStyles(variant, size, disabled);
  const hoverStyles = isHovered && !disabled ? buttonStyles[":hover"] : {};
  const handleMouseEnter = (e) => {
    setIsHovered(true);
    onMouseEnter?.(e);
  };
  const handleMouseLeave = (e) => {
    setIsHovered(false);
    onMouseLeave?.(e);
  };
  return /* @__PURE__ */ jsx(
    "button",
    {
      style: {
        ...buttonStyles,
        ...hoverStyles,
        ...style
      },
      disabled,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      ...props,
      children
    }
  );
};

// src/Card.tsx
import React2 from "react";
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var getCardStyles = (variant, size) => {
  const baseStyles = {
    borderRadius: "0.5rem",
    // 0.5rem as specified in requirements
    transition: "all 0.2s ease-in-out",
    fontFamily: "system-ui, -apple-system, sans-serif"
  };
  const sizeStyles = {
    sm: {
      padding: "1rem"
    },
    md: {
      padding: "1.5rem"
    },
    lg: {
      padding: "2rem"
    }
  };
  const variantStyles = {
    default: {
      backgroundColor: colors.white,
      border: `1px solid ${colors.border.light}`,
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      ":hover": {
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        transform: "translateY(-1px)"
      }
    },
    branded: {
      background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.gray[800]} 100%)`,
      border: `1px solid ${colors.navy}`,
      color: colors.white,
      boxShadow: "0 4px 6px -1px rgba(13, 27, 42, 0.2), 0 2px 4px -1px rgba(13, 27, 42, 0.1)",
      ":hover": {
        boxShadow: "0 10px 15px -3px rgba(13, 27, 42, 0.3), 0 4px 6px -2px rgba(13, 27, 42, 0.2)",
        transform: "translateY(-2px)"
      }
    },
    outlined: {
      backgroundColor: "transparent",
      border: `2px solid ${colors.navy}`,
      color: colors.navy,
      ":hover": {
        backgroundColor: colors.background.neutral,
        boxShadow: "0 4px 6px -1px rgba(13, 27, 42, 0.1), 0 2px 4px -1px rgba(13, 27, 42, 0.06)",
        transform: "translateY(-1px)"
      }
    }
  };
  return {
    ...baseStyles,
    ...sizeStyles[size || "md"],
    ...variantStyles[variant || "default"]
  };
};
var getTitleStyles = (variant) => {
  const baseStyles = {
    margin: "0 0 0.5rem 0",
    fontWeight: "600",
    fontSize: "1.25rem",
    lineHeight: "1.75rem"
  };
  const variantStyles = {
    default: {
      color: colors.text.primary
    },
    branded: {
      color: colors.gold
    },
    outlined: {
      color: colors.navy
    }
  };
  return {
    ...baseStyles,
    ...variantStyles[variant || "default"]
  };
};
var getSubtitleStyles = (variant) => {
  const baseStyles = {
    margin: "0 0 1rem 0",
    fontSize: "0.875rem",
    lineHeight: "1.25rem"
  };
  const variantStyles = {
    default: {
      color: colors.text.secondary
    },
    branded: {
      color: colors.gray[300]
    },
    outlined: {
      color: colors.text.secondary
    }
  };
  return {
    ...baseStyles,
    ...variantStyles[variant || "default"]
  };
};
var Card = ({
  variant = "default",
  size = "md",
  children,
  title,
  subtitle,
  style,
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  const [isHovered, setIsHovered] = React2.useState(false);
  const cardStyles = getCardStyles(variant, size);
  const hoverStyles = isHovered ? cardStyles[":hover"] : {};
  const titleStyles = getTitleStyles(variant);
  const subtitleStyles = getSubtitleStyles(variant);
  const handleMouseEnter = (e) => {
    setIsHovered(true);
    onMouseEnter?.(e);
  };
  const handleMouseLeave = (e) => {
    setIsHovered(false);
    onMouseLeave?.(e);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        ...cardStyles,
        ...hoverStyles,
        ...style
      },
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      ...props,
      children: [
        title && /* @__PURE__ */ jsx2("h3", { style: titleStyles, children: title }),
        subtitle && /* @__PURE__ */ jsx2("p", { style: subtitleStyles, children: subtitle }),
        /* @__PURE__ */ jsx2("div", { children })
      ]
    }
  );
};

// src/AIChat.tsx
import { useState } from "react";
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var AIChat = ({ apiKey, onMessage }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const addMessage = (text, isUser) => {
    const message = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      isUser,
      timestamp: /* @__PURE__ */ new Date()
    };
    setMessages((prev) => [...prev, message]);
    return message;
  };
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput("");
    setError(null);
    addMessage(userMessage, true);
    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMessage,
          apiKey: apiKey || process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY
        })
      });
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      const data = await response.json();
      const aiResponse = data.response || "No response received";
      addMessage(aiResponse, false);
      onMessage?.(userMessage, aiResponse);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get AI response";
      setError(errorMessage);
      addMessage(`Error: ${errorMessage}`, false);
    } finally {
      setIsLoading(false);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return /* @__PURE__ */ jsxs2(
    Card,
    {
      title: "Mahardika AI Assistant",
      subtitle: "Powered by DeepSeek AI",
      variant: "branded",
      size: "lg",
      style: { maxWidth: "800px", margin: "0 auto" },
      children: [
        /* @__PURE__ */ jsxs2(
          "div",
          {
            style: {
              height: "400px",
              overflowY: "auto",
              padding: "1rem",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "0.5rem",
              marginBottom: "1rem",
              border: `1px solid ${colors.gold}`
            },
            children: [
              messages.length === 0 ? /* @__PURE__ */ jsxs2(
                "div",
                {
                  style: {
                    textAlign: "center",
                    color: colors.gray[300],
                    padding: "2rem"
                  },
                  children: [
                    /* @__PURE__ */ jsx3("p", { children: "Welcome to Mahardika AI Assistant!" }),
                    /* @__PURE__ */ jsx3("p", { children: "Ask me anything about the Mahardika platform." })
                  ]
                }
              ) : messages.map((message) => /* @__PURE__ */ jsx3(
                "div",
                {
                  style: {
                    marginBottom: "1rem",
                    display: "flex",
                    justifyContent: message.isUser ? "flex-end" : "flex-start"
                  },
                  children: /* @__PURE__ */ jsxs2(
                    "div",
                    {
                      style: {
                        maxWidth: "70%",
                        padding: "0.75rem 1rem",
                        borderRadius: "0.5rem",
                        backgroundColor: message.isUser ? colors.gold : "rgba(255, 255, 255, 0.2)",
                        color: message.isUser ? colors.navy : colors.white,
                        fontSize: "0.875rem",
                        lineHeight: "1.4"
                      },
                      children: [
                        /* @__PURE__ */ jsx3("div", { children: message.text }),
                        /* @__PURE__ */ jsx3(
                          "div",
                          {
                            style: {
                              fontSize: "0.75rem",
                              opacity: 0.7,
                              marginTop: "0.25rem"
                            },
                            children: message.timestamp.toLocaleTimeString()
                          }
                        )
                      ]
                    }
                  )
                },
                message.id
              )),
              isLoading && /* @__PURE__ */ jsx3(
                "div",
                {
                  style: {
                    textAlign: "center",
                    color: colors.gold,
                    fontStyle: "italic"
                  },
                  children: "AI is thinking..."
                }
              )
            ]
          }
        ),
        error && /* @__PURE__ */ jsx3(
          "div",
          {
            style: {
              padding: "0.75rem",
              backgroundColor: "rgba(239, 68, 68, 0.2)",
              borderRadius: "0.5rem",
              marginBottom: "1rem",
              color: "#FCA5A5",
              fontSize: "0.875rem"
            },
            children: error
          }
        ),
        /* @__PURE__ */ jsxs2(
          "div",
          {
            style: {
              display: "flex",
              gap: "0.75rem",
              alignItems: "flex-end"
            },
            children: [
              /* @__PURE__ */ jsx3(
                "textarea",
                {
                  value: input,
                  onChange: (e) => setInput(e.target.value),
                  onKeyPress: handleKeyPress,
                  placeholder: "Type your message here... (Press Enter to send)",
                  disabled: isLoading,
                  style: {
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: `2px solid ${colors.gold}`,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: colors.white,
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    resize: "vertical",
                    minHeight: "50px",
                    maxHeight: "120px"
                  }
                }
              ),
              /* @__PURE__ */ jsx3(
                Button,
                {
                  onClick: handleSendMessage,
                  disabled: !input.trim() || isLoading,
                  variant: "secondary",
                  size: "lg",
                  children: isLoading ? "Sending..." : "Send"
                }
              )
            ]
          }
        )
      ]
    }
  );
};

// src/SecurityStatus.tsx
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
var SecurityStatus = ({
  isSecure,
  environment,
  className = "",
  onSecurityClick
}) => {
  const statusColor = isSecure ? colors.gold : "#FF6B6B";
  const backgroundColor = isSecure ? colors.navy : colors.gray[800];
  const borderColor = isSecure ? colors.gold : colors.gray[600];
  return /* @__PURE__ */ jsxs3(
    "div",
    {
      className,
      style: {
        padding: "1rem",
        borderRadius: "0.5rem",
        backgroundColor,
        border: `2px solid ${borderColor}`,
        color: colors.text.primary,
        cursor: onSecurityClick ? "pointer" : "default",
        transition: "all 0.2s ease-in-out",
        fontFamily: "system-ui, -apple-system, sans-serif"
      },
      onClick: onSecurityClick,
      onMouseEnter: (e) => {
        if (onSecurityClick) {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = `0 4px 12px rgba(244, 180, 0, 0.2)`;
        }
      },
      onMouseLeave: (e) => {
        if (onSecurityClick) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }
      },
      children: [
        /* @__PURE__ */ jsxs3(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.5rem"
            },
            children: [
              /* @__PURE__ */ jsxs3("div", { style: { display: "flex", alignItems: "center", gap: "0.5rem" }, children: [
                /* @__PURE__ */ jsx4("span", { style: { fontSize: "1.5rem" }, children: isSecure ? "\u{1F512}" : "\u26A0\uFE0F" }),
                /* @__PURE__ */ jsx4(
                  "span",
                  {
                    style: {
                      color: statusColor,
                      fontWeight: "600",
                      fontSize: "1.1rem"
                    },
                    children: isSecure ? "Secure" : "Attention Required"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx4(
                "div",
                {
                  style: {
                    padding: "0.25rem 0.5rem",
                    backgroundColor: isSecure ? "rgba(244, 180, 0, 0.1)" : "rgba(255, 107, 107, 0.1)",
                    border: `1px solid ${statusColor}`,
                    borderRadius: "0.25rem",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                    color: statusColor,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  },
                  children: environment
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx4("div", { style: { marginBottom: "0.75rem" }, children: /* @__PURE__ */ jsxs3(
          "p",
          {
            style: {
              margin: 0,
              fontSize: "0.875rem",
              color: colors.text.secondary,
              lineHeight: "1.4"
            },
            children: [
              "Environment:",
              " ",
              /* @__PURE__ */ jsx4("strong", { style: { color: colors.text.primary }, children: environment })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx4(
          "div",
          {
            style: {
              padding: "0.75rem",
              backgroundColor: isSecure ? "rgba(244, 180, 0, 0.05)" : "rgba(255, 107, 107, 0.05)",
              borderLeft: `4px solid ${statusColor}`,
              borderRadius: "0.25rem"
            },
            children: /* @__PURE__ */ jsx4(
              "p",
              {
                style: {
                  margin: 0,
                  fontSize: "0.875rem",
                  color: colors.text.secondary,
                  lineHeight: "1.4"
                },
                children: isSecure ? "All secrets properly configured and protected. Environment variables are secure and .gitignore rules are in place." : "Security configuration requires attention. Please verify environment variables and secrets protection."
              }
            )
          }
        ),
        /* @__PURE__ */ jsx4(
          "div",
          {
            style: {
              marginTop: "0.75rem",
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap"
            },
            children: [
              { label: ".env protected", status: isSecure },
              { label: "Secrets secured", status: isSecure },
              { label: "API keys safe", status: isSecure }
            ].map(({ label, status }) => /* @__PURE__ */ jsxs3(
              "div",
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  padding: "0.25rem 0.5rem",
                  backgroundColor: status ? "rgba(244, 180, 0, 0.1)" : "rgba(148, 163, 184, 0.1)",
                  borderRadius: "0.25rem",
                  fontSize: "0.75rem"
                },
                children: [
                  /* @__PURE__ */ jsx4("span", { style: { fontSize: "0.75rem" }, children: status ? "\u2705" : "\u274C" }),
                  /* @__PURE__ */ jsx4(
                    "span",
                    {
                      style: {
                        color: status ? colors.gold : colors.gray[400],
                        fontWeight: "500"
                      },
                      children: label
                    }
                  )
                ]
              },
              label
            ))
          }
        ),
        /* @__PURE__ */ jsxs3(
          "div",
          {
            style: {
              marginTop: "0.75rem",
              paddingTop: "0.75rem",
              borderTop: `1px solid ${colors.gray[700]}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ jsx4(
                "div",
                {
                  style: {
                    fontSize: "0.75rem",
                    color: colors.gray[400],
                    fontWeight: "500"
                  },
                  children: "Mahardika Security"
                }
              ),
              /* @__PURE__ */ jsx4(
                "div",
                {
                  style: {
                    fontSize: "0.75rem",
                    color: colors.gray[500],
                    fontFamily: "monospace"
                  },
                  children: "Navy #0D1B2A \u2022 Gold #F4B400"
                }
              )
            ]
          }
        )
      ]
    }
  );
};

// src/BrandButton.tsx
import React4 from "react";
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
var getBrandButtonStyles = (variant, size, disabled) => {
  const baseStyles = {
    fontFamily: theme.typography.fontFamily.primary,
    fontWeight: theme.typography.fontWeight.semibold,
    borderRadius: theme.borderRadius.lg,
    border: "2px solid",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: theme.transitions.brand,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    opacity: disabled ? 0.6 : 1,
    position: "relative",
    overflow: "hidden"
  };
  const sizeStyles = theme.components.button.sizes;
  const variantStyles = {
    navy: {
      backgroundColor: theme.colors.navy,
      borderColor: theme.colors.navy,
      color: theme.colors.white,
      boxShadow: theme.shadows.brand.navy.sm,
      ":hover": !disabled ? {
        backgroundColor: theme.colors.hover.navy,
        borderColor: theme.colors.hover.navy,
        transform: "translateY(-2px)",
        boxShadow: theme.shadows.brand.navy.md
      } : {},
      ":active": !disabled ? {
        transform: "translateY(0px)",
        boxShadow: theme.shadows.brand.navy.sm
      } : {}
    },
    gold: {
      backgroundColor: theme.colors.gold,
      borderColor: theme.colors.gold,
      color: theme.colors.navy,
      boxShadow: theme.shadows.brand.gold.sm,
      ":hover": !disabled ? {
        backgroundColor: theme.colors.hover.gold,
        borderColor: theme.colors.hover.gold,
        transform: "translateY(-2px)",
        boxShadow: theme.shadows.brand.gold.md
      } : {},
      ":active": !disabled ? {
        transform: "translateY(0px)",
        boxShadow: theme.shadows.brand.gold.sm
      } : {}
    },
    "outline-navy": {
      backgroundColor: theme.colors.transparent,
      borderColor: theme.colors.navy,
      color: theme.colors.navy,
      ":hover": !disabled ? {
        backgroundColor: theme.colors.navy,
        color: theme.colors.white,
        transform: "translateY(-2px)",
        boxShadow: theme.shadows.brand.navy.md
      } : {},
      ":active": !disabled ? {
        transform: "translateY(0px)",
        backgroundColor: theme.colors.hover.navy
      } : {}
    },
    "outline-gold": {
      backgroundColor: theme.colors.transparent,
      borderColor: theme.colors.gold,
      color: theme.colors.gold,
      ":hover": !disabled ? {
        backgroundColor: theme.colors.gold,
        color: theme.colors.navy,
        transform: "translateY(-2px)",
        boxShadow: theme.shadows.brand.gold.md
      } : {},
      ":active": !disabled ? {
        transform: "translateY(0px)",
        backgroundColor: theme.colors.active.gold
      } : {}
    },
    gradient: {
      background: theme.colors.gradients.brand,
      borderColor: theme.colors.transparent,
      color: theme.colors.white,
      position: "relative",
      overflow: "hidden",
      ":before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: theme.colors.gradients.brandReverse,
        opacity: 0,
        transition: theme.transitions.opacity,
        zIndex: 1
      },
      ":hover": !disabled ? {
        transform: "translateY(-2px)",
        boxShadow: theme.shadows.brand.navy.xl,
        ":before": {
          opacity: 1
        }
      } : {},
      ":active": !disabled ? {
        transform: "translateY(0px)"
      } : {}
    }
  };
  return {
    ...baseStyles,
    ...sizeStyles[size || "md"],
    ...variantStyles[variant || "navy"]
  };
};
var BrandButton = ({
  variant = "navy",
  size = "md",
  children,
  disabled = false,
  icon,
  prompt,
  style,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  title,
  ...props
}) => {
  const [isHovered, setIsHovered] = React4.useState(false);
  const [isActive, setIsActive] = React4.useState(false);
  const buttonStyles = getBrandButtonStyles(variant, size, disabled);
  const hoverStyles = isHovered && !disabled ? buttonStyles[":hover"] : {};
  const activeStyles = isActive && !disabled ? buttonStyles[":active"] : {};
  const handleMouseEnter = (e) => {
    setIsHovered(true);
    onMouseEnter?.(e);
  };
  const handleMouseLeave = (e) => {
    setIsHovered(false);
    setIsActive(false);
    onMouseLeave?.(e);
  };
  const handleMouseDown = (e) => {
    setIsActive(true);
    onMouseDown?.(e);
  };
  const handleMouseUp = (e) => {
    setIsActive(false);
    onMouseUp?.(e);
  };
  const buttonTitle = title || prompt || (typeof children === "string" ? children : "Mahardika Brand Button");
  return /* @__PURE__ */ jsxs4(
    "button",
    {
      style: {
        ...buttonStyles,
        ...hoverStyles,
        ...activeStyles,
        ...style
      },
      disabled,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      title: buttonTitle,
      ...props,
      children: [
        icon && /* @__PURE__ */ jsx5("span", { style: { display: "flex", alignItems: "center" }, children: icon }),
        /* @__PURE__ */ jsx5("span", { style: { position: "relative", zIndex: 2 }, children })
      ]
    }
  );
};
var BrandButtonTemplates = {
  NavyPrimary: (props) => /* @__PURE__ */ jsx5(
    BrandButton,
    {
      variant: "navy",
      prompt: "Primary action button in Mahardika navy",
      ...props
    }
  ),
  GoldSecondary: (props) => /* @__PURE__ */ jsx5(
    BrandButton,
    {
      variant: "gold",
      prompt: "Secondary action button in Mahardika gold",
      ...props
    }
  ),
  NavyOutline: (props) => /* @__PURE__ */ jsx5(
    BrandButton,
    {
      variant: "outline-navy",
      prompt: "Outlined button with navy border",
      ...props
    }
  ),
  GoldOutline: (props) => /* @__PURE__ */ jsx5(
    BrandButton,
    {
      variant: "outline-gold",
      prompt: "Outlined button with gold border",
      ...props
    }
  ),
  GradientFeature: (props) => /* @__PURE__ */ jsx5(
    BrandButton,
    {
      variant: "gradient",
      prompt: "Feature button with navy-to-gold gradient",
      ...props
    }
  )
};

// src/BrandCard.tsx
import React5 from "react";
import { Fragment, jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
var getBrandCardStyles = (variant, size, elevation, pattern) => {
  const baseStyles = {
    borderRadius: theme.borderRadius.lg,
    transition: theme.transitions.brand,
    fontFamily: theme.typography.fontFamily.primary,
    position: "relative",
    overflow: "hidden"
  };
  const sizeStyles = theme.components.card.sizes;
  const elevationStyles = {
    low: {
      boxShadow: theme.shadows.sm
    },
    medium: {
      boxShadow: theme.shadows.md
    },
    high: {
      boxShadow: theme.shadows.xl
    }
  };
  const patternStyles = {
    none: {},
    dots: {
      backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
      backgroundSize: "20px 20px"
    },
    grid: {
      backgroundImage: `
        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
      `,
      backgroundSize: "20px 20px"
    },
    diagonal: {
      backgroundImage: `repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        rgba(255,255,255,0.05) 10px,
        rgba(255,255,255,0.05) 20px
      )`
    }
  };
  const variantStyles = {
    "navy-primary": {
      background: theme.colors.gradients.primary,
      border: `1px solid ${theme.colors.navy}`,
      color: theme.colors.white,
      boxShadow: theme.shadows.brand.navy.lg,
      ":hover": {
        transform: "translateY(-4px)",
        boxShadow: theme.shadows.brand.navy.xl
      },
      ...patternStyles[pattern || "none"]
    },
    "gold-primary": {
      background: theme.colors.gradients.secondary,
      border: `1px solid ${theme.colors.gold}`,
      color: theme.colors.navy,
      boxShadow: theme.shadows.brand.gold.lg,
      ":hover": {
        transform: "translateY(-4px)",
        boxShadow: theme.shadows.brand.gold.xl
      },
      ...patternStyles[pattern || "none"]
    },
    "navy-outline": {
      backgroundColor: theme.colors.transparent,
      border: `2px solid ${theme.colors.navy}`,
      color: theme.colors.navy,
      backdropFilter: "blur(8px)",
      ":hover": {
        backgroundColor: theme.colors.hover.navyLight,
        transform: "translateY(-2px)",
        boxShadow: theme.shadows.brand.navy.md
      }
    },
    "gold-outline": {
      backgroundColor: theme.colors.transparent,
      border: `2px solid ${theme.colors.gold}`,
      color: theme.colors.gold,
      backdropFilter: "blur(8px)",
      ":hover": {
        backgroundColor: theme.colors.hover.goldLight,
        transform: "translateY(-2px)",
        boxShadow: theme.shadows.brand.gold.md
      }
    },
    gradient: {
      background: theme.colors.gradients.animated,
      border: "none",
      color: theme.colors.white,
      backgroundSize: "200% 200%",
      animation: "gradientShift 6s ease infinite",
      ":hover": {
        transform: "translateY(-4px)",
        boxShadow: theme.shadows.brand.navy.xl
      },
      ...patternStyles[pattern || "none"]
    },
    "navy-glass": {
      background: theme.colors.background.glass.navy,
      border: `1px solid rgba(13, 27, 42, 0.2)`,
      color: theme.colors.white,
      backdropFilter: "blur(16px) saturate(180%)",
      ":hover": {
        background: "rgba(13, 27, 42, 0.9)",
        transform: "translateY(-2px)",
        boxShadow: theme.shadows.brand.navy.lg
      }
    },
    "gold-glass": {
      background: theme.colors.background.glass.gold,
      border: `1px solid rgba(244, 180, 0, 0.2)`,
      color: theme.colors.navy,
      backdropFilter: "blur(16px) saturate(180%)",
      ":hover": {
        background: "rgba(244, 180, 0, 0.9)",
        transform: "translateY(-2px)",
        boxShadow: theme.shadows.brand.gold.lg
      }
    }
  };
  return {
    ...baseStyles,
    ...sizeStyles[size || "md"],
    ...elevationStyles[elevation || "medium"],
    ...variantStyles[variant || "navy-primary"]
  };
};
var getBrandTitleStyles = (variant) => {
  const baseStyles = {
    margin: `0 0 ${theme.spacing[3]} 0`,
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: theme.typography.fontSize["2xl"],
    lineHeight: theme.typography.lineHeight.tight,
    letterSpacing: theme.typography.letterSpacing.tight
  };
  const variantStyles = {
    "navy-primary": { color: theme.colors.gold },
    "gold-primary": { color: theme.colors.navy },
    "navy-outline": { color: theme.colors.navy },
    "gold-outline": { color: theme.colors.gold },
    gradient: {
      color: theme.colors.white,
      textShadow: "0 2px 4px rgba(0,0,0,0.3)"
    },
    "navy-glass": { color: theme.colors.gold },
    "gold-glass": { color: theme.colors.navy }
  };
  return {
    ...baseStyles,
    ...variantStyles[variant || "navy-primary"]
  };
};
var getBrandSubtitleStyles = (variant) => {
  const baseStyles = {
    margin: `0 0 ${theme.spacing[6]} 0`,
    fontSize: theme.typography.fontSize.base,
    lineHeight: theme.typography.lineHeight.normal,
    opacity: 0.9
  };
  const variantStyles = {
    "navy-primary": { color: theme.colors.white },
    "gold-primary": { color: theme.colors.navy },
    "navy-outline": { color: theme.colors.gray[600] },
    "gold-outline": { color: theme.colors.gray[600] },
    gradient: {
      color: theme.colors.white,
      textShadow: "0 1px 2px rgba(0,0,0,0.2)"
    },
    "navy-glass": { color: theme.colors.white },
    "gold-glass": { color: theme.colors.navy }
  };
  return {
    ...baseStyles,
    ...variantStyles[variant || "navy-primary"]
  };
};
var BrandCard = ({
  variant = "navy-primary",
  size = "md",
  children,
  title,
  subtitle,
  icon,
  prompt,
  elevation = "medium",
  pattern = "none",
  style,
  onMouseEnter,
  onMouseLeave,
  title: htmlTitle,
  ...props
}) => {
  const [isHovered, setIsHovered] = React5.useState(false);
  const cardStyles = getBrandCardStyles(variant, size, elevation, pattern);
  const hoverStyles = isHovered ? cardStyles[":hover"] : {};
  const titleStyles = getBrandTitleStyles(variant);
  const subtitleStyles = getBrandSubtitleStyles(variant);
  const handleMouseEnter = (e) => {
    setIsHovered(true);
    onMouseEnter?.(e);
  };
  const handleMouseLeave = (e) => {
    setIsHovered(false);
    onMouseLeave?.(e);
  };
  const cardTitle = htmlTitle || prompt || (title ? `Mahardika Brand Card: ${title}` : "Mahardika Brand Card");
  return /* @__PURE__ */ jsxs5(Fragment, { children: [
    /* @__PURE__ */ jsx6("style", { children: `
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        ` }),
    /* @__PURE__ */ jsxs5(
      "div",
      {
        style: {
          ...cardStyles,
          ...hoverStyles,
          ...style
        },
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        title: cardTitle,
        ...props,
        children: [
          (icon || title) && /* @__PURE__ */ jsxs5(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "flex-start",
                marginBottom: "1rem"
              },
              children: [
                icon && /* @__PURE__ */ jsx6(
                  "div",
                  {
                    style: {
                      marginRight: "1rem",
                      fontSize: "1.5rem",
                      opacity: 0.9
                    },
                    children: icon
                  }
                ),
                /* @__PURE__ */ jsxs5("div", { style: { flex: 1 }, children: [
                  title && /* @__PURE__ */ jsx6("h3", { style: titleStyles, children: title }),
                  subtitle && /* @__PURE__ */ jsx6("p", { style: subtitleStyles, children: subtitle })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx6("div", { style: { position: "relative", zIndex: 1 }, children })
        ]
      }
    )
  ] });
};
var BrandCardTemplates = {
  NavyHero: (props) => /* @__PURE__ */ jsx6(
    BrandCard,
    {
      variant: "navy-primary",
      size: "xl",
      elevation: "high",
      pattern: "dots",
      prompt: "Hero section card with navy background and gold accents",
      ...props
    }
  ),
  GoldFeature: (props) => /* @__PURE__ */ jsx6(
    BrandCard,
    {
      variant: "gold-primary",
      size: "lg",
      elevation: "medium",
      prompt: "Feature highlight card with gold background",
      ...props
    }
  ),
  NavyOutlineInfo: (props) => /* @__PURE__ */ jsx6(
    BrandCard,
    {
      variant: "navy-outline",
      size: "md",
      elevation: "low",
      prompt: "Information card with navy outline",
      ...props
    }
  ),
  GoldOutlineAccent: (props) => /* @__PURE__ */ jsx6(
    BrandCard,
    {
      variant: "gold-outline",
      size: "md",
      elevation: "low",
      prompt: "Accent card with gold outline",
      ...props
    }
  ),
  GradientShowcase: (props) => /* @__PURE__ */ jsx6(
    BrandCard,
    {
      variant: "gradient",
      size: "lg",
      elevation: "high",
      pattern: "grid",
      prompt: "Showcase card with animated navy-gold gradient",
      ...props
    }
  ),
  NavyGlassModal: (props) => /* @__PURE__ */ jsx6(
    BrandCard,
    {
      variant: "navy-glass",
      size: "md",
      elevation: "high",
      prompt: "Glass morphism card with navy background",
      ...props
    }
  ),
  GoldGlassHighlight: (props) => /* @__PURE__ */ jsx6(
    BrandCard,
    {
      variant: "gold-glass",
      size: "md",
      elevation: "high",
      prompt: "Glass morphism card with gold background",
      ...props
    }
  )
};

// src/demo.tsx
import { jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
var MahardikaDemo = () => {
  return /* @__PURE__ */ jsxs6(
    "div",
    {
      style: {
        padding: theme.spacing[8],
        backgroundColor: theme.colors.background.neutral,
        fontFamily: theme.typography.fontFamily.primary,
        minHeight: "100vh"
      },
      children: [
        /* @__PURE__ */ jsxs6("div", { style: { textAlign: "center", marginBottom: theme.spacing[12] }, children: [
          /* @__PURE__ */ jsx7(
            "h1",
            {
              style: {
                fontSize: theme.typography.fontSize["4xl"],
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.navy,
                marginBottom: theme.spacing[4]
              },
              children: "Mahardika Brand Components"
            }
          ),
          /* @__PURE__ */ jsxs6(
            "p",
            {
              style: {
                fontSize: theme.typography.fontSize.lg,
                color: theme.colors.text.secondary,
                maxWidth: "600px",
                margin: "0 auto"
              },
              children: [
                "BrandButton and BrandCard components with Navy ",
                theme.colors.navy,
                " and Gold ",
                theme.colors.gold
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx7(
          BrandCard,
          {
            variant: "navy-outline",
            size: "lg",
            title: "\u{1F3AF} BrandButton Variants",
            subtitle: "Interactive buttons with Mahardika brand styling",
            style: { marginBottom: theme.spacing[8] },
            children: /* @__PURE__ */ jsxs6(
              "div",
              {
                style: {
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: theme.spacing[4]
                },
                children: [
                  /* @__PURE__ */ jsx7(BrandButton, { variant: "navy", size: "md", children: "Navy Primary" }),
                  /* @__PURE__ */ jsx7(BrandButton, { variant: "gold", size: "md", children: "Gold Primary" }),
                  /* @__PURE__ */ jsx7(BrandButton, { variant: "outline-navy", size: "md", children: "Navy Outline" }),
                  /* @__PURE__ */ jsx7(BrandButton, { variant: "outline-gold", size: "md", children: "Gold Outline" }),
                  /* @__PURE__ */ jsx7(BrandButton, { variant: "gradient", size: "md", children: "Gradient" })
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsxs6(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: theme.spacing[6]
            },
            children: [
              /* @__PURE__ */ jsxs6(
                BrandCard,
                {
                  variant: "navy-primary",
                  size: "md",
                  title: "Navy Primary",
                  subtitle: "Primary brand card",
                  icon: "\u{1F6E1}\uFE0F",
                  children: [
                    /* @__PURE__ */ jsx7(
                      "p",
                      {
                        style: {
                          color: theme.colors.white,
                          marginBottom: theme.spacing[4]
                        },
                        children: "Navy background with gold accents"
                      }
                    ),
                    /* @__PURE__ */ jsx7(BrandButton, { variant: "gold", size: "sm", children: "Learn More" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs6(
                BrandCard,
                {
                  variant: "gold-primary",
                  size: "md",
                  title: "Gold Primary",
                  subtitle: "Secondary brand card",
                  icon: "\u2B50",
                  children: [
                    /* @__PURE__ */ jsx7(
                      "p",
                      {
                        style: { color: theme.colors.navy, marginBottom: theme.spacing[4] },
                        children: "Gold background with navy text"
                      }
                    ),
                    /* @__PURE__ */ jsx7(BrandButton, { variant: "navy", size: "sm", children: "Get Started" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs6(
                BrandCard,
                {
                  variant: "gradient",
                  size: "md",
                  title: "Gradient Card",
                  subtitle: "Animated gradient",
                  icon: "\u{1F31F}",
                  children: [
                    /* @__PURE__ */ jsx7(
                      "p",
                      {
                        style: {
                          color: theme.colors.white,
                          marginBottom: theme.spacing[4]
                        },
                        children: "Dynamic brand gradient animation"
                      }
                    ),
                    /* @__PURE__ */ jsx7(BrandButton, { variant: "outline-gold", size: "sm", children: "Explore" })
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
};
export {
  AIChat,
  BrandButton,
  BrandButtonTemplates,
  BrandCard,
  BrandCardTemplates,
  Button,
  Card,
  MahardikaDemo,
  SecurityStatus,
  bootstrapColorOverrides,
  colors,
  scssVariables,
  theme
};
//# sourceMappingURL=index.mjs.map