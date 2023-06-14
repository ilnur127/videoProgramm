import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import { store } from './redux/app/store'

import App from './pages/main'

import MainLayout from './components/layouts/MainLayout'

import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <MainLayout>
        <App />
      </MainLayout>
    </Provider>
  </React.StrictMode>
)
