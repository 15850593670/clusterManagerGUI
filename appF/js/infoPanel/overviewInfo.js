'use strict'

import React from 'react'
import echarts from 'echarts'
// import Conf from '../common/conf'

export default class overviewInfo extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            charts: [[], [], []],
            sname: ["Node status", "Queue status", "Job status"],
            ok: false,
            // nodes: [],
            // queue: [],
            // jobs: [],
            login: '',
            refresh: 0
        }
        em.on('connectionEstablished', function () {
            console.log('start get NQJ')
            em.emit('getNQJ')
        }.bind(this))

        em.on('getNQJFinished', function () {
            console.log('get NQJ  finish')
            this.refresh()
            // this.componentDidMount()
        }.bind(this))
    }

    componentWillMount() {
        console.log('will mount')
        if (this.props.connect == true) {
            this.state.login = 'Login ' + connS.connSettings.host + ' as ' + connS.connSettings.username
        }
        em.emit('getNQJ')
    }

    componentDidMount() {
        console.log('mounted', this.state.login)
        // this.refresh()
        // console.log(this.state.ok)
        if (this.state.login == '') return

        this.showChart(0)
        this.showChart(1)
        this.showChart(2)

    }
    componentDidUpdate() {
        console.log('componentdid updated')
        if (this.state.login == '') return

        this.showChart(0)
        this.showChart(1)
        this.showChart(2)
    }


    showChart(v) {
        // console.log('showchart', document.getElementById('myChart' + v))
        var myChart = echarts.init(document.getElementById('myChart' + v));
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                left: 'center',
                bottom: 0,
                data: connS.Charts[v][0]
            },
            series: [
                {
                    name: this.state.sname[v], //内环
                    type: 'pie',
                    selectedMode: 'single', //单一选中模式
                    radius: [0, '80%'], //饼图的半径 [内半径，外半径]

                    label: {
                        normal: {
                            position: 'inner' //内置文本标签
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false	 //不需要设置引导线
                        }
                    },
                    data: connS.Charts[v][1]
                    // data: [
                    //     // { value: 335, name: '微博'},
                    //     // { value: 679, name: '微信' },
                    //     // { value: 1548, name: '百度' }
                    // ]
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        // this.setState({ refresh: this.state.refresh + 1 })
    }

    refresh() {
        if (connS.connected == true) {
            this.setState({ login: 'Login ' + connS.connSettings.host + ' as ' + connS.connSettings.username, refresh: this.state.refresh + 1 })
            // this.state.login = 'Login ' + connS.connSettings.host + ' as ' + connS.connSettings.username
            // $('#w234').text(this.state.login)
            // this.componentDidMount()
            // if (this.isMounted()) {
            //     this.forceUpdate()
            // }
            // console.log(connS.connSettings.host)
        }
    }
    login() {
        // data-toggle='modal' data-target='#login-modal'
        $('#login-modal').modal('show')
        // console.log($('#login-modal'))
    }

    render() {
        // console.log('overview render', this.state.refresh, 'sfdsf')
        if (this.state.login == '') {
            return (
                <div id='overviewInfoPanel' >
                    <h1 className='page-header'> cluster overview</h1>
                    <div id='w23'> Not connected! </div>
                    <a onClick={this.login.bind(this)}><p className="text-primary">connect to a cluster</p></a>
                </div>
            )
        }
        // console.log('overview render dadsad')
        this.state.ok = true
        var xx = []
        console.log('render', connS.Charts)
        for (var i = 0; i < connS.Charts.length; i++) {
            var temp = 0
            for (var j = 0; j < connS.Charts[i][1].length; j++) {
                temp += connS.Charts[i][1][j].value
            }
            xx.push(temp)
        }
        // this.component()
        return (
            <div id='overviewInfoPanel' >
                <h1 className='page-header'> cluster overview</h1>
                <div id='w234'> {this.state.login} </div>
                <div className="row placeholders">
                    <div className="col-xs-6 col-sm-4 placeholder">
                        <div id="myChart0" style={{ "width": "80%", "height": "300px", "marginLeft": "10%" }}></div>
                        <h4>Nodes</h4>
                        <span className="text-muted">Total: {xx[0]} nodes</span>
                    </div>
                    <div className="col-xs-6 col-sm-4 placeholder">
                        <div id="myChart1" style={{ "width": "80%", "height": "300px", "marginLeft": "10%" }}></div>

                        <h4>Queues</h4>
                        <span className="text-muted">Total: {xx[1]} queues</span>
                    </div>
                    <div className="col-xs-6 col-sm-4 placeholder">
                        <div id="myChart2" style={{ "width": "80%", "height": "300px", "marginLeft": "10%" }}></div>

                        <h4>Jobs</h4>
                        <span className="text-muted">Total: {xx[2]} jobs</span>
                    </div>
                </div>
            </div>
        )
    }
}