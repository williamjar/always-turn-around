import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

import {RouterProvider} from 'react-router-dom'
import router from "./router";

library.add(fas)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <RouterProvider router={router}/>
);
