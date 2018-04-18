var plugin = requirePlugin("myPlugin")
Page({
    data: {
        startTime: '8:00',
        endTime: '18:00',
        unit: '30',
        reserveUnit: '60',
        unreserveTime: [
            {
                startTime: '2018-04-9 12:00:00',
                endTime: '2018-04-9 13:00:00',
                status: 102,
            },
        ],
    },
    onLoad: function () {
        setTimeout(() => {
            this.setData({
                unreserveTime: [
                    {
                        startTime: '2018-04-9 12:00:00',
                        endTime: '2018-04-9 13:00:00',
                        status: 101,
                    },
                    {
                        startTime: '2018-04-9 14:00:00',
                        endTime: '2018-04-9 15:00:00',
                        status: 101,
                    },
                ]
            });
        }, 2000)
    }
})