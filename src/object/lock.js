var { tools } = require('./tools');

const lock = {

    /**
     * 执行上锁(分布式锁)
     * @param {*} lockName
     * @param {*} lockMS
     */
    async lock(lockName = 'crontab_task', lockMS = 100000, lockOperator = '', time = null) {
        try {
            const ctime = time ? time : dayjs().format('YYYY-MM-DD HH:mm:ss');
            const lockList = await Betools.query.queryTableDataByWhereSQL('bs_lock_info', `_where=(lock_name,eq,${lockName})~and(status,eq,1)~and(expire_time,gt,${ctime})&_sort=-id`);
            if (lockList && lockList.length > 0) {
                return false; //已经上锁，不能执行操作
            } else { //未上锁，执行操作
                const tempList = await Betools.query.queryTableDataByWhereSQL('bs_lock_info', `_where=(lock_name,eq,${lockName})&_sort=-id`); //先查询对应lock_name的所有数据，删除
                for (const item of tempList) {
                    await Betools.manage.deleteTableData("bs_lock_info", item.id);
                }
                const elem = { //新增本条lock_name数据，上锁
                    id: tools.queryUniqueID(),
                    lock_name: lockName,
                    lock_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    lock_value: '',
                    expire_time: dayjs().add(1, 'millisecond').format('YYYY-MM-DD HH:mm:ss'),
                    expire_timestamp: lockMS || 24 * 3600 * 1000,
                    lock_remark: '',
                    content: '',
                    status: 1,
                    lock_username: lockOperator,
                    lock_flag: 'Y',
                };
                await Betools.manage.postTableData('bs_lock_info', elem);
                return true;
            }
        } catch (error) {
            return false;
        }
    },

    /**
     * 执行解锁(分布式锁)
     * @param {*} tableName
     * @param {*} id
     */
    async unlock(lockName = 'crontab_task') {
        try {
            const tempList = await Betools.query.queryTableDataByWhereSQL('bs_lock_info', `_where=(lock_name,eq,${lockName})&_sort=-id`); //先查询对应lock_name的所有数据，删除
            tempList.map((item) => { Betools.manage.deleteTableData("bs_lock_info", item.id) });
            return true;
        } catch (error) {
            return false;
        }
    },


};

var lockExports = {
    lock,
}

module.exports = lockExports