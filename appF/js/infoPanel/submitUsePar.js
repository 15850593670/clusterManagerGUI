'use strict'

import React from 'react'

export default class submitUsePar extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            filename: '',
            par: '',
            topath: ''
        }
    }
    cancelClick(e) {
        $('#submitUsePar-modal').modal('hide')

    }
    subfile(e) {

    }

    handleParChange(e) {
        this.setState({ par: e.target.value })
    }

    render() {
        return (
            <div className="modal fade" id='submitUsePar-modal' tabIndex='-1' >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button className="close" onClick={this.cancelClick.bind(this)}>&times;</button>
                            <h4>submit job</h4>
                        </div>
                        <div className="modal-body">

                            <label className="btn btn-primary" htmlFor="my-file-selector">
                                <input id="my-file-selector" type="file" style={{ display: "none" }} onClick={this.fileChoose.bind(this)} />
                                browser file
                            </label>
                            <span className='label label-info' id="upload-file-info"></span>
                            <div className='form-group'>
                                <label htmlFor='username'>To path</label>
                                <input type="text" className='form-control' id='username' placeholder="deafault:~/" onChange={this.handlePathChange.bind(this)}></input>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-default" onClick={this.cancelClick.bind(this)}>cancel</button>
                            <button className="btn btn-primary" onClick={this.subfile.bind(this)}>upload</button>
                        </div>
                    </div>
                </div>
            </div >

        )
    }
}