import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ModalViewCart({ open, onClose, onViewCart }) {

    const handleClose = () => {
        onClose();
    };

    const handleViewCart = () => {
        onClose();
        onViewCart();
    }

    return (
        <Dialog
            open={open}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{"Producto agregado correctamente"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Desea seguir comprando o ir al carrito?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Seguir comprando</Button>
                <Button onClick={handleViewCart}>Ir al carrito</Button>
            </DialogActions>
        </Dialog>
    );
}