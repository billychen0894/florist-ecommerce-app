import store from '@store';
import { Provider } from 'react-redux';

// This is a wrapper component for the Redux Provider on client side Components Only
const Providers = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default Providers;
