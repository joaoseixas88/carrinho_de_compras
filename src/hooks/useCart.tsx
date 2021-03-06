import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {

    const storagedCart = localStorage.getItem('@RocketShoes:cart')

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });
  

  const addProduct = async (productId: number) => {
    try {
      
      const newCart = [...cart]
      const productExists = newCart.find(product => product.id === productId)      
      const cartAmount = productExists ? productExists.amount : 0
      const productStock = await api.get(`/stock/${productId}`)
      
      

      const stockAmount = productStock.data.amount
      
      if (cartAmount >= stockAmount){
        toast.error('Quantidade solicitada fora de estoque')
        return;
      } 

      if(productExists){
        productExists.amount= productExists.amount + 1
      } else{
        const product = await api.get(`/products/${productId}`)
        newCart.push({...product.data, amount: 1})
      }
      setCart(newCart)
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))
        
    } catch {
      toast.error('Erro na adição do produto')
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const newCart = cart.filter(product => product.id !== productId)
      setCart(newCart)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))

    } catch {
      toast.error('Erro na remoção do produto')
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      
      const productStock = await api.get<Stock>(`stock/${productId}`)
      const currentAmount = productStock.data.amount
      
      if(amount > currentAmount){
        toast.error('Quantidade solicitada fora de estoque')
        return;
      } else {
        const newCart = cart.map(product =>{
          if(productId === product.id){
            return ({
              id: product.id,
              title: product.title,
              price: product.price,
              image: product.image,
              amount: amount
              }
            )
          } else return (product)
        })
        setCart(newCart)
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))
      }
      
        


    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
