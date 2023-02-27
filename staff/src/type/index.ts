export type SinglePartial<targetType, partialProp extends keyof targetType> =
    Partial<Pick<targetType, partialProp>> & Omit<targetType, partialProp>