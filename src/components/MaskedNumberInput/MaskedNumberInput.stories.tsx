import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Controller } from 'react-hook-form';

import MaskedNumberInput from './MaskedNumberInput';
import { ReactHookFormDemo } from '../../utils/storybook';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'Components/MaskedNumberInput',
    component: MaskedNumberInput,
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
} satisfies Meta<typeof MaskedNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
    args: {
        label: 'Basic Number',
    },
};

export const ReactHookForm: Story = {
    args: {
        label: 'Basic Number',
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
                    name="basic"
                    render={({ field }) => <MaskedNumberInput error={!!errors.basic} {...rest} {...field} />}
                    rules={{ required: true }}
                />
            )}
        </ReactHookFormDemo>
    ),
};
