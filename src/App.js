import React from 'react';
import './App.css';


import Nav from './components/nav';
import Home from './pages/home'
import AddPicture from './pages/addpicture'
import CertainPicture from './pages/certainpicture'
import Collections from './pages/collections'
import Stats from './pages/stats'
import Edit from './pages/edit'

import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { Redirect } from 'react-router';

function App() {


    return (

<Router>
<div>
        <Nav />
        <Switch>
          <Route path="/" exact render={(props) => <Home searchingtype = "name" tagbool = {false}/> } />
          <Route path="/home/tag/:TagName" exact render={(props) => <Home searchingtype = "tags" tagbool = {true} colbool = {false} search = {props.match.params.TagName}/> } />

          <Route path="/home/collection/:TagName" exact render={(props) => <Home searchingtype = "collection" tagbool = {false} colbool = {true} search = {props.match.params.TagName}/> } />

        <Route path="/home">
        <Redirect to="/" />
        </Route>

        <Route path="/edit/:PictureID" exact component={Edit} />

          <Route path="/addpicture" exact component={AddPicture} />
          <Route path="/collections" exact component={Collections} />
          <Route path="/stats" exact component={Stats} />
          <Route path="/:PictureID" exact component={CertainPicture} />

        </Switch>

  </div>
</Router>
    );

  }

export default App;
