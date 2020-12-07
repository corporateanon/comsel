type Slice<ST, SL extends keyof ST> = ST[SL];
type Selector<ST, R = any> = (state: ST) => R;
type SelectorsMap<ST> = Record<string, Selector<ST>>;
type BoundSelectorsMap<SM extends SelectorsMap<any>, ST> = {
    [SEL in keyof SM]: Selector<ST, ReturnType<SM[SEL]>>;
};

type SelectorsSliceMap<ST> = {
    [SL in keyof Partial<ST>]: SelectorsMap<Slice<ST, SL>>;
};
type BoundSelectorsSliceMap<
    SSM extends SelectorsSliceMap<ST>,
    ST extends Record<string, any>
> = {
    [SL in keyof SSM]: SL extends keyof ST
        ? BoundSelectorsMap<SSM[SL], ST>
        : never;
};

const bindSelectorToSlice = <
    ST extends Record<string, any>,
    SL extends keyof ST,
    SEL extends Selector<Slice<ST, SL>>
>(
    slice: SL,
    selector: SEL
) => (state: ST): ReturnType<typeof selector> => selector(state[slice]);

function bindSelectorsMapToSlice<
    ST,
    SL extends keyof ST,
    SELMAP extends SelectorsMap<Slice<ST, SL>>
>(slice: SL, selectorsMap: SELMAP): BoundSelectorsMap<SELMAP, ST> {
    return Object.entries(selectorsMap).reduce(
        (boundSelectorsMap, [selectorName, selector]) => {
            boundSelectorsMap[
                selectorName as keyof SELMAP
            ] = (bindSelectorToSlice as any)(slice, selector);
            return boundSelectorsMap;
        },
        ({} as unknown) as BoundSelectorsMap<SELMAP, ST>
    );
}

export function combineSelectors<
    ST extends Record<string, any>,
    SSM extends SelectorsSliceMap<ST>
>(slicedSelectorsMap: SSM): BoundSelectorsSliceMap<SSM, ST> {
    return Object.entries(slicedSelectorsMap).reduce(
        (combinedSelectors, [sliceName, selMap]) => {
            combinedSelectors[
                sliceName as keyof ST
            ] = (bindSelectorsMapToSlice as any)(sliceName, selMap);
            return combinedSelectors;
        },
        ({} as unknown) as BoundSelectorsSliceMap<SSM, ST>
    );
}
