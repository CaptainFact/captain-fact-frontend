import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'

// Inject React app in DOM
const container = document.getElementById('app')
const root = createRoot(container) // createRoot(container!) if you use TypeScript
root.render(<App />)
