import { useEffect, useState } from 'react';
import axios from 'axios';
import { Backdrop, CircularProgress, Grid } from '@mui/material';
import CardProductos from './CardProductos';
import { useParams } from 'react-router-dom';

export default function ItemListContainer({ categories }) {

  const { id = null } = useParams();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    requestGetProducts();
    if(id) {
      requestGetProductsByCategory(id);
    }
  }, [id]);

  const requestGetProducts = async () => {
    setIsLoading(true);
    const url = 'https://fakestoreapi.com/products';
    const response = await axios.get(url);

    setProducts(response.data);
    setIsLoading(false);
  }

  const requestGetProductsByCategory = async (idCategorie) => {
    setIsLoading(true);
    setProducts([]);
    const category = categories.find((category) => category.id === parseInt(idCategorie, 10));

    const url = `https://fakestoreapi.com/products/category/${category.name}`;
    const response = await axios.get(url);

    console.log(response);
    setProducts(response.data);
    setIsLoading(false);
  }

  return (
    <Grid container spacing={3}>
      {
        products.map((product, index) => (
          <Grid item xs={12} md={4} xl={3} sx={{ mt: 5}} display={'flex'} justifyContent={'center'} key={index}>
            <CardProductos img={product.image} title={product.title} description={product.description} id={product.id} price={product.price}/>
          </Grid>
        ))
      }
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Grid>
  );
}