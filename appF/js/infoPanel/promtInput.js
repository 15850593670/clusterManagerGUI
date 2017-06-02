'use strict'

import React from 'react'

export default class promtInput extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            type: 0,
            index: 0,
            prompt: [
                [
                    ['-a', 'data_time', '[[[[CC]YY]MM]DD]hhmm[.SS]', '0', ''],
                    ['-A', 'account_string', '', ''],
                    ['-b', 'seconds', '', '0', ''],
                    ['-c', 'checkpoint_options', '', '0', ''],
                    ['-C', 'directive_prefix', '', '0', ''],
                    ['-d', 'working directory path', '', '0', ''],
                    ['-D', 'root directory', '', '0', ''],
                    ['-e', 'the path for the standard error stream', '', '0', ''],
                    ['-F', 'the arguments that will be passed to the job script', '', '0', ''],
                    ['-h', 'Specifies that a user hold be applied to the job at submission time', '', '0', ''],
                    ['-i', 'idle_slot_limit', '', '0', ''],
                    ['-I', 'Declares that the job is to be run "interactively".', '', '1', ''],
                    ['-j', 'join', '', '0', ''],
                    ['-k', 'keep', '', '0', ''],
                    ['-K', 'kill_delay', '', '0', ''],
                    ['-l', 'resource_list', '', '0', ''],
                    ['-L', 'req_information', '', '0', ''],
                    ['-m', 'mail_options', '[abef]', '0', ''],
                    ['-M', 'user_list', 'user[@host][,user[@host],...]', '0', ''],
                    ['-n', 'node_exclusive', '', '0', ''],
                    ['-N', 'name', '', '0', ''],
                    ['-o', 'the path for the standard output stream', '', '0', ''],
                    ['-p', 'priority','-1024~1023', '2', ''],
                    ['-q', 'Defines the destination of the job', 'queue/server', '0', ''],
                    ['-r', 'Declares whether the job is rerunable', 'y/n', '0', ''],
                    ['-S', 'Declares the path to the desires shell for this job', '', '0', ''],
                    ['-t', 'Specifies the task ids of a job array.', '', '0', ''],
                    ['-u', 'Defines the user name under which the job is to run on the execution system.', '', '0', ''],
                    ['-v', 'Expands the list of environment variables', '', '0', ''],
                    ['-V', 'Declares that all environment variables', '', '0', ''],
                    ['-w', 'Defines the working directory path to be used for the job.', '', '0', ''],
                    ['-W', 'additional_attributes', '', '0', ''],
                    ['-x', '---', '', '1', ''],
                    ['-X', 'Enables X11 forwarding.', '', '1', ''],
                    ['-z', '---', '', '1', '']
                ]
            ]
        }

        em.on('alertInfo', (v, text) => {
            console.log('eqweq', this.state.refresh)
            this.setState(
                {
                    p: v,
                    text: text,
                    refresh: this.state.refresh + 1
                }, () => {
                    this.display()
                }
            )
        })
    }
    display() {
        $(".alert1").fadeIn(0, () => {
            $('.alert1').css('display', 'block')
            window.setTimeout(function () {
                $(".alert1").fadeOut(1000)
            }, 3000);
        })

    }

    render() {
        if (this.state.p == 1) {
            return (
                <div className="alert1" style={{ display: 'none' }}>
                    <div className="msg msg-success msg-success-text alert1"> <span className="glyphicon glyphicon glyphicon-ok"></span> Succeed!! {this.state.text}</div>
                </div>

            )
        } else {
            return (
                <div className="alert1" style={{ display: 'none' }}>
                    <div className="msg msg-warning msg-danger-text alert1"> <span className="glyphicon glyphicon-exclamation-sign"></span> Fail!! {this.state.text}</div>
                </div>
            )
        }

    }
}