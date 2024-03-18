import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import MaskedPatternInput from './MaskedPatternInput';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'Components/MaskedPatternInput',
    component: MaskedPatternInput,
    parameters: {
        // Optional parameter to center the component in the Canvas.
        // More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        // backgroundColor: { control: 'color' },
        // label: { control: '' }
    },
    // Use `fn` to spy on the onChange arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    args: { onChange: fn() },
} satisfies Meta<typeof MaskedPatternInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
    args: {
        label: 'CC Number',
        format: '#### #### #### ####',
    },
};

// TODO Story for integration w/react-hook-form and <Controller>
export const ReactHookForm: Story = {
    args: {
        label: 'Postal Code',
        format: '#####-####',
    },
};