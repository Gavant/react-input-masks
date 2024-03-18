import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

import MaskedPhoneInput from './MaskedPhoneInput';

describe('<MaskedPhoneInput />', () => {
    it('should render', async () => {
        render(<MaskedPhoneInput label="Label" />);
        const element = screen.getByLabelText('Label');
        expect(element).toBeInTheDocument();
        expect(element).toBeVisible();
    });

    it('should format initial value as a phone number', async () => {
        render(<MaskedPhoneInput label="Label" value="5551234567" />);
        const element = screen.getByLabelText('Label');
        expect(element).toHaveValue('(555) 123-4567');
    });

    it('should format user-entered input as a phone number', async () => {
        render(<MaskedPhoneInput label="Label" />);
        const element = screen.getByLabelText('Label');
        await userEvent.type(element, '5551234567');
        expect(element).toHaveValue('(555) 123-4567');
    });

    it('should not allow user-entered non-numeric input', async () => {
        render(<MaskedPhoneInput label="Label" />);
        const element = screen.getByLabelText('Label');
        await userEvent.type(element, '555abc1234567');
        expect(element).toHaveValue('(555) 123-4567');
    });

    it('should output the unformatted value on change', async () => {
        const onChange = vi.fn();
        render(<MaskedPhoneInput label="Label" onChange={onChange} />);
        const element = screen.getByLabelText('Label');
        await userEvent.type(element, '5551234567');
        expect(element).toHaveValue('(555) 123-4567');
        expect(onChange).toHaveBeenCalled();
        expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ target: expect.objectContaining({ value: '5551234567' }) }));
    });

    describe('react-hook-form', () => {
        function TestForm({ onSubmit }: { onSubmit: SubmitHandler<{ phone: string }> }) {
            const {
                control,
                formState: { errors },
                handleSubmit,
            } = useForm<{ phone: string }>();

            return (
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        control={control}
                        name="phone"
                        render={({ field }) => <MaskedPhoneInput error={!!errors.phone} label="Label" {...field} />}
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
            await userEvent.type(element, '5551234567');
            await userEvent.click(screen.getByText('Submit'));
            expect(onSubmit).toHaveBeenCalledOnce();
            expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ phone: '5551234567' }), expect.anything());
        });
    });
});
