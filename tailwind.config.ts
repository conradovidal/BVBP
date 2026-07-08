import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import animate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'sans': ['Hanken Grotesk', 'system-ui', 'sans-serif'],
				'heading': ['Newsreader', 'Georgia', 'serif'],
				'display': ['Newsreader', 'Georgia', 'serif'],
				'mono': ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				bvbp: {
					corporate: 'hsl(var(--bvbp-corporate))',
					'corporate-light': 'hsl(var(--bvbp-corporate-light))',
					'corporate-dark': 'hsl(var(--bvbp-corporate-dark))',
					growth: 'hsl(var(--bvbp-growth))',
					'growth-light': 'hsl(var(--bvbp-growth-light))',
					'growth-dark': 'hsl(var(--bvbp-growth-dark))',
					forest: 'hsl(var(--bvbp-forest))',
					'forest-dark': 'hsl(var(--bvbp-forest-dark))',
					gold: 'hsl(var(--bvbp-gold))',
					ivory: 'hsl(var(--bvbp-ivory))',
					raised: 'hsl(var(--bvbp-raised))',
					inset: 'hsl(var(--bvbp-inset))',
					ink: 'hsl(var(--bvbp-ink))',
					'muted-ink': 'hsl(var(--bvbp-muted-ink))',
					positive: 'hsl(var(--bvbp-positive))',
					caution: 'hsl(var(--bvbp-caution))',
					risk: 'hsl(var(--bvbp-risk))',
					signal: 'hsl(var(--bvbp-signal))',
				}
			},
			backgroundImage: {
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-success': 'var(--gradient-success)',
				'gradient-subtle': 'var(--gradient-subtle)',
			},
			boxShadow: {
				'soft': 'var(--shadow-soft)',
				'strong': 'var(--shadow-strong)',
				'success': 'var(--shadow-success)',
			},
			transitionTimingFunction: {
				'smooth': 'var(--transition-smooth)',
				'bounce': 'var(--transition-bounce)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'pulse-subtle': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.85'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.8s ease-out forwards',
				'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite'
			}
		}
	},
	plugins: [animate, typography],
} satisfies Config;
