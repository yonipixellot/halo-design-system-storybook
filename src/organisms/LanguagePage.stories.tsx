import type { Meta, StoryObj } from '@storybook/react';
import { LanguagePage } from '@/screens/menu/LanguagePage';

/* LanguagePage rendered directly inside a drawer-shaped frame.
   This is what users see after tapping "Language" in SideMenu.

   Tapping a language fires i18n.changeLanguage() globally — so picking
   עברית here will flip the *entire storybook* (including the storybook
   header chrome + every other open story) into RTL until you switch
   back. That's exactly the production behaviour. */

const meta = {
  title: 'Organisms/LanguagePage',
  component: LanguagePage,
  decorators: [
    (Story) => (
      <div
        className="text-white sf lg-glass-strong overflow-hidden flex flex-col"
        style={{
          width: 340,
          height: 852,
          background: 'var(--glass-strong-bg)',
          borderInlineEnd: '1px solid var(--glass-strong-border)',
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    onBack: () => console.log('back'),
    onClose: () => console.log('close'),
  },
} satisfies Meta<typeof LanguagePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
