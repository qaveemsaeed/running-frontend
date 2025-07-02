import React, { createContext, useContext, useReducer } from 'react';

const CheckoutContext = createContext();

const checkoutReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ADDRESS':
      return {
        ...state,
        address: action.payload,
      };
    
   
   
    default:
      return state;
  }
};

export const CheckoutProvider = ({ children }) => {
  const [state, dispatch] = useReducer(checkoutReducer, {
    address: null,
    paymentMethod: null,
  });

  const setAddress = (address) => {
    dispatch({ type: 'SET_ADDRESS', payload: address });
  };

  const setPaymentMethod = (method) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method });
  };

  const resetCheckout = () => {
    dispatch({ type: 'RESET_CHECKOUT' });
  };

  return (
    <CheckoutContext.Provider
      value={{
        ...state,
        setAddress,
        setPaymentMethod,
        resetCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}; 