import { Modal, Box, Stack } from "@mui/material";
import { ReactNode } from "react";
import { Theme } from '@mui/material/styles/createTheme'
import { SxProps } from '@mui/system/styleFunctionSx/styleFunctionSx'
export const ModalContainer = (props: { isOpen: boolean, closeFn: () => void, children: ReactNode, id?: string, sx?: SxProps<Theme> }) => {
    const { isOpen, closeFn, children, sx, id } = props
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxHeight: '80%',
        maxWidth: '80%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };
    let _style: SxProps<Theme> = { ...style }
    if (sx) {
        _style = { ..._style, ...sx }
    }
    return (
        <Modal
            open={isOpen}
            onClose={closeFn}
            id={id || 'modal'}
        >
            <Box sx={_style}>
                {children}
            </Box>
        </Modal>
    );
}