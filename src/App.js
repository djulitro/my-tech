import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import ItemListContainer from './components/ItemListContainer';
import NavBar from './components/NavBar';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ItemDetailContainer from './components/ItemDetailContainer';

function App() {

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    requestGetCategories();
  }, []);

  const requestGetCategories = async () => {
    const url = 'https://fakestoreapi.com/products/categories';
    const response = await axios.get(url);

    setCategories(response.data.map((category, index) => ({ id: index+1, name: category })));
  }

  return (
    <Router>
      <NavBar categoriesMenu={categories}/>
      <Routes>
        <Route path="/" element={<ItemListContainer categories={categories}/>} />
        <Route path="/category/:id" element={<ItemListContainer categories={categories}/>} />
        <Route path="/item/:id" element={<ItemDetailContainer categories={categories}/>} />
      </Routes>
    </Router>
  );
}

export default App;
