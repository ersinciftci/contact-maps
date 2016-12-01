import React from 'react';
import {render} from 'react-dom';
import {Router, Route, useRouterHistory} from 'react-router';
import {createHistory} from 'history';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Main from './Main'; // Our custom react component

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const history = useRouterHistory(createHistory)({
    basename: '/contact-maps'
})

// Render the main app react component into the app div.
// For more details see: https://facebook.github.io/react/docs/top-level-api.html#react.render
render((
        <Router history={history}>
            <Route path="/" component={Main}>
                <Route path="/:pfamId" component={Main}/>
            </Route>
        </Router>
    ),
    document.getElementById('app'));
