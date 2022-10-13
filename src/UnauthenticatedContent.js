import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { SingleCard } from './layouts';
import { LoginForm } from './components';

export default function () {
  return (
    <Switch>
      <Route exact path='/login' >
        <SingleCard title="Sign In">
          <LoginForm />
        </SingleCard>
      </Route>
      <Redirect to={'/login'} />
    </Switch>
  );
}
