export const mockApi = (props: {
    apiName: string,
    result?: unknown[],
    error?: string
}) => {
    return () => {
        return {
            [props.apiName]: () => [
                {
                    data: { result: props.result }
                }, props.error
            ]
        }
    }
}