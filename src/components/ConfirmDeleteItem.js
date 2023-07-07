import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ConfirmDeleteItem({ open, onClose, onRemoveItemCart, product }) {

    const handleClose = () => {
        onClose();
    };

    const handleRemoveItemCart = () => {
        onClose();
        onRemoveItemCart();
    }

    return (
        <Dialog
            open={open}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{"Quitar producto del carrito"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    ¿Desea quitar el producto {product?.name} del carrito?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>cancelar</Button>
                <Button onClick={handleRemoveItemCart}>Quitar del carrito</Button>
            </DialogActions>
        </Dialog>
    );
}