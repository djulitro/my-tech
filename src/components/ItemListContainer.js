import * as React from 'react';
import { Grid } from '@mui/material';
import CardProductos from './CardProductos';
import { listProducts } from '../constantes/const';

export default function ItemListContainer() {
  return (
    <Grid container spacing={3}>
        {
            listProducts.map((product, index) => (
                <Grid item xs={12} md={4} xl={3} sx={{ mt: 5}} display={'flex'} justifyContent={'center'}>
                    <CardProductos img={product.img} title={product.title} description={product.description}/>
                </Grid>
            ))
        }
    </Grid>
  );
}