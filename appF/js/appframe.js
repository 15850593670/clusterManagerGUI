'use strict'

import React from "react"

import InfoPanel from './infoPanel/infoPanel'
import ManagerMenu from './managerMenu/managerMenu'

//import './less/appframe.less'
import './less/frame.css'

export default class Appframe extends React.Component {
    /*<div className='Appframe'>
                <ManagerMenu />
                <InfoPanel />
            </div>*/
    render() {
        return (

            <div className="container-fluid" >
                <div className="row">
                    <ManagerMenu />
                    <InfoPanel />
                </div>
            </div>
        )
    }
}