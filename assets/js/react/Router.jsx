import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App";
import store from "./store"
import { Provider } from "react-redux"

const Router = (props) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="app">
            <Route index element={<App props={props} />} />
            <Route path=":bookId" element={<App props={props} />} />
            <Route path=":bookId/:noteId" element={<App props={props} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default Router;
