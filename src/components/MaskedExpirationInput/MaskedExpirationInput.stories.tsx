import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Controller } from 'react-hook-form';

import MaskedExpirationInput from './MaskedExpirationInput';
import { ReactHookFormDemo } from '../../utils/storybook';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'Components/MaskedExpirationInput',
    component: MaskedExpirationInput,
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
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    args: { onChange: fn() },
} satisfies Meta<typeof MaskedExpirationInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
    args: {
        label: 'CC Expire (MM/YY)',
    },
};

export const ReactHookForm: Story = {
    args: {
        label: 'CC Expire (MM/YY)',
    },
    parameters: {
        docs: {
            source: {
                type: 'code',
            },
        },
    },
    render: ({ ...rest }) => (
        <ReactHookFormDemo>
            {({ control, errors }) => (
                <Controller
                    control={control}
                    name="ccExpire"
                    render={({ field }) => <MaskedExpirationInput error={!!errors.ccExpire} {...rest} {...field} />}
                    rules={{ required: true }}
                />
            )}
        </ReactHookFormDemo>
    ),
};
