import { Button, Stack } from '@mui/material';
import { ReactNode } from 'react';
import { Control, FieldErrors, SubmitHandler, useForm } from 'react-hook-form';

interface FormValues {
    basic: string;
    ccExpire: string;
    ccNum: string;
    currency: string;
    currencyRtl: string;
    pct: string;
    phone: string;
    ssn: string;
    zip: string;
}

export function ReactHookFormDemo({
    children,
}: {
    // eslint-disable-next-line
    children: (vals: { control: Control<FormValues, any>; errors: FieldErrors<FormValues> }) => ReactNode;
}) {
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm<FormValues>({ defaultValues: { currency: '', currencyRtl: '0', phone: '' } });

    const onSubmit: SubmitHandler<FormValues> = (data) => console.log('submitted', data);

    return (
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
                {children({ control, errors })}
                <Button type="submit" variant="outlined">
                    Submit
                </Button>
            </Stack>
        </form>
    );
}
