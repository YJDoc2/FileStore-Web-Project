import { createContext } from 'react';

const GlobalContext = createContext();
const { Provider, Consumer } = GlobalContext;

export { GlobalContext, Provider, Consumer };
