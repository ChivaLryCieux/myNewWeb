import { useMemo, useState } from 'react';
import type { MouseEvent } from 'react';

const getShouldShift = (event: MouseEvent<HTMLDivElement>, reverse: boolean) => {
    const containerRect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - containerRect.left;
    const isLeftHalf = mouseX < containerRect.width / 2;

    return reverse ? isLeftHalf : !isLeftHalf;
};

export const useRegardingHover = (ids: string[]) => {
    const [shiftedMap, setShiftedMap] = useState<Record<string, boolean>>(
        Object.fromEntries(ids.map((id) => [id, false])),
    );

    const handlers = useMemo(
        () =>
            Object.fromEntries(
                ids.map((id) => [
                    id,
                    (event: MouseEvent<HTMLDivElement>, reverse = false) => {
                        const nextShifted = getShouldShift(event, reverse);

                        setShiftedMap((previous) => {
                            if (previous[id] === nextShifted) {
                                return previous;
                            }

                            return {
                                ...previous,
                                [id]: nextShifted,
                            };
                        });
                    },
                ]),
            ) as Record<string, (event: MouseEvent<HTMLDivElement>, reverse?: boolean) => void>,
        [ids],
    );

    return { shiftedMap, handlers };
};
