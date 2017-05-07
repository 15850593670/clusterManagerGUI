'use strict'

import React from 'react'

import Conf from '../common/conf'
import './less/newjobtem.less'

export default class newTemJob extends React.Component {
    constructor(props) {
        super(props)
        // var batchS = ['Torque(pbs)', 'LSF', 'SEG', 'slurm']

        this.state = {
            batchS: ['Torque(pbs)', 'LSF', 'SEG', 'slurm'],
            // 1:torque(pbs) 2:lsf 3:sge 4:slurm
            batchclass: 1,
            shebang: '#!/bin/sh',
            discriptions: ['Job Name', 'Queue', 'Email Address', 'Event Notification', 'Node Count', 'CPU Count', 'Wall Clock Limit', 'Memory Size',
                'Standard Output FIle', 'Standard Error File', 'Combine stdout/err', 'Begin Time'],
            ScriptDirective: ['#PBS', '#BSUB', '#$', '#SBATCH'],
            pream: [
                [
                    ['-N [name]', '-N ', ''],
                    ['-q [queue]', '-q ', ''],
                    ['-M [address]', '-M ', ''],
                    ['-m abe', '-m ', ''],
                    ['-l nodes=[count]', '-l nodes=', ''],
                    ['-l ppn=[count]', '-l ppn=', ''],
                    ['-l walltime=[hh:mm:ss]', '-l walltime=', ''],
                    ['-l mem=[MB]', '-l mem=', ''],
                    ['-o [file_name]', '-o ', ''],
                    ['-e [file_name]', '-e ', ''],
                    ['-j oe (both to stdout) OR -j eo(both to stderr)', '-j ', ''],
                    ['-A "YYYY-MM-DD HH:MM:SS"', '-A ', '']
                ],
                [
                    ['-J [name]', '-J ', ''],
                    ['-q [queue]', '-q ', ''],
                    ['-u [address]', '-u ', ''],
                    ['-B or -N', '', ''],
                    ['-n [count]', '-n ', ''],
                    ['-n [count]', '', ''],
                    ['-W [hh:mm:ss]', '-W ', ''],
                    ['-M [MB]', '-M ', ''],
                    ['-o [file_name]', '-o ', ''],
                    ['-e [file_name]', '-e ', ''],
                    ['(use -o without -e)', '', ''],
                    ['-b [[year:][month:]day:]hour:minute', '-b ', '']
                ],
                [
                    ['-N [name]', '-N ', ''],
                    ['-q [queue]', '-q ', ''],
                    ['-M [address]', '-M ', ''],
                    ['-m abe', '-m ', ''],
                    ['N/A', '', ''],
                    ['-pe [PE] [count]', '-pe ', ''],
                    ['-l h_rt=[seconds]', '-l h_rt=', ''],
                    ['-l mem_free=[memory][K|M|G]', '-l mem_free=', ''],
                    ['-o [file_name]', '-o ', ''],
                    ['-e [file_name]', '-e ', ''],
                    ['-j yes', '', ''],
                    ['-a [YYMMDDhhmm]', '-a ', '']
                ],
                [
                    ['--job-name=[name]', '--job-name=', ''],
                    ['-p [queue]', '-p ', ''],
                    ['--mail-user=[address]', '--mail-user=', ''],
                    ['--mail-type=[events]', '--mail-type=', ''],
                    ['-N [min[-max]]', '-N ', ''],
                    ['-n [count]', '-n ', ''],
                    ['-t [min] OR -t [days-hh:mm:ss]', '-t ', ''],
                    ['--mem=[mem][M|G|T]', '--mem=', ''],
                    ['-o [file_name]', '-o ', ''],
                    ['-e [file_name]', '-e ', ''],
                    ['(use -o without -e)', '', ''],
                    ['--begin=YYYY-MM-DD[THH:MM[:SS]]', '--begin=', '']
                ]
            ]
        }

    }
    componentDidMount() {
        if (connS.connSettings.batchtype != 0) {
            this.setState({ batchclass: connS.connSettings.batchtype })
        }
    }

    cancelClick(e) {
        $('#newtemjob-modal').modal('hide')

    }
    jobOK() {
        var jobst = ''
        jobst += this.state.shebang + '\n'
        jobst += '\n####  job preamble\n'
        for(var i = 0;i < this.state.pream.length;i++){
            if(this.state.pream[this.state.batchclass-1][i][2] != ''){
                jobst += this.state.ScriptDirective[this.state.batchclass-1] + ' ' + this.state.pream[this.state.batchclass-1][i][1] + this.state.pream[this.state.batchclass-1][i][2] + '\n'
            }
        }
        jobst += '\n####  End job preamble\n'
        this.props.openfile([jobst])
        // console.log(jobst)
        $('#newtemjob-modal').modal('hide')
    }

    batchtypeChoose(i) {
        this.setState({ batchclass: i })
    }
    valuechange(e) {
        if (e.target.id == 'shebang') {
            this.state.shebang = e.target.value
        } else {
            this.state.pream[this.state.batchclass - 1][e.target.id][2] = e.target.value
        }
    }


    render() {
        var that = this
        var batchlist = that.state.batchS.map((batchone, i) => {
            if (i == that.state.batchclass - 1) {
                return (
                    <label className="checkbox-inline" key={i} onClick={function () { that.batchtypeChoose.bind(that)(i + 1) }}>
                        <input type="radio" name="optionsRadiosinline" id={"optionsRadios" + i} value="option" checked onChange={function () { }}></input> {this.state.batchS[i]}
                    </label>
                )
            } else {
                return (
                    <label className="checkbox-inline" key={i} onClick={function () { that.batchtypeChoose.bind(that)(i + 1) }}>
                        <input type="radio" name="optionsRadiosinline" id={"optionsRadios" + i} value="option" onChange={function () { }} checked={false}></input> {this.state.batchS[i]}
                    </label >
                )
            }
        })
        // console.log(connS.connSettings.batchtype)
        var preamtable = that.state.pream[that.state.batchclass - 1].map((tip, i) => {
            return (
                <tr key={i}>
                    <td>{that.state.discriptions[i]}</td>
                    <td>{tip[0]}</td>
                    <td>{tip[1]}</td>
                    <td><input type="text" id={i} onChange={that.valuechange.bind(that)}></input></td>
                </tr>
            )
        })


        return (
            <div className="modal fade" id='newtemjob-modal' tabIndex='-1' >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button className="close" onClick={this.cancelClick.bind(this)}>&times;</button>
                            <h4>Create new job</h4>
                        </div>
                        <div id='jobtype'>job type</div>
                        <div className="modal-body">
                            <div>
                                {batchlist}
                            </div>
                        </div>
                        <div className="table-responsive" >
                            <table className="table table-striped" id='jobpreamtable'>
                                <tbody>
                                    <tr><td>shebang</td><td></td><td></td>
                                        <td><input type="text" id='shebang' defaultValue='#!/bin/sh' onChange={that.valuechange.bind(that)}></input></td>
                                    </tr>
                                    {preamtable}
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-default" onClick={this.cancelClick.bind(this)}>Cancel</button>
                            <button className="btn btn-primary" onClick={this.jobOK.bind(this)}>Done</button>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}