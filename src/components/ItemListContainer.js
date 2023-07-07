import { useEffect, useState } from 'react';
import { Backdrop, CircularProgress, Grid } from '@mui/material';
import CardProductos from './CardProductos';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

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
    const q = query(collection(db, "products"));
    const response = await getDocs(q);

    const productsResponse = response.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    setProducts(productsResponse);
    setIsLoading(false);
  }

  const requestGetProductsByCategory = async (idCategorie) => {
    setIsLoading(true);
    setProducts([]);

    const q = query(collection(db, "products"), where("product_type_id", "==", idCategorie));
    const response = await getDocs(q);

    const responseProducts = response.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    setProducts(responseProducts);
    setIsLoading(false);
  }

  return (
    <Grid container spacing={3}>
      {
        products.map((product, index) => (
          <Grid item xs={12} md={4} xl={3} sx={{ mt: 5}} display={'flex'} justifyContent={'center'} key={index}>
            <CardProductos img={product.img} title={product.name} description={product.description} id={product.id} price={product.price} stock={product.stock}/>
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