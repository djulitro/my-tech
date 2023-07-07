import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ConfirmBuy({ open, onClose, onConfirmBuy }) {

    const handleClose = () => {
        onClose();
    };

    const handleConfirmBuy = () => {
        onClose();
        onConfirmBuy();
    }

    return (
        <Dialog
            open={open}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{"Confirmar compra"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    ¿Seguro que desea confirmar su compra?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>cancelar</Button>
                <Button onClick={handleConfirmBuy}>Confirmar</Button>
            </DialogActions>
        </Dialog>
    );
}