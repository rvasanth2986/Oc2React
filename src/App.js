import 'devextreme/dist/css/dx.common.css';
import './themes/generated/theme.base.css';
import './themes/generated/theme.additional.css';
// import 'bootstrap/dist/js/bootstrap.bundle'
import React from 'react';
import { BrowserRouter as Router, withRouter } from 'react-router-dom';
import './dx-styles.scss';
import LoadPanel from 'devextreme-react/load-panel';
import { NavigationProvider } from './contexts/navigation';
import { AuthProvider, useAuth } from './contexts/auth';
import { useScreenSizeClass } from './utils/media-query';
import Content from './Content';
import { useDispatch } from 'react-redux';
 import UnauthenticatedContent from './UnauthenticatedContent';
 import routes from './app-routes';
 import { Switch, Route, Redirect } from 'react-router-dom';

function NavApp() {
 
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadPanel visible={true} />;
  }

  let routesNav = {

  }

  if (user) {
    return <Content />;
  }

   return <UnauthenticatedContent />;


}


 function App() {
  const screenSizeClass = useScreenSizeClass();

  return (
       <AuthProvider>
        <NavigationProvider>
          <div className={`app ${screenSizeClass}`}>
            <NavApp />
          </div>
        </NavigationProvider>
        </AuthProvider>
  );
};

export default withRouter(App);

// function App(props) {

//   const { user, loading } = useAuth();

//   if (loading) {
//     return <LoadPanel visible={true} />;
//   }



//       let routesNav = ( 
//         <Switch>
//              routes.map(({ path, component }) => (
//           <Route
//             exact
//             key={path}
//             path={path}
//             component={component}
//           />
//         ))
//         <Redirect to={'/home'} />
//       </Switch>
//       );

//     if (props.isAuthenticated) {
//         routesNav = (
//             <Switch>
//                 <Route  path='/Probes' component={probes} />
//                 <Route  path='/test' component={pathtest} />
//                 <Route  path='/pathview' component={pathview} />
//                 <Route path='/' component={Dashboard} exact />
//                 <Route path="*" component={Page404} />
//                 <Redirect to='/' />
//             </Switch>
//         );
//     }

//     return (
//         <Container fluid>
//             <Header/>
//             <div className="col-12 wrapper flex-column">
//                 <SideNav /> 
//                 {/* <Suspense fallback={<div>Loading...</div>}> */}
//                         {routes}
//                 {/* </Suspense> */}
                
                
//            </div> 
//         </Container>
//     );
//   //}
//  }
//  const mapStateToProps = (state) => {
//   return {
//       isAuthenticated: isAuthenticated(state),
//   };
// };

// export default withRouter((App));