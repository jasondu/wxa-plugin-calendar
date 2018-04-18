import moment from '../../lib/moment.min';
/**
 * 预约日历组件
 * 入参：请参考代码中的properties属性
 * 事件：selectTime 事件回调参数：e.detail.selectTime 选中时间戳
 */
Component({
    // 入参
    properties: {
        startTime: {    // 最早预约时间
            type: String,
            value: '09:00',
        },
        endTime: {      // 最晚预约时间
            type: String,
            value: '22:00',
        },
        unit: {         // 展示时间单位（默认30分钟）
            type: Number,
            value: 15,
        },
        reserveUnit: {  // 预约时间单位（默认60分钟）
            type: Number,
            value: 60,
        },
        activedConst: { // 已经选中的常量标示
            type: Number,
            value: 101,
        },
        disabledConst: {// 不可选的常量标示
            type: Number,
            value: 102,
        },
        unreserveTime: {    // 不可预约时间列表
            type: Array,
            value: [],
            observer: '_unreserveTimeChange'
        },
        themeColor: {
            type: String,
            value: '#E74C75',
        }
    },
    data: {
        dateList: [],
        timeList: new Array(30),
        currentDate: 0,
        showCalendar: false,
    },
    externalClasses: ['theme-class'],
    created() {
        this.formatUnreserveTime();
    },
    attached() {
        // 初始化月日历
        this.initCalendar();
        // 初始化天日历
        this.initDate();
    },
    methods: {
        _unreserveTimeChange() {
            this.formatUnreserveTime();
            this.initDate();
        },
        formatUnreserveTime() {
            // 格式化不可预约时间列表
            const newUnreserveTime = this.unreserveTime || [];
            this.data.unreserveTime.forEach((item) => {
                newUnreserveTime.push({
                    startTime: moment(item.startTime).valueOf(),
                    endTime: moment(item.endTime).valueOf(),
                    status: item.status,
                });
            });
            this.unreserveTime = newUnreserveTime;
        },
        // 滚动天日历事件
        swiperChange(e) {
            this.setData({
                currentDate: e.detail.current,
            });
        },
        // 点击日期事件
        changeDate(e) {
            this.setData({
                currentDate: e.currentTarget.dataset.index,
            });
        },
        /**
         * 检查该事件是否已经预约 或 休息
         * @param {*} currentTime 时间戳
         */
        checkStatus(currentTime) {
            const len = this.unreserveTime.length;
            let result = {
                active: false,
                disabled: false,
            };
            for (let i = 0; i < len; i += 1) {
                const item = this.unreserveTime[i];
                if (+currentTime >= +item.startTime && +currentTime <= +item.endTime) {
                    if (item.status === this.data.activedConst) {  // 已经被预约
                        result = {
                            active: true,
                            disabled: false,
                        };
                    } else {
                        result = {              // 休息
                            active: false,
                            disabled: true,
                        };
                    }
                    return result;
                    // eslint-disable-next-line
                    break;
                }
            }
            return result;
        },
        // 深复制工具方法
        deepClone(obj) {
            const proto = Object.getPrototypeOf(obj);
            return Object.assign([], Object.create(proto), obj);
        },
        // 选择预约时间
        selectTime(e) {
            const { active, disabled, dateIndex, timeIndex } = e.currentTarget.dataset;
            if (active) {
                wx.showToast({ icon: 'none', title: '已经选择' });
            } else if (disabled) {
                wx.showToast({ icon: 'none', title: '不可选' });
            } else {
                const { reserveUnit, unit } = this.data;
                const num = reserveUnit / unit;
                let status = true;
                let timestamp = 0;
                this.data.timesList[dateIndex].map((item) => {
                    item.active = false;
                    return item;
                });
                // 深复制
                const cloneTimes = [].concat(JSON.parse(JSON.stringify(this.data.timesList[dateIndex])));
                for (let i = 0; i <= num; i += 1) {
                    const item = cloneTimes[timeIndex + i];
                    if (!item || item.disabled) {
                        status = false;
                        break;
                    }
                    item.active = true;
                }
                if (status) {
                    const startTime = cloneTimes[timeIndex].timestamp;
                    const endTime = startTime + this.data.reserveUnit * 60 * 1000;
                    this.triggerEvent('selectTime', {
                        startTime,
                        endTime,
                        startTimeText: moment(startTime).format('YYYY-MM-DD HH:mm:ss'),
                        endTimeText: moment(endTime).format('YYYY-MM-DD HH:mm:ss'),
                    });
                    this.data.timesList[dateIndex] = cloneTimes;
                    this.setData({ timesList: this.data.timesList });
                } else {
                    wx.showToast({ icon: 'none', title: '没有时间' });
                }
            }
        },
        // 选择日历时间
        selectDate(e) {
            const { date, monthIndex, dateIndex } = e.currentTarget.dataset;
            if (!date) return;
            if (this.data.selectCalendar) {
                const selectMonthIndex = this.data.selectCalendar.monthIndex;
                const selectDateIndex = this.data.selectCalendar.dateIndex;
                // eslint-disable-next-line
                this.data.months[selectMonthIndex].month[selectDateIndex]['selected'] = false;
            }
            // eslint-disable-next-line
            if (this.data.months[monthIndex].month[dateIndex].status < 0) {
                return;
            }
            this.data.months[monthIndex].month[dateIndex]['selected'] = true;
            this.setData({
                showCalendar: false,
                months: this.data.months,
                selectCalendar: {
                    monthIndex,
                    dateIndex,
                },
            });
            this.initDate(date);
        },
        // 初始化月日历
        initCalendar() {
            const months = [];
            for (let i = 0; i < 5; i += 1) {
                const furtureTime = moment().add(i, 'months');
                const currentMonthDays = furtureTime.daysInMonth();
                const currentWeekday = furtureTime.date(1).weekday();
                const month = new Array(currentWeekday);
                for (let j = 1; j <= currentMonthDays; j += 1) {
                    const startTime = furtureTime.date(j).startOf('day');
                    month.push({
                        title: j,
                        time: startTime.format('YYYY-MM-DD'),
                        status: startTime.valueOf() - moment().startOf('day').valueOf(),
                    });
                }
                months.push({
                    title: furtureTime.format('YYYY年MM月'),
                    month,
                });
            }
            this.setData({ months });
        },
        // 初始化天日历
        initDate(date) {
            const dateList = [];
            const timesList = [];
            [1, 2, 3, 4, 5].forEach((item, index) => {
                const current = moment(date).add(index, 'days');
                dateList.push({
                    index: current.format('d'),
                    date: current.format('MM-DD'),
                    allDate: current.format('YYYY-MM-DD'),
                });
            });
            dateList.forEach((item, i) => {
                const timeList = [];
                let index = 0;
                let currentTime = 0;
                const endTime = moment(`${dateList[i].allDate} ${this.data.endTime}`).valueOf();
                while (+currentTime < +endTime) {
                    const current = moment(`${dateList[i].allDate} ${this.data.startTime}`).add(this.data.unit * index, 'minutes');
                    currentTime = current.valueOf();
                    timeList.push({
                        time: current.format('HH:mm'),
                        timestamp: currentTime,
                        ...this.checkStatus(currentTime),
                    });
                    index += 1;
                }
                console.log('timeList:', timeList);
                timesList.push(timeList);
            });
            this.setData({ dateList, timesList });
        },
        // 显示、隐藏月日历
        toggleCalendar() {
            this.setData({ showCalendar: !this.data.showCalendar });
        },
    },
});
