export const isNumInt = (...num: unknown[]) => num.every(n =>
    typeof n === 'number' && Number.isInteger(n) && n >= 0
)
