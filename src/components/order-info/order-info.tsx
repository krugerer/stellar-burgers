import { FC, useEffect, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { fetchUserOrders } from '../../services/userSlice';
import { fetchFeed } from '../../services/feedSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const { ingredients } = useSelector((state) => state.ingredients);

  const location = useLocation();
  const dispatch = useDispatch();

  const feedOrders = useSelector((state) => state.feed.orders);
  const userOrders = useSelector((state) => state.user.orders || []);

  const orderData = useMemo(() => {
    if (!number) return null;
    const orderNumber = Number(number);

    return (
      feedOrders.find((item) => item.number === orderNumber) ||
      userOrders.find((item) => item.number === orderNumber) ||
      null
    );
  }, [number, userOrders, feedOrders]);

  useEffect(() => {
    if (!orderData) {
      if (location.pathname.includes('/profile')) {
        dispatch(fetchUserOrders());
      } else {
        dispatch(fetchFeed);
      }
    }
  });

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
