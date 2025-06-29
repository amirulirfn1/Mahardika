import { colors } from "@mahardika/ui";
import { theme } from '../theme';

describe('Mahardika Theme System', () => {
  describe('Brand Colors', () => {
    it('should have correct Mahardika brand colors', () => {
      expect(theme.colors.navy).toBe('colors.navy');
      expect(theme.colors.gold).toBe('colors.gold');
      expect(theme.colors.primary).toBe('colors.navy');
      expect(theme.colors.secondary).toBe('colors.gold');
    });

    it('should have complete neutral color palette', () => {
      expect(theme.colors.white).toBe('#FFFFFF');
      expect(theme.colors.black).toBe('#000000');
      expect(theme.colors.transparent).toBe('transparent');
      expect(theme.colors.gray[50]).toBe('#F9FAFB');
      expect(theme.colors.gray[900]).toBe('#111827');
    });

    it('should have state colors', () => {
      expect(theme.colors.success).toBe('#10B981');
      expect(theme.colors.warning).toBe('#F59E0B');
      expect(theme.colors.error).toBe('#EF4444');
      expect(theme.colors.info).toBe('#3B82F6');
    });

    it('should have hover and active states', () => {
      expect(theme.colors.hover.navy).toBe('#1a2332');
      expect(theme.colors.hover.gold).toBe('#FFD23F');
      expect(theme.colors.active.navy).toBe('#0a1520');
      expect(theme.colors.active.gold).toBe('#E6A200');
    });

    it('should have gradient variations', () => {
      expect(theme.colors.gradients.primary).toContain('colors.navy');
      expect(theme.colors.gradients.secondary).toContain('colors.gold');
      expect(theme.colors.gradients.brand).toContain('colors.navy');
      expect(theme.colors.gradients.brand).toContain('colors.gold');
    });
  });

  describe('Typography', () => {
    it('should have font families', () => {
      expect(theme.typography.fontFamily.primary).toContain('system-ui');
      expect(theme.typography.fontFamily.heading).toContain('system-ui');
      expect(theme.typography.fontFamily.mono).toContain('SF Mono');
    });

    it('should have font sizes', () => {
      expect(theme.typography.fontSize.xs).toBe('0.75rem');
      expect(theme.typography.fontSize.base).toBe('1rem');
      expect(theme.typography.fontSize['2xl']).toBe('1.5rem');
      expect(theme.typography.fontSize['5xl']).toBe('3rem');
    });

    it('should have font weights', () => {
      expect(theme.typography.fontWeight.light).toBe('300');
      expect(theme.typography.fontWeight.normal).toBe('400');
      expect(theme.typography.fontWeight.semibold).toBe('600');
      expect(theme.typography.fontWeight.bold).toBe('700');
    });
  });

  describe('Component Variants', () => {
    describe('Button Components', () => {
      it('should have button sizes', () => {
        expect(theme.components.button.sizes.sm.padding).toBe(
          '0.75rem 1.25rem'
        );
        expect(theme.components.button.sizes.md.fontSize).toBe('1rem');
        expect(theme.components.button.sizes.lg.gap).toBe('1rem');
      });

      it('should have button variants', () => {
        expect(theme.components.button.variants.navy.backgroundColor).toBe(
          'colors.navy'
        );
        expect(theme.components.button.variants.gold.color).toBe('colors.navy');
        expect(
          theme.components.button.variants['outline-navy'].backgroundColor
        ).toBe('transparent');
        expect(
          theme.components.button.variants['outline-gold'].borderColor
        ).toBe('colors.gold');
      });
    });

    describe('Card Components', () => {
      it('should have card sizes', () => {
        expect(theme.components.card.sizes.sm.padding).toBe('1.25rem');
        expect(theme.components.card.sizes.md.minHeight).toBe('160px');
        expect(theme.components.card.sizes.xl.padding).toBe('3.5rem');
      });

      it('should have card variants', () => {
        expect(
          theme.components.card.variants['navy-primary'].background
        ).toContain('colors.navy');
        expect(theme.components.card.variants['gold-primary'].color).toBe(
          'colors.navy'
        );
        expect(
          theme.components.card.variants['navy-outline'].backgroundColor
        ).toBe('transparent');
        expect(theme.components.card.variants['gold-outline'].border).toContain(
          'colors.gold'
        );
      });
    });
  });

  describe('Theme Consistency', () => {
    it('should maintain brand color consistency', () => {
      expect(theme.colors.navy).toBe(theme.colors.primary);
      expect(theme.colors.gold).toBe(theme.colors.secondary);
    });

    it('should use standard border radius', () => {
      expect(theme.borderRadius.lg).toBe('0.5rem');
    });
  });
});
