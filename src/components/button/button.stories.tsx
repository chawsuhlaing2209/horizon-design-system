// Figma node under test:
// https://www.figma.com/design/r1CpQEYecqROS0oIOMlqAx/2.-Horizon-Component?node-id=26-70
//
// The component set is variant (filled | outlined) x state (enable | hover |
// pressed | disabled) = 8 nodes. There is one story per node, named for the
// node, plus a Matrix story that draws all eight at once for a side-by-side
// against the frame.
//
// The per-state stories pin `state`, which beats the pointer. Playground leaves
// it at `enable` so real hover, press and focus drive the component.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button';

const LABEL = 'Sign in';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],

  args: { variant: 'filled', state: 'enable', children: LABEL },

  parameters: {
    // preview.tsx disables controls and actions globally for the token-docs
    // pages, which have no props. Components need both, so re-enable here.
    controls: { disable: false, expanded: true },
    actions: { disable: false },
    layout: 'centered',
    docs: {
      description: {
        component:
          'Button, built from Figma node 26:70. `variant` and `state` are the ' +
          'two Figma variant properties, kept verbatim. `state` pins a visual ' +
          'state for review; real `:hover` and `:active` render the same tokens, ' +
          'so an unpinned button behaves normally. The node has no focused ' +
          'variant — the keyboard ring here is built from the focus tokens the ' +
          'system already names, and is listed in docs/design-gaps.md.',
      },
    },
  },

  argTypes: {
    variant: {
      description: 'Figma `variant`. `filled` carries a fill and no stroke; `outlined` a 1px stroke and no fill.',
      options: ['filled', 'outlined'],
      control: { type: 'radio' },
      table: { defaultValue: { summary: 'filled' } },
    },
    state: {
      description:
        'Figma `state`. Pins the visual state and beats the pointer. `disabled` also sets the native `disabled` attribute, so the button stops responding for real.',
      options: ['enable', 'hover', 'pressed', 'disabled'],
      control: { type: 'radio' },
      table: { defaultValue: { summary: 'enable' } },
    },
    children: { description: 'The label. Not a Figma property — the node carries "Sign in" as sample content.', control: 'text' },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/* ---- variant = filled ------------------------------------------------ */

/** 26:71 — `state=enable, variant=filled` */
export const FilledEnable: Story = { args: { variant: 'filled', state: 'enable' } };

/** 26:73 — `state=hover, variant=filled` */
export const FilledHover: Story = { args: { variant: 'filled', state: 'hover' } };

/** 26:82 — `state=pressed, variant=filled` */
export const FilledPressed: Story = { args: { variant: 'filled', state: 'pressed' } };

/** 26:87 — `state=disabled, variant=filled` */
export const FilledDisabled: Story = { args: { variant: 'filled', state: 'disabled' } };

/* ---- variant = outlined ---------------------------------------------- */

/** 26:98 — `state=enable, variant=outlined` */
export const OutlinedEnable: Story = { args: { variant: 'outlined', state: 'enable' } };

/** 26:100 — `state=hover, variant=outlined` */
export const OutlinedHover: Story = { args: { variant: 'outlined', state: 'hover' } };

/** 26:102 — `state=pressed, variant=outlined` */
export const OutlinedPressed: Story = { args: { variant: 'outlined', state: 'pressed' } };

/** 26:104 — `state=disabled, variant=outlined` */
export const OutlinedDisabled: Story = { args: { variant: 'outlined', state: 'disabled' } };

/* ---- review views ----------------------------------------------------- */

/**
 * All eight nodes in the order the Figma frame stacks them, for a side-by-side
 * against 26:70.
 */
export const Matrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-gap-md)', padding: 'var(--spacing-padding-lg)' }}>
      {(['filled', 'outlined'] as const).map((variant) => (
        <div key={variant} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-gap-xs)', alignItems: 'flex-start' }}>
          {(['enable', 'hover', 'pressed', 'disabled'] as const).map((state) => (
            <Button key={state} variant={variant} state={state}>{LABEL}</Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

/**
 * Unpinned. Hover it, hold it down, and tab to it — the pointer and the
 * keyboard drive the states rather than the `state` prop.
 */
export const Playground: Story = {
  args: { variant: 'filled', state: 'enable' },
};
