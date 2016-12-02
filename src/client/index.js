/* eslint-env browser */

// Kyt expects every app to have this entry point.
// You probably won't need to touch this file.

import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './../components/App'

const root = document.querySelector('#root')

const mount = RootComponent => render(
  <AppContainer>
    <RootComponent />
  </AppContainer>,
  root
)

if (module.hot) {
  module.hot.accept('./../components/App', () => {
    System.import('./../components/App').then(RootComponent => mount(RootComponent.default))
  })
}

mount(App)
