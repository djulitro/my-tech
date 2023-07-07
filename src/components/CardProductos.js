import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Grid } from '@mui/material';

export default function CardProductos({ img, title, id, price, stock }) {
  const navigate = useNavigate();

  return (
    <Card sx={{ maxWidth: 345, minWidth: 345 }}
      onClick={() => navigate(`/item/${id}`)}
    >
      <CardActionArea
      >
        <CardMedia
          component="img"
          height="345"
          image={img}
          alt={title}
        />
        <CardContent>
          <Grid container justifyContent="flex-end">
            <Grid item xs={12} md={12} minHeight={50}>
              <Typography gutterBottom variant="h5" component="div">
                {title}
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} display={'flex'} justifyContent={'end'} alignItems={'end'}>
              <Typography variant="body2" color="text.secondary">
                $ {price}
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} display={'flex'} justifyContent={'end'} alignItems={'end'}>
              <Typography variant="body2" color="text.secondary">
                {stock === 0 ? 'Sin stock' : `Stock: ${stock}`}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}