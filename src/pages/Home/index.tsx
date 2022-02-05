import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';
import { title } from 'process';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<Product[]>([]);
  // const { addProduct, cart } = useCart();

  // const cartItemsAmount = cart.reduce((sumAmount, product) => {
  //   // TODO
  // }, {} as CartItemsAmount)

  useEffect(() => {
     async function loadProducts() {
      // TODO
      await api.get('http://localhost:3333/products')
      .then(res => {
        const listProduct = res.data.map((product: ProductFormatted) => {          
            return(
              {
              id: product.id,
              title: product.title,
              price: product.price,
              image: product.image,
              priceFormatted: formatPrice(product.id)
              })           
        })
        setProducts(listProduct)
      })
      }
    loadProducts()
  },[]);


  function handleAddProduct(id: number) {
    // TODO
  }

  return (
    <ProductList>

      {products.map((product) => {
        <li>
          <img src={product.image} alt="" />
          <strong>{product.title}</strong> 
          <span>{product.price}</span>
        </li>
      })}
      <li>        
        <img src="https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg" alt="Tênis de Caminhada Leve Confortável" />
        <strong>Tênis de Caminhada Leve Confortável</strong>
        <span>R$ 179,90</span>
        <button
          type="button"
          data-testid="add-product-button"
          onClick={() => console.log(products)}
        // onClick={() => handleAddProduct(product.id)}
        >
          <div data-testid="cart-product-quantity">
            <MdAddShoppingCart size={16} color="#FFF" />
            {/* {cartItemsAmount[product.id] || 0} */} 2
          </div>

          <span>ADICIONAR AO CARRINHO</span>
        </button>
      </li>
    </ProductList>
  );
};

export default Home;
