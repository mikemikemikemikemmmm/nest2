import { redirect } from "react-router-dom";
export const errorHandler = (error: Error | string) => {
    if (error instanceof Error) {
        console.error(error.message)
    } else {
        console.error(error)
    }
    redirect("/");
}