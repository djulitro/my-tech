import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Backdrop, Button, Card, CircularProgress, Container, Grid, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CardProductos from './CardProductos';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { CartContext } from '../context/CartContext';
import ModalViewCart from './ModalViewCart';

export default function ItemDetailContainer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addItemToCart } = useContext(CartContext);

    const [openModal, setOpenModal] = useState(false);
    const [product, setProduct] = useState([]);
    const [cantProduct, setCantProduct] = useState(0);
    const [similarProduct, setSimilarProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        requestGetProductById(id);
    }, [id]);

    useEffect(() => {
        if (product.product_type_id) {
            requestGetProductsByCategory(product.product_type_id);
        }
        // eslint-disable-next-line
    }, [product]);

    const requestGetProductById = async (id) => {
        setIsLoading(true);
        const docRef = doc(db, "products", id);
        const response = await getDoc(docRef);

        const productResponse = { id: response.id, ...response.data() }
        setProduct(productResponse);
        setIsLoading(false);
    }

    const requestGetProductsByCategory = async (categoryId) => {
        const q = query(collection(db, "products"), where("product_type_id", "==", categoryId));
        const response = await getDocs(q);

        const productsResponse = response.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setSimilarProduct(productsResponse.filter((product) => product.id !== id));
    }

    const handleAddToCart = (product, cantProduct) => {
        setIsLoading(true);
        const objectItem = {
            ...product,
            quantity: cantProduct,
        };

        addItemToCart(objectItem);
        setIsLoading(false);
        setOpenModal(true);
    }

    const handleOpenViewCart = () => {
        setOpenModal(false);
        navigate('/cart');
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
                            <img src={product.img} alt={product.name} style={{
                                maxWidth: '345px',
                                maxHeight: '345px',
                            }} />
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={8} display={'flex'} justifyContent={'center'} >
                        <Grid container display={'flex'} justifyContent={'center'} p={5}>
                            <Grid item xs={12} md={12} display={'flex'} justifyContent={'center'} mt={5}>
                                <Typography variant={'h4'}>
                                    {product.name}
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
                                    { product.stock === 0 ? 'Sin Stock' : `Stock: ${product.stock}`}
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
                                    disabled={cantProduct === 0 || product.stock === 0}
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
                                    disabled={product.stock === 0}
                                >
                                    <AddCircleOutlineIcon />
                                </Button>
                                <Button variant="contained"
                                    onClick={() => handleAddToCart(product, cantProduct)}
                                    sx={{
                                        maxHeight: '40px',
                                        ml: 2,
                                    }}
                                    disabled={cantProduct === 0 || product.stock === 0}
                                >
                                    { product.stock === 0 ? 'Producto agotado' : 'Agregar al carrito'}
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
                                    <CardProductos img={product.img} title={product.name} description={product.description} id={product.id} price={product.price} stock={product.stock}/>
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

            <ModalViewCart
                open={openModal}
                onClose={() => setOpenModal(false)}
                onViewCart={handleOpenViewCart}
            />
        </Container>
    );
}