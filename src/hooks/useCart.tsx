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
    const storagedCart = localStorage.getItem('@RocketShoes:cart'); //Retorna o valor do localStorage, caso não encontre retorna null.

    if (storagedCart) {
      return JSON.parse(storagedCart);
    } // Se o localStorage não estiver vazio, retorna o valor do localStorage.

    return []; //Se o localStorage estiver vazio, retorna um array vazio.
  });

  const addProduct = async (productId: number) => {
    try {
      const updateCart = [...cart]; //Cria uma cópia do array cart, preservando a imutabilidade.

      const productExist = cart.find(product => product.id === productId); //Verifica se o produto já existe no carrinho.

      const stock = await api.get<Stock>(`/stock/${productId}`); //Verificar a quantidade disponivel em estoque do produto.

      const stockAmount = stock.data.amount; //Amazena a quantidade que está disponivel do produto.

      const currentAmount = productExist ? productExist.amount : 0; //Se o produto já existir, a quantidade atual é a quantidade que já está no carrinho, se não existir a quantidade é 0.

      const amount = currentAmount + 1; //A quantidade atual é a quantidade atual mais 1.

      if (currentAmount > stockAmount) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
        //Se a quantidade atual é maior que a quantidade disponivel, retorna um toast informando que a quantidade solicitada é maior que a disponivel.
      }

      if (productExist) {
        productExist.amount = amount; //Se o produto já existir, a quantidade atual é a quantidade que já está no carrinho mais 1.
        setCart(updateCart); //Atualiza o carrinho com a nova quantidade.
      }else{
        const product = await api.get<Product>(`/products/${productId}`); //Se o produto não existir, busca o produto no banco de dados referente ao id.

        const newProduct = {
          ...product.data,
          amount: 1,
        } //Cria um novo objeto do produto que será adcionado ao carrinho, carregando todas as informações da requisição na variavel product e adicionando a propriedade amount com o valor 1.

        updateCart.push(newProduct); //Adiciona o produto no array updateCart.

        setCart(updateCart); //Atualiza o array cart com o novo produto.
      }

    } catch {
      toast.error('Erro na adição do produto'); //Se der erro na adição do produto, retorna um toast informando que ocorreu um erro.
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
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
