import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassSelect } from '@/screens/auth/_shared';

const meta = {
  title: 'Molecules/GlassSelect',
  component: GlassSelect,
  decorators: [
    (Story) => (
      <div className="anim-fade text-white sf relative" style={{ minHeight: 320 }}>
        <div className="lg-atmosphere" />
        <div className="relative z-10 px-6 pt-12">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof GlassSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const GENDERS = [
  { value: 'm', label: 'Male' },
  { value: 'f', label: 'Female' },
  { value: 'nb', label: 'Non-binary' },
  { value: 'na', label: 'Prefer not to say' },
];

export const Empty: Story = {
  render: () => {
    const [v, setV] = useState('');
    return <GlassSelect label="Gender" value={v} onChange={setV} options={GENDERS} placeholder="Select…" />;
  },
};

export const Filled: Story = {
  render: () => {
    const [v, setV] = useState('nb');
    return <GlassSelect label="Gender" value={v} onChange={setV} options={GENDERS} />;
  },
};
