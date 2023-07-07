import React, { useContext } from 'react';
import { Badge, IconButton } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartWidget() {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  
  return (
    <IconButton color="inherit" onClick={() => navigate('/cart')}>
      <Badge badgeContent={cartItems.length} color="error">
        <ShoppingCart />
      </Badge>
    </IconButton>
  );
};