import React from 'react';
import ProtectedRoute from './src/navigation/ProtectedRoute';
import {Provider} from 'react-redux';
import store from './src/redux/store';

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <ProtectedRoute />
    </Provider>
  );
}

export default App;
