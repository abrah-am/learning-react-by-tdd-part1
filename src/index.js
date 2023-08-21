import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from './store';

import { App } from './App';

ReactDOM
    .createRoot(document.getElementById("root"))
    .render(
        <Provider store={configureStore} >
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    );