import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Backdrop, Button, Card, CardHeader, CardMedia, CircularProgress, Container, Grid, TextField, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ConfirmDeleteItem from './ConfirmDeleteItem';
import ConfirmBuy from './ConfirmBuy';
import { CartContext } from '../context/CartContext';

import { addDoc, collection, doc, getDoc, setDoc, } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export default function DetailCartView() {
    const navigate = useNavigate();
    const { cartItems, updateCartItem, removeItemFromCart, clearCart } = useContext(CartContext);
    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [emailRepeat, setEmailRepeat] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [productToDelete, setProductToDelete] = useState({});
    const [openConfirmBuy, setOpenConfirmBuy] = useState(false);

    const [errorEmail, setErrorEmail] = useState(null);
    const [isValidEmail, setIsValidEmail] = useState(true);

    const handleRepeatEmail = (event) => {
        setEmailRepeat(event.target.value);
        if (email !== event.target.value) {
            setErrorEmail({ message: 'Los correos no coinciden' });
        } else {
            setErrorEmail(null);
        }
    }

    const handleSetEmail = (event) => {
        setEmail(event.target.value);
        if (!isValidEmailFormat(event.target.value)) {
            setIsValidEmail(false);
        } else {
            setIsValidEmail(true);
        }
    }

    const isValidEmailFormat = (email) => {
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleOpenConfirmDelete = (product) => {
        setProductToDelete(product);
        setOpenConfirmDelete(true);
    }

    const handleRemoveItemCart = () => {
        removeItemFromCart(productToDelete.id);
        setOpenConfirmDelete(false);
    }

    const handleConfirmBuy = async () => {
        setIsLoading(true);
        const data = {
            email,
            name,
            phone,
            products: cartItems,
            total: cartItems.reduce((acc, product) => acc + (product.quantity * product.price), 0),
        }

        const docRef = await addDoc(collection(db, "orders"), data);

        cartItems.forEach(product => {
            discountStock(product);
        });

        setIsLoading(false);
        clearCart();
        navigate(`/detailbuy/${docRef.id}`);
    }

    const discountStock = async (product) => {
        const productsRef = collection(db, "products");
        const docRef = doc(db, "products", product.id);
        const response = await getDoc(docRef);

        if (response.exists()) {
            const productData = response.data();
            const newStock = productData.stock - product.quantity;
            await setDoc(doc(productsRef, product.id), { stock: parseInt(newStock, 10) }, { merge: true });
        } else {
            console.log("No such document!");
        }
    }

    return (
        <Container maxWidth={'xl'}>
            <Grid container spacing={3} display={'flex'} justifyContent={'center'}>
                {
                    cartItems.length > 0 ? (
                        cartItems.map((product, index) => (
                            <Card sx={{ display: 'flex', width: '100%', mt: 5 }} key={index}>
                                <Grid container spacing={3} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                    <Grid item xs={2}>
                                        <CardMedia
                                            component="img"
                                            sx={{ width: 151 }}
                                            image={product.img}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography component="div" variant="h3">
                                            { product.name }
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4} display={'flex'} flexDirection={'row'} alignItems={'center'}>
                                        <Button
                                            variant="contained"
                                            onClick={() => updateCartItem(product.id, product.quantity - 1)}
                                            disabled={product.quantity === 0}
                                            sx={{
                                                maxHeight: '40px',
                                                mr: 2,
                                            }}
                                        >
                                            <RemoveCircleOutlineIcon />
                                        </Button>
                                        <Typography component="div" variant="h5">
                                            { product.quantity }
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            onClick={() => updateCartItem(product.id, product.quantity + 1)}
                                            sx={{
                                                maxHeight: '40px',
                                                ml: 2,
                                            }}
                                        >
                                            <AddCircleOutlineIcon />
                                        </Button>
                                        
                                        <Typography component="div" variant="h5" marginLeft={5}>
                                            Total: ${ product.quantity * product.price }
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3} justifyContent={'end'}>
                                        <Button variant="contained"
                                            onClick={() => handleOpenConfirmDelete(product)}
                                        >
                                            Eliminar
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Card>
                        ))
                    ) : (
                        <Grid item xs={12} md={12} display={'flex'} justifyContent={'center'}>
                            <Typography variant={'h3'}>
                                No hay productos en el carrito
                            </Typography>
                        </Grid>
                    )

                }
                {
                    cartItems.length > 0 && (
                        <>
                            <Grid item xs={12} md={12} display={'flex'} justifyContent={'end'}>
                                <Typography variant={'h3'}>
                                    Total compra: ${ cartItems.reduce((acc, product) => acc + (product.quantity * product.price), 0) }
                                </Typography>
                            </Grid>
                            <Card sx={{ width: '100%', mt: 5 }}>
                                <CardHeader title={'Finalizar compra'} />
                                <Grid container spacing={3} display={'flex'} justifyContent={'center'} alignItems={'center'} p={3}>
                                    <Grid item xs={12} md={6}>
                                        <TextField 
                                            placeholder='Ingrese su correo'
                                            fullWidth
                                            type='email'
                                            value={email}
                                            onChange={(e) => handleSetEmail(e)}
                                            error={!isValidEmail}
                                            helperText={!isValidEmail ? 'Ingrese un correo valido' : ''}
                                            sx={{
                                                mt: 2,
                                            }}
                                        />
                                        <TextField 
                                            placeholder='Repita su correo' 
                                            fullWidth 
                                            value={emailRepeat}
                                            onChange={(e) => handleRepeatEmail(e)}
                                            disabled={email === ''}
                                            error={errorEmail !== null}
                                            helperText={errorEmail !== null ? errorEmail.message : ''}
                                            sx={{
                                                mt: 2,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField 
                                            placeholder='Ingrese su nombre completo' 
                                            fullWidth
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            sx={{
                                                mt: 2,
                                            }}
                                        />
                                        <TextField 
                                            placeholder='Ingrese su telefono' 
                                            fullWidth
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            sx={{
                                                mt: 2,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} display={'flex'} justifyContent={'end'}>
                                        <Button variant="contained"
                                            disabled={!isValidEmail || email !== emailRepeat || name === ''}
                                            onClick={() => setOpenConfirmBuy(true)}
                                        >
                                            Finalizar compra
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Card>
                        </>
                    )
                }
            </Grid>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <ConfirmDeleteItem
                open={openConfirmDelete}
                onClose={() => setOpenConfirmDelete(false)}
                onRemoveItemCart={handleRemoveItemCart}
                product={productToDelete}
            />
            <ConfirmBuy
                open={openConfirmBuy}
                onClose={() => setOpenConfirmBuy(false)}
                onConfirmBuy={handleConfirmBuy}
            />
        </Container>
    );
}