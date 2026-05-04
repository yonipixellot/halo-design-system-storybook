import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassField } from '@/screens/auth/_shared';

const meta = {
  title: 'Molecules/GlassField',
  component: GlassField,
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
} satisfies Meta<typeof GlassField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [v, setV] = useState('');
    return <GlassField label="Email" type="email" value={v} onChange={setV} placeholder="you@school.com" />;
  },
};

export const WithHint: Story = {
  render: () => {
    const [v, setV] = useState('');
    return (
      <GlassField
        label="Password"
        type="password"
        value={v}
        onChange={setV}
        placeholder="Strong password"
        hint="Min 8 characters, 1 uppercase, 1 number"
      />
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [v, setV] = useState('weak');
    return (
      <GlassField
        label="Password"
        type="password"
        value={v}
        onChange={setV}
        placeholder="Strong password"
        error="Doesn't meet the password rules yet"
      />
    );
  },
};

export const WithRightSlot: Story = {
  render: () => {
    const [v, setV] = useState('secret123');
    const [show, setShow] = useState(false);
    return (
      <GlassField
        label="Password"
        type={show ? 'text' : 'password'}
        value={v}
        onChange={setV}
        placeholder="••••••••"
        rightSlot={
          <button
            onClick={() => setShow((x) => !x)}
            className="sf text-[10.5px] tracking-tight font-semibold text-halo-cyan px-1.5"
          >
            {show ? 'Hide' : 'Show'}
          </button>
        }
      />
    );
  },
};
