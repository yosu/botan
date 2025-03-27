import React from "react";
import { BookTree } from "./BookTree";

const App = (props) => {
  return (
    <div id="wrapper" className="flex min-h-[calc(100vh-34px)]">
      <div id="books" className="bg-red-100 w-56 p-2"><BookTree books={props.books} /></div>
      <div id="notes" className="bg-orange-100 w-56">2 from React</div>
      <div id="content" className="bg-yellow-50 w-full">3 from React</div>
    </div>
  )
}

export default App;
