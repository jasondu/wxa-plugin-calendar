var plugin = requirePlugin("myPlugin")
Page({
    data: {
        startTime: '08:00',
        endTime: '18:00',
        unit: 30,
        reserveUnit: 60,
        activedConst: 101,
        disabledConst: 102,
        unreserveTime: [],
    },
    onLoad() {
        // 动态设置非服务事件
        setTimeout(() => {
            this.setData({
                unreserveTime: [
                    {
                        startTime: '2018-04-18 14:00:00',
                        endTime: '2018-04-18 15:00:00',
                        status: 102,    // 不能选中
                    },
                ]
            });
        }, 2000)
    },
    onSelectTime(e) {
        const { startTimeText, endTimeText } = e.detail;
        this.setData({
            startTimeText,
            endTimeText,
        })
    }
})