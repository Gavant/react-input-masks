import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

import MaskedPatternInput from './MaskedPatternInput';

describe('<MaskedPatternInput />', () => {
    it('should render', async () => {
        render(<MaskedPatternInput format="#### #### #### ####" label="Label" />);
        const element = screen.getByLabelText('Label');
        expect(element).toBeInTheDocument();
        expect(element).toBeVisible();
    });

    it('should format initial value to match the pattern', async () => {
        render(<MaskedPatternInput format="#### #### #### ####" label="Label" value="1234567890123456" />);
        const element = screen.getByLabelText('Label');
        expect(element).toHaveValue('1234 5678 9012 3456');
    });

    it('should format user-entered to match the pattern', async () => {
        render(<MaskedPatternInput format="#### #### #### ####" label="Label" />);
        const element = screen.getByLabelText('Label');
        await userEvent.type(element, '1234567890123456');
        expect(element).toHaveValue('1234 5678 9012 3456');
    });

    it('should not allow user-entered that does not match the pattern', async () => {
        render(<MaskedPatternInput format="#### #### #### ####" label="Label" />);
        const element = screen.getByLabelText('Label');
        await userEvent.type(element, '1234abc567890123456');
        expect(element).toHaveValue('1234 5678 9012 3456');
    });

    it('should output the unformatted value on change', async () => {
        const onChange = vi.fn();
        render(<MaskedPatternInput format="#### #### #### ####" label="Label" onChange={onChange} />);
        const element = screen.getByLabelText('Label');
        await userEvent.type(element, '1234567890123456');
        expect(element).toHaveValue('1234 5678 9012 3456');
        expect(onChange).toHaveBeenCalled();
        expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ target: expect.objectContaining({ value: '1234567890123456' }) }));
    });

    describe('react-hook-form', () => {
        function TestForm({ onSubmit }: { onSubmit: SubmitHandler<{ ccNum: string }> }) {
            const {
                control,
                formState: { errors },
                handleSubmit,
            } = useForm<{ ccNum: string }>();

            return (
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        control={control}
                        name="ccNum"
                        render={({ field }) => (
                            <MaskedPatternInput error={!!errors.ccNum} format="#### #### #### ####" label="Label" {...field} />
                        )}
                        rules={{ required: true }}
                    />
                    <button type="submit">Submit</button>
                </form>
            );
        }

        it('should have inter-op with useForm()', async () => {
            const onSubmit = vi.fn();
            render(<TestForm onSubmit={onSubmit} />);
            const element = screen.getByLabelText('Label');
            await userEvent.type(element, '1234567890123456');
            await userEvent.click(screen.getByText('Submit'));
            expect(onSubmit).toHaveBeenCalledOnce();
            expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ ccNum: '1234567890123456' }), expect.anything());
        });
    });
});
