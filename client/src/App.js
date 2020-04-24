import React from 'react';
import './App.css';
import HomePage from "./components/home-page/home-page";
import {HashRouter} from "react-router-dom";
import { Route, Switch, Redirect } from 'react-router-dom'
import MyAppBar from "./components/app-bar/app-bar";

function App() {
  return (
      <HashRouter>
          <main>
              <div className={"container"}>
                  <MyAppBar />
                  <Switch>
                      <Route path="/" component={HomePage}/>
                      <Redirect from="*" to="/"/>
                  </Switch>
              </div>
          </main>
      </HashRouter>
  );
}

export default App;
