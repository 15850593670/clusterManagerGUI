'use strict'

import React from 'react'

// import './less/queueManBar.less'

export default class qmgrSet extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            refresh: 0,
            setqplaceholder: ["Input attribute value.(eg. started = True or false)", "Input new queue name."],
            op1: ['set server', 'set queue', 'create queue', 'delete queue'],
            op2: [
                ['acl_group_hosts', 'acl_hosts', 'acl_host_enable', 'acl_logic_or', 'acl_user_hosts', 'allow_node_submit', 'allow_proxy_user',
                    'auto_node_np', 'automatic_requeue_exit_code', 'cgroup_per_task', 'checkpoint_defaults', 'clone_batch_delay', 'clone_batch_size',
                    'copy_on_rerun', 'cray_enabled', 'default_gpu_mode', 'default_queue', 'disable_server_id_check', 'disable_automatic_requeue',
                    'display_job_server_suffix', 'dont_write_nodes_file', 'down_on_error', 'email_batch_seconds', 'exit_code_canceled_job',
                    'ghost_array_recovery', 'gres_modifiers', 'idle_slot_limit', 'interactive_jobs_can_roam',
                    'job_exclusive_on_use', 'job_force_cancel_time', 'job_full_report_time', 'job_log_file_max_size', 'job_log_file_roll_depth',
                    'job_log_keep_days', 'job_nanny', 'job_stat_rate', 'job_start_timeout', 'job_suffix_alias', 'job_sync_timeout',
                    'keep_completed', 'kill_delay', 'legacy_vmem', 'lock_file', 'lock_file_check_time', 'log_events', 'lock_file_update_time',
                    'log_file_max_size', 'log_file_roll_depth', 'log_keep_days', 'log_level', 'mail_body_fmt', 'mail_domain',
                    'mail_from', 'mail_subject_fmt', 'managers', 'max_job_array_size', 'max_slot_limit', 'max_threads',
                    'max_user_queuable', 'max_user_run', 'min_threads', 'moab_array_compatible', 'mom_job_sync', 'next_job_number', 'node_check_rate',
                    'node_ping_rate', 'node_submit_exceptions', 'node_pack', 'no_mail_force', 'np_default',
                    'operators', 'pass_cpuclock', 'poll_jobs', 'query_other_jobs', 'record_job_info', 'record_job_script',
                    'resources_available', 'scheduling', 'submit_hosts', 'tcp_incoming_timeout',
                    'tcp_timeout', 'thread_idle_seconds', 'timeout_for_job_delete', 'timeout_for_job_requeue',
                    'use_jobs_subdirs',
                ],
                ['acl_groups', 'acl_group_enable', 'acl_group_sloppy', 'acl_hosts', 'acl_host_enable', 'acl_logic_or', 'acl_users', 'acl_user_enable',
                    'disallowed_types', 'enabled', 'features_required', 'ghost_queue', 'keep_completed', 'kill_delay', 'max_queuable', 'max_running',
                    'max_user_queuable', 'max_user_run', 'priority', 'queue_type', 'req_information_max', 'req_information_min', 'required_login_property',
                    'resources_default', 'resources_max', 'resources_min', 'route_destinations', 'started',
                    'resources_available']
            ],
            ch1: 0,
            ch2: 0,
            ch3: 0,
            attrvalue: '',
            command: '',
            qqq: []
        }

        em.on('getQueuesFinished', function (q) {
            // this.refresh()
            // console.log('get queue finish')
            this.setState({qqq: q})
            // this.forceUpdate()
        }.bind(this))
    }
    refresh() {
        // console.log(this.state.refresh)
        this.setState({ refresh: this.state.refresh + 1 })
    }
    getQQQ() {
        em.emit('getQueues')
    }
    componentWillMount() {
        this.getQQQ()
    }
    componentDidMount() {
        // var that = this
        $('#thisone').click(function (event) {
            event.stopPropagation();
        });
    }
    componentDidUpdate() {
        $('#thisone').click(function (event) {
            event.stopPropagation();
        });
    }
    hide() {
        $('#queuemanbar').hide()
        $('#textIn').val('')
        this.state.attrtext = ''
    }
    commit() {
        if (this.state.Command == '') {
            // console.log('123123')
            em.emit('alertInfo', 2, 'Input valid command!')
            return
        }

        var that = this
        ++comNum
        em.emit('newCommand', "qmgr -c '" + that.state.Command + "'")
        em.once('reply' + (comNum - 1), (data) => {
            console.log(data)
            let dataT = data.split("mgr -c")
            dataT = dataT[1].split('$')
            dataT = dataT[0].split('\r\n')
            if (dataT.length == 2) {
                em.emit('alertInfo', 1, that.state.Command + ' succeed!')
            } else {
                em.emit('alertInfo', 2, dataT.slice(1, dataT.length - 1).join(' '))
            }
            em.emit('qmgrrefresh')
            em.emit('getQueues')
        })

    }
    handleTextChange(e) {
        this.setState({ attrvalue: e.target.value });
    }
    handleComandChange(e) {
        this.setState({ command: e.target.value })
    }
    filterFunction(e) {
        var input, filter, a, i
        // input = $("#myInput")
        filter = e.target.value.toUpperCase();
        var div = $("#myDropdown");
        // console.log(div[0].children[1].children )
        a = div[0].children
        for (i = 1; i < a.length; i++) {
            if (a[i].children[0].text.toUpperCase().indexOf(filter) > -1) {
                a[i].style.display = "";
            } else {
                a[i].style.display = "none";
            }
        }
    }
    setchoose(v1, v2) {
        if (v1 == 1) {
            this.setState({ ch1: v2 })
        } else if (v1 == 2) {
            this.setState({ ch2: v2 })
        } else {
            this.setState({ ch3: v2 })
        }
    }
    generateCommand() {
        if (this.state.ch1 == 0) {
            this.setState({ Command: this.state.op1[0] + ' ' + this.state.op2[0][this.state.ch3] + '=' + this.state.attrvalue })
        } else if (this.state.ch1 == 1) {
            this.setState({ Command: this.state.op1[1] + ' ' + this.state.qqq[this.state.ch2] + ' ' + this.state.op2[1][this.state.ch3] + '=' + this.state.attrvalue })
        } else if (this.state.ch1 == 2) {
            this.setState({ Command: this.state.op1[2] + ' ' + this.state.attrvalue })
        } else {
            this.setState({ Command: this.state.op1[3] + ' ' + this.state.qqq[this.state.ch2] })
        }
    }
    clear() {
        this.setState({ Command: '' })
    }

    render() {
        var that = this
        var lista = this.state.op1.map((p, i) => {
            return (<li key={i} onClick={function () { that.setchoose(1, i) }}><a href="#">{p}</a></li>)
        })
        var listb = null
        if (this.state.ch1 < 2) {
            var temp = this.state.op2[this.state.ch1].map((p, j) => {
                return (<li key={j} onClick={function () { that.setchoose(3, j) }}><a href="#">{p}</a></li>)
            })
            listb = <div className="input-group-btn ">
                <button type="button" className="btn btn-default dropdown-toggle"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.state.op2[this.state.ch1][this.state.ch3] + ' = '}<span className="caret"></span></button>
                <ul className="dropdown-menu" id="myDropdown">
                    <li id='thisone' ><input type="text" placeholder="Search.." id="myInput" onChange={this.filterFunction.bind(this)} ></input></li>
                    {temp}
                </ul>
            </div>
        } else {
            // listb = {<}
            listb = <span className="input-group-addon">-</span>
        }
        var label2
        if (this.state.ch1 == 0 || this.state.ch1 == 2 || this.state.qqq.length == 0) {
            label2 = <span className="input-group-addon">-</span>
        } else {
            // console.log(this.state.qqq, connS.queues)
            var temp = this.state.qqq.map((p, i) => {
                return (<li key={i} onClick={function () { that.setchoose(2, i) }}><a href="#">{p}</a></li>)
            })
            label2 = <div className="input-group-btn">
                <button type="button" className="btn btn-default dropdown-toggle"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.state.qqq[this.state.ch2]}<span className="caret"></span></button>
                <ul className="dropdown-menu">
                    {temp}
                </ul>
            </div>
        }
        return (

            <div className="row" id='queuemanbar' style={{ "marginTop": "30px" }}>
                <div className="input-group">
                    <div className="input-group-btn dropup">
                        <button type="button" className="btn btn-default dropdown-toggle"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.state.op1[this.state.ch1]} <span className="caret"></span></button>
                        <ul className="dropdown-menu">
                            {lista}
                        </ul>
                    </div>
                    {label2}
                    {listb}
                    <span className="input-group-addon" >{this.state.queue}</span>
                    <input id='textIn' type="text" className="form-control"
                        placeholder={this.state.setqplaceholder[this.state.setq]} onChange={this.handleTextChange.bind(this)}></input>
                    <span className="input-group-btn">
                        <button className="btn btn-default" type="button" onClick={this.generateCommand.bind(this)}>generate command</button>
                    </span>
                </div>
                <div className="input-group" style={{ "marginTop": "10px" }}>
                    <span className="input-group-addon">Command</span>
                    <input type="text" className="form-control" onChange={this.handleComandChange.bind(this)} value={this.state.Command}></input>
                    <span className="input-group-btn">
                        <button className="btn btn-default" type="button" onClick={this.commit.bind(this)}>Commit</button>
                        <button className="btn btn-primary" type="button" onClick={this.clear.bind(this)}>Clear</button>
                    </span>
                </div>

            </div>

        )
    }
}

