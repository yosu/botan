import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App";

const Router = (props) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="app">
          <Route index element={<App props={props} />} />
          <Route path=":bookId" element={<App props={props} />} />
          <Route path=":bookId/:noteId" element={<App props={props} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router;
