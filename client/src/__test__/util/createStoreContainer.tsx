import { Provider } from "react-redux"
import { store } from "../../store"
export const createStoreContainer = (children: JSX.Element) => {
    return (<Provider store={store} >{children}</Provider>)
}