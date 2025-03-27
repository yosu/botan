import React from "react";

const App = () => {
  return (
    <div id="wrapper" class="flex h-[calc(100vh-34px)]">
      <div id="books" class="bg-red-100 w-56">1 from React</div>
      <div id="notes" class="bg-orange-100 w-56">2 from React</div>
      <div id="content" class="bg-yellow-50 w-full">3 from React</div>
    </div>
  )
}

export default App;
