'use strict'

import React from 'react'

import Conf from '../common/conf'
import './less/recentjob.less'

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

    deletefile(i){
        this.state.filelist.splice(i, 1)
        this.setState({filelist: this.state.filelist})
        Conf.saveJobs(this.state.filelist)
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
                <tr key={i} className='tdbutton'>{oneF}
                    <td>
                        <button type="button" className="btn btn-default btn-xs btnds" aria-label="Left Align" onClick={function(){that.deletefile.bind(that)(i)}}>
                            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                        </button>
                    </td>
                </tr>
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