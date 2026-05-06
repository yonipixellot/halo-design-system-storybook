import type { Meta, StoryObj } from '@storybook/react';
import { SideMenu } from '@/screens/menu/SideMenu';

/* SideMenu — slide-in drawer from inline-start with a nested page stack.
   Default opens on the root menu list; the LanguagePage sub-story renders
   the language picker directly so reviewers don't have to tap through.

   To test the RTL toggle:
     1. Open the LanguagePage story (or open Default and tap Language)
     2. Tap עברית
     3. The .glass-app wrapper flips dir="rtl" and the entire storybook
        re-renders end-to-left. Hebrew strings come through useT(). */

const meta = {
  title: 'Organisms/SideMenu',
  component: SideMenu,
  decorators: [
    (Story) => (
      <div className="text-white sf relative" style={{ width: '100%', height: 852, background: '#000' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    onClose: () => console.log('close menu'),
  },
} satisfies Meta<typeof SideMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Default — root menu list (Language, Appearance, Notifications, etc.) */
export const Default: Story = {};
