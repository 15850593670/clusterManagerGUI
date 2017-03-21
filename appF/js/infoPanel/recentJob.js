'use strict'

import React from 'react'

import Conf from '../common/conf'

export default class recentJob extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            filelist: []
        }
        
    }
    componentDidMount(){
        var files = Conf.readJobs()
        console.log(files)
        if(files){
            this.setState({filelist : files})
        }
    }

    editfile(f){
        console.log(f)
        this.props.openfile(f)
    }

    render() {
        var that = this
        var filess = this.state.filelist.map((f, i) => {
            let oneF = f.map((attr, j) => {
                // if (attr.trim().length > 10) {
                //     return (
                //         <td key={j}>{attr.trim().substring(0, 10)}</td>
                //     )
                // }
                return (
                    <td key={j}  onClick={function(){that.editfile.bind(that)(f)}}>{attr.trim()}</td>
                )
            })
            return (
                <tr key={i} >{oneF}</tr>
            )
        })
        return(
            <div className="table-responsive">
                <table className="table table-striped">
                    <tbody>
                        {filess}
                    </tbody>
                </table>
            </div>
        )
    }
}