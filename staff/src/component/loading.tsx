
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setIsLoading } from '../../src/store'
export const LoadingContainer = () => {
    const isLoading = useSelector((state: RootState) => state.appSlice.isLoading)
    return <Backdrop
        sx={{ bgcolor: 'transparent', color: 'black', zIndex: 9999 }}
        open={isLoading}
    >
        <CircularProgress color="inherit" />
    </Backdrop>
}