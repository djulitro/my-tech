import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Backdrop, Button, Card, CircularProgress, Container, Grid, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CardProductos from './CardProductos';

export default function ItemDetailContainer() {

    const { id } = useParams();

    const [product, setProduct] = useState([]);
    const [cantProduct, setCantProduct] = useState(0);
    const [similarProduct, setSimilarProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        requestGetProductById(id);
    }, [id]);

    useEffect(() => {
        if (product.category) {
            requestGetProductsByCategory(product.category);
        }
        // eslint-disable-next-line
    }, [product]);

    const requestGetProductById = async (id) => {
        setIsLoading(true);
        const url = `https://fakestoreapi.com/products/${id}`;
        const response = await axios.get(url);

        console.log(response);
        setProduct(response.data);
        setIsLoading(false);
    }

    
    const requestGetProductsByCategory = async (nameCategorie) => {
        const url = `https://fakestoreapi.com/products/category/${nameCategorie}`;
        const response = await axios.get(url);

        const similar = response.data.filter((el) => el.id !== product.id);

        setSimilarProduct(similar);
    }

    return (
        <Container maxWidth={'xl'}>
            <Card sx={{
                mt: 5,
            }}>
                <Grid container display={'flex'} justifyContent={'center'}>
                    <Grid item xs={12} md={4} display={'flex'} justifyContent={'start'}>
                        <Card
                            sx={{
                                m: 5,
                                maxHeight: '345px',
                            }}>
                            <img src={product.image} alt={product.title} style={{
                                maxWidth: '345px',
                                maxHeight: '345px',
                            }} />
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={8} display={'flex'} justifyContent={'center'} >
                        <Grid container display={'flex'} justifyContent={'center'} p={5}>
                            <Grid item xs={12} md={12} display={'flex'} justifyContent={'center'} mt={5}>
                                <Typography variant={'h4'}>
                                    {product.title}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={12} display={'flex'} justifyContent={'center'}>
                                <Typography variant={'body'}>
                                    {product.description}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={12} display={'flex'} justifyContent={'end'}>
                                <Typography variant={'body'}>
                                    p/u: ${product.price}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={12} display={'flex'} justifyContent={'end'}>
                                <Typography variant={'body'}>
                                    Total: ${product.price * cantProduct}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={12} display={'flex'} justifyContent={'end'} flexDirection={'row'} alignItems={'center'}>
                                <Button
                                    variant="contained"
                                    onClick={() => setCantProduct(cantProduct - 1)}
                                    disabled={cantProduct === 0}
                                    sx={{
                                        maxHeight: '40px',
                                        mr: 2,
                                    }}
                                >
                                    <RemoveCircleOutlineIcon />
                                </Button>
                                {cantProduct}
                                <Button
                                    variant="contained"
                                    onClick={() => setCantProduct(cantProduct + 1)}
                                    sx={{
                                        maxHeight: '40px',
                                        ml: 2,
                                    }}
                                >
                                    <AddCircleOutlineIcon />
                                </Button>
                                <Button variant="contained" sx={{
                                    maxHeight: '40px',
                                    ml: 2,
                                }}>
                                    Agregar al carrito
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Card>
            {
                similarProduct.length > 0 && (
                    <Grid container spacing={3} display={'flex'} justifyContent={'center'}>
                        {
                            similarProduct.map((product, index) => (
                                <Grid item xs={12} md={4} xl={3} sx={{ mt: 5}} display={'flex'} justifyContent={'center'} key={index}>
                                    <CardProductos img={product.image} title={product.title} description={product.description} id={product.id} price={product.price}/>
                                </Grid>
                            ))
                        }
                    </Grid>
                )
            }
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Container>
    );
}