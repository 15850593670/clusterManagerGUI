'use strict'

import React from 'react'
import CodeMirror from 'codemirror'
var fs = require('fs')
import '../../../node_modules/codemirror/lib/codemirror.css'
import './less/code.less'
var { dialog } = require('electron').remote
import Conf from '../common/conf'


export default class codePanel extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            filename: 'new file',
            fullname: null,
            CodeMirror: null,
            code: '',
            fresh: 0
        }
    }

    componentDidMount() {
        // $('#codearea1')
        var myTextarea = document.getElementById('codearea1')
        this.codemirror = CodeMirror.fromTextArea(myTextarea, {
            lineNumbers: true,
            readOnly: false,
            mode: 'host'
        })
        this.codemirror.setSize('100%', '100%')

        if (this.props.file != null) {
            this.state.filename = this.props.file[0]
            this.state.fullname = this.props.file[1]
            if (fs.existsSync(this.props.file[1])) {
                var text = fs.readFileSync(this.props.file[1], 'utf8')
                this.state.code = text
                console.log(text)
            } else {
                console.log('file ' + this.props.file[1] + ' not exists!')
            }
            console.log('open file')
            this.codemirror.getDoc().setValue(this.state.code)
            this.setState({ fresh: this.state.fresh + 1 })
        }
    }

    exitCodeEdit() {
        em.emit('exitCodeEdit')
    }

    subJob(f) {
        this.props.subjob(f)
    }

    savefile() {
        var text = this.codemirror.getDoc().getValue()

        if (this.state.fullname == null && text != '') {
            const mp = dialog.showSaveDialog()
            if (mp) {
                // console.log(mp)
                // this.setState({ filename: mp.substring(mp.lastIndexOf('/') + 1)})
                this.state.fullname = mp
                this.state.filename = mp.substring(mp.lastIndexOf('/') + 1)
                this.setState({ fresh: this.state.fresh + 1 })
                // console.log(this.state.filename + ' ' + this.state.fullname)
            }
        }
        // var text = $("#codearea1").val document.getElementById("codearea1").innerText

        if (this.state.code != text) {
            // console.log(text)
            this.state.code = text
            fs.writeFile(this.state.fullname, text, function (err) {
                if (err) {
                    return console.log(err)
                }

                console.log("The file was saved!")
            })
            this.saveIntoRecent()
        }
    }

    saveIntoRecent() {
        var fileList = Conf.readJobs()
        var thisfile = [[this.state.filename, this.state.fullname, new Date().toDateString()]]
        var conc = thisfile
        console.log(fileList)
        for (var i = 0; i < fileList.length; i++) {
            console.log(thisfile[0][1] + ' f ' + fileList[i][1] + '  ' + i)
            if (thisfile[0][0] == fileList[i][0] && thisfile[0][1] == fileList[i][1]) {
                fileList.splice(i, 1)
                i--
            }
        }
        console.log(fileList)

        if (fileList != null) {
            conc = thisfile.concat(fileList)
        }
        Conf.saveJobs(conc)
    }

    render() {
        var that = this
        return (
            <div id='codePanel'>
                <button type="button" className="btn btn-default" aria-label="Left Align" onClick={this.exitCodeEdit.bind(this)}>
                    <span className="glyphicon glyphicon-arrow-left" aria-hidden="true"></span>
                </button>
                <button type="button" className="btn btn-default navbar-right" aria-label="Left Align" onClick={this.savefile.bind(this)}>
                    <span className="glyphicon glyphicon-save" aria-hidden="true"></span>
                </button>
                <button type="button" className="btn btn-default navbar-right" aria-label="Left Align" onClick={
                    function () { that.subJob.bind(that)({ filename: that.state.filename, fullname: that.state.fullname }) }
                }>
                    <span className="glyphicon glyphicon-upload" aria-hidden="true"></span>
                </button>
                <br />
                <br />
                <h4 className='page-header'>
                    {this.state.filename}
                </h4>
                <div id='textdiv'>
                    <textarea
                        id='codearea1'
                        defaultValue={this.state.code}
                    />
                </div>

            </div>
        )
    }
}