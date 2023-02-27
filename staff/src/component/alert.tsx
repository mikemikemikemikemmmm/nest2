
import Alert from "@mui/material/Alert";
import { useSelector } from "react-redux";
import { RootState } from '../../src/store'
export const AlertContainer = () => {
    const alertList = useSelector((state: RootState) => state.appSlice.alertList)
    return <div
        style={{
            position: 'absolute',
            right: 20,
            bottom: 20,
            zIndex: 9999
        }}
    >
        {
            alertList.map((alert) => {
                return (
                    <Alert
                        key={alert.id}
                        sx={{ margin: 1, fontSize: 20 }}
                        severity={alert.severity}
                    >
                        {alert.text}
                    </Alert>
                )
            })
        }
    </div>
}