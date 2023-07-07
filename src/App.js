import { useEffect, useState } from 'react';
import './App.css';
import ItemListContainer from './components/ItemListContainer';
import NavBar from './components/NavBar';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ItemDetailContainer from './components/ItemDetailContainer';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase/firebaseConfig';
import { CartProvider } from './context/CartContext';
import DetailCartView from './components/DetailCartView';
import Detailbuy from './components/Detailbuy';

function App() {

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    requestGetCategories();
  }, []);

  const requestGetCategories = async () => {
    const q = query(collection(db, "categories"));
    const response = await getDocs(q);
    
    const categoriesResponse = response.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));

    setCategories(categoriesResponse);
  }

  return (
    <CartProvider>
      <Router>
        <NavBar categoriesMenu={categories}/>
        <Routes>
          <Route path="/" element={<ItemListContainer categories={categories}/>} />
          <Route path="/category/:id" element={<ItemListContainer categories={categories}/>} />
          <Route path="/item/:id" element={<ItemDetailContainer categories={categories}/>} />
          <Route path="/cart" element={<DetailCartView />} />
          <Route path='/detailbuy/:id' element={<Detailbuy />} />
          <Route path='/search/buy' element={<Detailbuy />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
