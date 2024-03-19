import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

import MaskedExpirationInput from './MaskedExpirationInput';

describe('<MaskedExpirationInput />', () => {
    it('should render', async () => {
        render(<MaskedExpirationInput label="Label" />);
        const element = screen.getByLabelText('Label');
        expect(element).toBeInTheDocument();
        expect(element).toBeVisible();
    });

    it('should format initial value as as an expiration date', async () => {
        render(<MaskedExpirationInput label="Label" value="0324" />);
        const element = screen.getByLabelText('Label');
        expect(element).toHaveValue('03/24');
    });

    it('should format user-entered numeric input as an expiration date', async () => {
        render(<MaskedExpirationInput label="Label" />);
        const element = screen.getByLabelText('Label');
        await userEvent.type(element, '0324');
        expect(element).toHaveValue('03/24');
    });

    it('should not allow user-entered non-numeric input', async () => {
        render(<MaskedExpirationInput label="Label" />);
        const element = screen.getByLabelText('Label');
        await userEvent.type(element, '03/24abc');
        expect(element).toHaveValue('03/24');
    });

    it('should output the formatted value on change', async () => {
        const onChange = vi.fn();
        render(<MaskedExpirationInput label="Label" onChange={onChange} />);
        const element = screen.getByLabelText('Label');
        await userEvent.type(element, '0324');
        expect(element).toHaveValue('03/24');
        expect(onChange).toHaveBeenCalled();
        expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ target: expect.objectContaining({ value: '03/24' }) }));
    });

    describe('react-hook-form', () => {
        function TestForm({ onSubmit }: { onSubmit: SubmitHandler<{ expiry: string }> }) {
            const {
                control,
                formState: { errors },
                handleSubmit,
            } = useForm<{ expiry: string }>();

            return (
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        control={control}
                        name="expiry"
                        render={({ field }) => <MaskedExpirationInput error={!!errors.expiry} label="Label" {...field} />}
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
            await userEvent.type(element, '0324');
            await userEvent.click(screen.getByText('Submit'));
            expect(onSubmit).toHaveBeenCalledOnce();
            expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ expiry: '03/24' }), expect.anything());
        });
    });
});
