'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function useEventForm() {
    const [isFreeEvent, setIsFreeEvent] = useState(false);

    useEffect(() => {
        const form = document.querySelector('form');
        const priceInput = form?.querySelector(
            '#ticket_price'
        ) as HTMLInputElement;
        const isFreeSwitch = form?.querySelector(
            '#is_free'
        ) as HTMLInputElement;

        const handleFreeEventToggle = (isChecked: boolean) => {
            setIsFreeEvent(isChecked);
            if (priceInput) {
                priceInput.value = isChecked ? '0' : '';
                priceInput.disabled = isChecked;
                if (isChecked) {
                    priceInput.classList.add(
                        'opacity-50',
                        'cursor-not-allowed'
                    );
                } else {
                    priceInput.classList.remove(
                        'opacity-50',
                        'cursor-not-allowed'
                    );
                }
            }
        };

        if (isFreeSwitch) {
            isFreeSwitch.addEventListener('change', (e) => {
                handleFreeEventToggle((e.target as HTMLInputElement).checked);
            });
        }

        // Basic form validation
        form?.addEventListener('submit', (e) => {
            const formData = new FormData(form);
            const title = formData.get('title') as string;
            const shortDesc = formData.get('short_description') as string;
            const fullDesc = formData.get('full_description') as string;

            if (!title || !shortDesc || !fullDesc) {
                e.preventDefault();
                toast.error('Please fill in all required fields');
                return;
            }
        });

        return () => {
            if (isFreeSwitch) {
                isFreeSwitch.removeEventListener('change', (e) => {
                    handleFreeEventToggle(
                        (e.target as HTMLInputElement).checked
                    );
                });
            }
        };
    }, []);

    return { isFreeEvent };
}
