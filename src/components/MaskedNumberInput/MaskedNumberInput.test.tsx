import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

import MaskedNumberInput from './MaskedNumberInput';

describe('<MaskedNumberInput />', () => {
    it('should render', async () => {
        render(<MaskedNumberInput label="Label" />);
        const element = screen.getByLabelText('Label');
        expect(element).toBeInTheDocument();
        expect(element).toBeVisible();
    });

    it('should format initial value as a formatted number', async () => {
        render(<MaskedNumberInput label="Label" value="1234567.89" />);
        const element = screen.getByLabelText('Label');
        expect(element).toHaveValue('1,234,567.89');
    });

    it('should format user-entered numeric input as a formatted number', async () => {
        render(<MaskedNumberInput label="Label" />);
        const element = screen.getByLabelText('Label');
        await userEvent.type(element, '1234567.89');
        expect(element).toHaveValue('1,234,567.89');
    });

    it('should not allow user-entered non-numeric input', async () => {
        render(<MaskedNumberInput label="Label" />);
        const element = screen.getByLabelText('Label');
        await userEvent.type(element, '123.00abc');
        expect(element).toHaveValue('123.00');
    });

    it('should output the unformatted value on change', async () => {
        const onChange = vi.fn();
        render(<MaskedNumberInput label="Label" onChange={onChange} />);
        const element = screen.getByLabelText('Label');
        await userEvent.type(element, '12,345.67');
        expect(element).toHaveValue('12,345.67');
        expect(onChange).toHaveBeenCalled();
        expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ target: expect.objectContaining({ value: '12345.67' }) }));
    });

    describe('react-hook-form', () => {
        function TestForm({ onSubmit }: { onSubmit: SubmitHandler<{ num: string }> }) {
            const {
                control,
                formState: { errors },
                handleSubmit,
            } = useForm<{ num: string }>();

            return (
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        control={control}
                        name="num"
                        render={({ field }) => <MaskedNumberInput error={!!errors.num} label="Label" {...field} />}
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
            await userEvent.type(element, '12345.67');
            await userEvent.click(screen.getByText('Submit'));
            expect(onSubmit).toHaveBeenCalledOnce();
            expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ num: '12345.67' }), expect.anything());
        });
    });
});
