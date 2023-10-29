import React from 'react'
import {Router, Scene} from 'react-native-router-flux'
import Welcome from './Welcome'
import Setting from './Setting'

const Routes = () => (
    <Router>
        <Scene key = "root">
            <Scene key = "welcome" component= { Welcome } title = "Welcome" initial = {true} />
            <Scene key = "settings" component = {Setting} title = "Setting" />
        </Scene>
    </Router>
)

export default Routes
