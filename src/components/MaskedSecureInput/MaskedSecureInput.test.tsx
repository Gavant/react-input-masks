import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

import MaskedSecureInput from './MaskedSecureInput';

describe('<MaskedSecureInput />', () => {
    it('should render', async () => {
        render(<MaskedSecureInput format="###-##-####" label="Label" />);

        const element = screen.getByLabelText('Label');
        expect(element).toBeInTheDocument();
        expect(element).toBeVisible();
    });

    it('should toggle the visiblity of the value when blurred and focused', async () => {
        render(<MaskedSecureInput format="###-##-####" label="Label" />);

        const element = screen.getByLabelText('Label');
        await userEvent.type(element, '123456789');
        await userEvent.click(document.body);
        expect(element).toHaveAttribute('type', 'password');
        await userEvent.click(element);
        expect(element).toHaveAttribute('type', 'text');
    });

    it('should output the unformatted value on change', async () => {
        const onChange = vi.fn();
        render(<MaskedSecureInput format="###-##-####" label="Label" onChange={onChange} />);

        const element = screen.getByLabelText('Label');
        await userEvent.type(element, '123456789');
        expect(element).toHaveValue('123-45-6789');
        expect(onChange).toHaveBeenCalled();
        expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ target: expect.objectContaining({ value: '123456789' }) }));
    });

    describe('react-hook-form', () => {
        function TestForm({ onSubmit }: { onSubmit: SubmitHandler<{ ssn: string }> }) {
            const {
                control,
                formState: { errors },
                handleSubmit,
            } = useForm<{ ssn: string }>();

            return (
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        control={control}
                        name="ssn"
                        render={({ field }) => <MaskedSecureInput error={!!errors.ssn} format="###-##-####" label="Label" {...field} />}
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
            await userEvent.type(element, '123456789');
            await userEvent.click(screen.getByText('Submit'));
            expect(onSubmit).toHaveBeenCalledOnce();
            expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ ssn: '123456789' }), expect.anything());
        });
    });
});
