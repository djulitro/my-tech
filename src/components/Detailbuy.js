import { useEffect, useState } from 'react';
import { Backdrop, Button, Card, CardHeader, CircularProgress, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, } from '@mui/material';
import { useParams } from 'react-router-dom';
import { doc, getDoc, } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export default function Detailbuy() {
    const { id } = useParams();

    const [order, setOrder] = useState({});
    const [orderId, setOrderId] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const getOrder = async (idOrder) => {
        setIsLoading(true);
        const docRef = doc(db, "orders", idOrder);
        const response = await getDoc(docRef);

        const orderResponse = { id: response.id, ...response.data() };
        setOrder(orderResponse);
        setIsLoading(false);
    }

    useEffect(() => {
        if(id) {
            getOrder(id);
        }
    }, [id]);

    const handleFilter = () => {
        getOrder(orderId);
    };

    return (
        <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={12} display={'flex'} justifyContent={'center'} sx={{
                mt: 5
            }}>
                <TextField
                    id="outlined-read-only-input"
                    label="Buscar compra por id"
                    onChange={(e) => setOrderId(e.target.value)}
                    value={orderId}
                />
                <Button 
                    variant="contained"
                    sx={{
                        ml: 2
                    }}
                    onClick={() => handleFilter()}
                >
                    Buscar
                </Button>
            </Grid>
            {
                order?.id ? (
                    <Card sx={{ minWidth: 275, mt: 5 }}>
                        <CardHeader title={`Detalle de compra: ${order?.id}`} />
                        <Grid item xs={12}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Producto</TableCell>
                                            <TableCell align="right">Cantidad</TableCell>
                                            <TableCell align="right">Valor unitario</TableCell>
                                            <TableCell align="right">Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            order?.products?.map((product) => (
                                                <TableRow
                                                    key={product.id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {product.name}
                                                    </TableCell>
                                                    <TableCell align="right">{product.quantity}</TableCell>
                                                    <TableCell align="right">${product.price}</TableCell>
                                                    <TableCell align="right">${product.quantity * product.price}</TableCell>
                                                </TableRow>
                                            ))
                                        }
                                        <TableRow>
                                            <TableCell rowSpan={3} />
                                            <TableCell colSpan={2}>Total: </TableCell>
                                            <TableCell align="right">${order?.total}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Card>
                ) : (
                    <Grid item xs={12} display={'flex'} justifyContent={'center'} sx={{ mt: 5 }}>
                        <Typography variant={'h4'}>
                            No se encontró la compra
                        </Typography>
                    </Grid>
                )
            }
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Grid>
    );
};