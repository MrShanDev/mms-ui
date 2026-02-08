// https://vue-data-ui.graphieros.com/ 轻量图表
const config1 = ref({
    style: {
        // backgroundColor: '#2A2A2A',
        chartWidth: 350,
        area: {
            show: true,
            color: '#42b2ff',
        },
        dataLabel: {
            fontSize: 64,
            color: '#CCCCCC',
        },
        line: {
            color: '#42b2ff',
            smooth: true,
        },
        title: {
            color: '#020202',
            text: '系统CPU',
        },
    },
});
const dataset1 = ref([
    {
        period: '%',
        value: 39,
    },
    {
        period: 'T0',
        value: 89,
    },
    {
        period: 'T3',
        value: 21,
    },
    {
        period: 'T2',
        value: 34,
    },
    {
        period: 'T4',
        value: 13,
    },
    {
        period: 'T6',
        value: 5,
    },
    {
        period: 'T5',
        value: 8,
    },
    {
        period: 'T9',
        value: 11,
    },
    {
        period: 'T7',
        value: 31,
    },
    {
        period: 'T8',
        value: 12,
    },
    {
        period: 'T11',
        value: 11,
    },
    {
        period: 'T10',
        value: 7,
    },
    {
        period: 'T17',
        value: 21,
    },
    {
        period: 'T12',
        value: 6,
    },
    {
        period: 'T13',
        value: 9,
    },
    {
        period: 'T18',
        value: 34,
    },
    {
        period: 'T20',
        value: 89,
    },
    {
        period: 'T14',
        value: 5,
    },
    {
        period: 'T16',
        value: 13,
    },
    {
        period: 'T15',
        value: 8,
    },
    {
        period: '%',
        value: 39,
    },
]);
const config2 = ref({
    style: {
        // backgroundColor: '#2A2A2A',
        chartWidth: 350,
        area: {
            show: false,
        },
        dataLabel: {
            fontSize: 64,
            color: '#CCCCCC',
        },
        line: {
            color: '#01c744',
        },
        title: {
            color: '#000000',
            text: '系统负载',
        },
        bar: {
            color: '#01c744',
            borderRadius: 10,
        },
    },
    type: 'bar',
});
const dataset2 = ref([
    {
        period: 'T1',
        value: 55,
    },
    {
        period: 'T0',
        value: 89,
    },
    {
        period: 'T3',
        value: 21,
    },
    {
        period: 'T2',
        value: 34,
    },
    {
        period: 'T4',
        value: 13,
    },
    {
        period: 'T6',
        value: 5,
    },
    {
        period: 'T5',
        value: 8,
    },
    {
        period: 'T9',
        value: 11,
    },
    {
        period: 'T7',
        value: 31,
    },
    {
        period: 'T8',
        value: 12,
    },
    {
        period: 'T11',
        value: 11,
    },
    {
        period: 'T10',
        value: 7,
    },
    {
        period: 'T17',
        value: 21,
    },
    {
        period: 'T12',
        value: 6,
    },
    {
        period: 'T13',
        value: 9,
    },
    {
        period: 'T18',
        value: 34,
    },
    {
        period: 'T20',
        value: 89,
    },
    {
        period: 'T14',
        value: 5,
    },
    {
        period: 'T16',
        value: 13,
    },
    {
        period: 'T15',
        value: 8,
    },
    {
        period: 'T19',
        value: 55,
    },
]);
const config3 = ref({
    "useCssAnimation": true,
    "useBlurOnHover": true,
    "autoSize":true,
    "style": {
        "fontFamily": "inherit",
        "chart": {
            "useGradient": true,
            "gradientIntensity": 40,
            "backgroundColor": "#FFFFFF",
            "color": "#1A1A1A",
            "layout": {
                "curvedMarkers": true,
                "labels": {
                    "dataLabels": {"show": true, "hideUnderValue": 3, "prefix": "", "suffix": ""},
                    "value": {"show": true, "rounding": 0},
                    "percentage": {"color": "#1A1A1A", "bold": true, "fontSize": 14},
                    "name": {"color": "#1A1A1A", "bold": false, "fontSize": 14},
                    "hollow": {
                        "total": {
                            "show": true,
                            "bold": false,
                            "fontSize": 18,
                            "color": "#1A1A1A",
                            "text": "总计",
                            "offsetY": -14,
                            "value": {
                                "color": "#1A1A1A",
                                "fontSize": 18,
                                "bold": true,
                                "prefix": "",
                                "suffix": "",
                                "offsetY": -9,
                                "rounding": 0
                            }
                        },
                        "average": {
                            "show": true,
                            "bold": false,
                            "color": "#1A1A1A",
                            "fontSize": 18,
                            "text": "平均",
                            "offsetY": 5,
                            "value": {
                                "color": "#1A1A1A",
                                "fontSize": 18,
                                "bold": true,
                                "prefix": "",
                                "suffix": "",
                                "offsetY": 11,
                                "rounding": 0
                            }
                        }
                    }
                },
                "donut": {"strokeWidth": 64, "borderWidth": 1}
            },
            "legend": {
                "show": false,
                "backgroundColor": "#FFFFFF",
                "color": "#1A1A1A",
                "fontSize": 16,
                "bold": false,
                "roundingValue": 0,
                "roundingPercentage": 0
            },
            "title": {
                "text": "技术栈分析",
                "color": "#1A1A1A",
                "fontSize": 20,
                "bold": true,
                "subtitle": {"text": "mmsAdmin", "color": "#1A1A1A", "fontSize": 16, "bold": false}
            },
            "tooltip": {
                "show": true,
                "backgroundColor": "#FFFFFF",
                "color": "#1A1A1A",
                "fontSize": 14,
                "showValue": true,
                "roundingValue": 0,
                "showPercentage": true,
                "roundingPercentage": 0
            }
        }
    },
    "userOptions": {"show": true},
    "table": {
        "show": false,
        "responsiveBreakpoint": 400,
        "columnNames": {"series": "Series", "value": "Value", "percentage": "Percentage"},
        "th": {"backgroundColor": "#FFFFFF", "color": "#1A1A1A", "outline": "none"},
        "td": {
            "backgroundColor": "#FFFFFF",
            "color": "#1A1A1A",
            "outline": "none",
            "roundingValue": 0,
            "roundingPercentage": 0
        }
    }
});
const dataset3 = ref([
    {"name": "Java", "values": [790], "color": "#d94126"},
    {"name": "Vue3", "values": [275], "color": "#f5ee38"},
    {"name": "UniApp-x", "values": [200], "color": "#6376DD"},
    {"name": "TypeScript", "values": [153], "color": "#42d392"},
    {"name": "UTS", "values": [99], "color": "#d98320"},
    {"name": "Docker", "values": [259], "color": "#046c26"}
]);

export {
    config1,config2,config3,dataset1,dataset2,dataset3
}