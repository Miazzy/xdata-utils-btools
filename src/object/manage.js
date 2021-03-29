var { storage } = require('./storage');
var { tools } = require('./tools');

const manage = {

    /**
     * @description 查询当前自由流程业务
     * @param {*} id
     * @param {*} tools
     */
    async queryCurFreeWorkflow(id) {

        //提交URL
        var queryURL = `${window.BECONFIG['xmysqlAPI']}/api/bs_free_process?_where=(main_key,eq,${id})&_sort=-create_time`;

        //根据业务编号，查询业务数据
        var wflow = [];

        try {
            var res = await superagent.get(queryURL).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
            console.log(res);

            //如果只有一条数据，则返回[]；如果有多条数据，则返回多个数据
            if (
                typeof res.body == 'undefined' ||
                res.body == null ||
                res.body == '' ||
                res.body.length == 0
            ) {
                wflow = null;
            } else if (res.body.length >= 1) {
                wflow = res.body[0];
            }
        } catch (err) {
            console.log(err);
        }

        return wflow;
    },

    /**
     * @description 查询用户名称信息
     */
    async queryUserName() {

        //查询URL
        var index = 0;
        var queryURL;
        var result = [];

        try {
            //从缓存中获取用户数据
            var userlist = storage.getStore('cache_all_user_name');

            if (
                typeof userlist == 'undefined' ||
                userlist == null ||
                userlist.length == 0
            ) {
                while (index < 10000) {
                    queryURL = `${window.BECONFIG['xmysqlAPI']}/api/v_uname?_p=${index++}&_size=1000`;
                    var res = await superagent.get(queryURL).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
                    result = result.concat(res.body);
                    //如果返回结果数据小于size，则表示查询到末页，不在查询
                    if (res.body.length < 50) {
                        break;
                    } else {
                        continue;
                    }
                }

                //将用户数据设置到缓存中
                storage.setStore('cache_all_user_name', result, 3600 * 2);
            } else {
                result = userlist;
            }

            return result;
        } catch (err) {
            console.log(err);
        }
    },

    /**
     * @description 将英文名转化为中文名
     */
    async patchEnameCname(origin) {

        //中文名称
        var chinese = '';

        //原始英文名称列表
        var originlist = tools.deNull(origin).split(',');

        //查询用户信息
        var userlist = await queryUserName();

        //遍历用户获取中文名称列表
        for (var ename of originlist) {
            //获取流程发起人的中文信息
            var user = userlist.find(item => {
                return ename == item.username;
            });

            //如果找到用户信息，则设置用户信息
            if (!tools.isNull(user)) {
                chinese = `${chinese},${user.realname}`;
            } else {
                chinese = `${chinese},${ename}`;
            }
        }

        //去掉字符串开头的逗号
        if (chinese.startsWith(',')) {
            chinese = chinese.substring(1);
        }

        //去掉字符串结尾的逗号
        if (chinese.endsWith(',')) {
            chinese = chinese.substring(0, chinese.length - 1);
        }

        //返回中文名称列表
        return chinese;
    },

    /**
     * @description 处理用户信息
     */
    async handleUserInfo(userInfo) {
        //如果没有获取到用户信息，提示用户登录信息过期，请重新登录
        if (typeof userInfo == "undefined" && userInfo == null) {
            //确认用户信息
            // that.$confirm_({
            //     title: "提示信息",
            //     content: "用户登录信息过期，请重新登录！",
            //     onOk: async() => {
            //         //清空缓存信息
            //         storage.clearAll();
            //         //跳转到登录页面
            //         that.$router.push(`/user/login`);
            //     }
            // });
            return false;
        } else {
            return true;
        }
    },

    /**
     * @description 根据数据字典中的节点编号，查询到这个节点对应的流程岗位名称
     */
    async queryProcessLogByID(tableName, id) {

        //大写转小写
        tableName = tableName.toLowerCase();

        //提交URL
        var queryURL = `${window.BECONFIG['xmysqlAPI']}/api/pr_log?_where=(table_name,eq,${tableName})~and(id,eq,${id})`;

        try {
            var res = await superagent.get(queryURL).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
            console.log(res);
            return res.body[0];
        } catch (err) {
            console.log(err);
        }
    },

    /**
     * @description callback连续执行函数
     */
    setTimeouts(callback, ...times) {
        for (let time of times) {
            setTimeout(() => {
                callback();
            }, time);
        }
    },

    /**
     * 根据数据字典中的节点编号，查询到这个节点对应的员工信息
     */
    async queryProcessNodeEmployee(node, callback) {
        //查询URL
        var queryURL = `${window.BECONFIG['xmysqlAPI']}/api/bs_approve_node?_where=(name,eq,${node})`;

        try {
            var res = await superagent.get(queryURL).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
            console.log(res.body);

            if (
                typeof res != 'undefined' &&
                res.body instanceof Array &&
                res.body.length > 0 &&
                typeof callback != 'undefined'
            ) {
                callback(res.body[0]['item_text']);
            }

            return res.body;
        } catch (err) {
            console.log(err);
        }
    },

    /**
     * 根据数据字典中的节点编号，查询到这个节点对应的流程岗位名称
     */
    async queryProcessNodeProcName(node, callback) {
        //查询URL
        var queryURL = `${window.BECONFIG['xmysqlAPI']}/api/sys_dict_item?_where=(dict_id,eq,${window.requestAPIConfig.PROCESS_NODE_DICT_ID})~and(item_value,eq,${node})`;

        try {
            var res = await superagent.get(queryURL).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
            console.log(res);

            if (
                typeof res != 'undefined' &&
                res.body instanceof Array &&
                res.body.length > 0 &&
                typeof callback != 'undefined'
            ) {
                callback(res.body[0]['item_text']);
            }

            return res.body;
        } catch (err) {
            console.log(err);
        }
    },

    /**
     * 获取n位随机数,随机来源chars
     */
    queryRandomStr(length = 32) {

        var res = '';

        try {
            //使用新算法，获取唯一字符串
            res = tools.queryUniqueID(length);
        } catch (error) {
            console.log('获取n位随机数异常：' + error);
        }

        //返回随机数
        return res;
    },

    /**
     * 想知会记录列表提交数据
     */
    async postProcessLogInformed(node) {
        var postURL = null; //提交URL
        var res = null;
        var bflag = node instanceof Array && node.length > 1 ? '/bulk' : ''; //是否批处理

        //如果只有一条数据,则URL中不需要/bulk路径
        try {
            if (node instanceof Array && node.length == 1) {
                bflag = '';
                node = node[0];
            }
        } catch (error) {
            console.log(error);
        }

        //构建知会表提交数据的URL
        try {
            postURL = `${window.BECONFIG['xmysqlAPI']}/api/pr_log_informed${bflag}`;
        } catch (error) {
            console.log(error);
        }

        //发送post请求，保存数据
        try {
            node.xid = tools.queryUniqueID();
            res = await superagent.post(postURL).send(node).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
        } catch (err) {
            delete node.xid;
            res = await superagent.post(postURL).send(node).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
            console.log(err);
        }
        return res.body;
    },


    /**
     * @description 提交并持久化数据到服务器
     */
    async postTableData(tableName, node) {

        //大写转小写
        tableName = tableName.toLowerCase();
        //Post数据的URL地址
        var insertURL = `${window.BECONFIG['xmysqlAPI']}/api/${tableName}`;
        //设置node为value
        const value = node;
        var res = null;

        //设置时间格式
        Object.keys(value).map(key => {
            value[key] = key.includes('_time') && value[key] ? dayjs(value[key]).format('YYYY-MM-DD HH:mm:ss') : value[key];
        })

        //如果传入数据为数组，则URL添加bulk路径
        if (typeof node != 'undefined' && node != null && node instanceof Array) {
            insertURL = insertURL + '/bulk';
        }

        try {
            node.xid = tools.queryUniqueID();
            node.id = Object.keys(node).includes('id') && Betools.tools.isNull(node.id) ? node.xid : node.id;
            res = await superagent.post(insertURL).send(node).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
        } catch (err) {
            delete node.xid;
            res = await superagent.post(insertURL).send(node).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
            console.log(err);
        }
        return res.body;
    },

    async queryUsernameByID(id) {
        if (!id) {
            return '';
        }
        try {
            //如果用印登记类型为合同类，则查询最大印章编号，然后按序使用更大的印章编号
            var maxinfo = await superagent.get(`${window.BECONFIG['xmysqlAPI']}/api/bs_hrmresource?_where=(loginid,eq,~${id}~)~and(status,ne,5)&_fields=id,lastname,loginid`).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
            //返回用户信息
            return maxinfo.body[0]['lastname'];
        } catch (error) {
            console.log(error);
            return '';
        }
    },

    async queryUsernameByIDs(ids) {
        try {
            //如果用印登记类型为合同类，则查询最大印章编号，然后按序使用更大的印章编号
            var maxinfo = await superagent.get(`${window.BECONFIG['xmysqlAPI']}/api/bs_hrmresource?_where=(loginid,in,${ids})~and(status,ne,5)`).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
            //返回用户信息
            return maxinfo.body;
        } catch (error) {
            console.log(error);
            return [];
        }
    },

    /**
     * @description 获取当前名字的用户信息
     */
    async queryUserByNameHRM(name, seclevel = 50) {

        let result = [];

        if (tools.isNull(name)) {
            return [];
        }

        try {

            //如果用印登记类型为合同类，则查询最大印章编号，然后按序使用更大的印章编号
            var temp_ = await superagent.get(`${window.BECONFIG['xmysqlAPI']}/api/bs_hrmresource?_where=((lastname,like,~${name}~)~or(loginid,like,~${name}~))~and(status,ne,5)~and(seclevel,lt,${seclevel})`).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');

            result = [...temp_.body];

            //剔除掉，没有loginid的用户信息
            result = result.filter(item => {
                return !tools.isNull(item.loginid);
            })

            //返回用户信息
            return result;

        } catch (error) {
            console.log(error);
        }

    },

    /**
     * @description 获取当前名字的用户信息
     */
    async queryUserByNameVHRM(name, seclevel = 50) {

        let result = [];

        if (tools.isNull(name)) {
            return [];
        }

        try {

            //如果用印登记类型为合同类，则查询最大印章编号，然后按序使用更大的印章编号
            var temp_ = await superagent.get(`${window.BECONFIG['xmysqlAPI']}/api/v_hrmresource?_where=((name,like,~${name}~)~or(userid,like,~${name}~))~and(seclevel,lt,${seclevel})`).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');

            result = [...temp_.body];

            //剔除掉，没有loginid的用户信息
            result = result.filter(item => {
                return !tools.isNull(item.loginid);
            })

            //返回用户信息
            return result;

        } catch (error) {
            console.log(error);
        }

    },

    /**
     * @description 获取当前名字的用户信息
     */
    async queryUserByNameAndMobile(name, mobile, seclevel = 1000) {

        let result = [];

        if (tools.isNull(name)) {
            return [];
        }

        try {

            //如果用印登记类型为合同类，则查询最大印章编号，然后按序使用更大的印章编号
            var temp_ = await superagent.get(`${window.BECONFIG['xmysqlAPI']}/api/v_hrmresource?_where=((name,like,~${name}~)~or(userid,like,~${name}~))~and(mobile,eq,${mobile})~and(seclevel,lt,${seclevel})`).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');

            result = [...temp_.body];

            //剔除掉，没有loginid的用户信息
            result = result.filter(item => {
                return !tools.isNull(item.loginid);
            })

            //返回用户信息
            return result;

        } catch (error) {
            console.log(error);
        }

    },

    /**
     * @description 获取当前名字的用户信息
     */
    async queryUserByNameReward(name, seclevel = 101) {

        let result = [];

        if (tools.isNull(name)) {
            return [];
        }

        try {

            //如果用印登记类型为合同类，则查询最大印章编号，然后按序使用更大的印章编号
            var temp_ = await superagent.get(`${window.BECONFIG['xmysqlAPI']}/api/bs_hrmresource?_where=((lastname,like,~${name}~)~or(loginid,like,~${name}~))~and(seclevel,lt,${seclevel})`).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');

            result = [...temp_.body];

            //剔除掉，没有loginid的用户信息
            result = result.filter(item => {
                return !tools.isNull(item.loginid);
            })

            //返回用户信息
            return result;

        } catch (error) {
            console.log(error);
        }

    },

    /**
     * @description 获取当前名字的用户信息
     */
    async queryUserByLoginID(name, seclevel = 101) {

        let result = [];

        if (tools.isNull(name)) {
            return [];
        }

        try {

            //如果用印登记类型为合同类，则查询最大印章编号，然后按序使用更大的印章编号
            var temp_ = await superagent.get(`${window.BECONFIG['xmysqlAPI']}/api/bs_hrmresource?_where=((loginid,in,${name}))~and(seclevel,lt,${seclevel})&_fields=loginid`).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');

            result = [...temp_.body];

            //剔除掉，没有loginid的用户信息
            result = result.filter(item => {
                return !tools.isNull(item.loginid);
            })

            //返回用户信息
            return result;

        } catch (error) {
            console.log(error);
        }

    },

    /**
     * @description 获取当前名字的用户信息
     */
    async queryUserByID(name, cname = '融量', seclevel = 101) {

        let result = [];

        if (tools.isNull(name)) {
            return [];
        }

        try {

            //如果用印登记类型为合同类，则查询最大印章编号，然后按序使用更大的印章编号
            var temp_ = await superagent.get(`${window.BECONFIG['xmysqlAPI']}/api/v_hrmresource?_where=((loginid,in,${name}))~and(seclevel,lt,${seclevel})~and(cname,eq,${cname})&_sort=id`).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');

            result = [...temp_.body];

            //剔除掉，没有loginid的用户信息
            result = result.filter(item => {
                return !tools.isNull(item.loginid);
            })

            //返回用户信息
            return result;

        } catch (error) {
            console.log(error);
        }

    },

    /**
     * @description 获取当前输入地址信息对应的所有物品管理员所在办公位置
     */
    async queryAddressByName(name) {

        let result = [];
        if (tools.isNull(name)) {
            return [];
        }
        try {
            var temp_ = await superagent.get(`${window.BECONFIG['xmysqlAPI']}/api/bs_admin_group?_where=(groupname,eq,COMMON_RECEIVE_BORROW)~and(address,like,~${name}~)`).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
            result = [...temp_.body];
            return result;
        } catch (error) {
            console.log(error);
        }

    },

    /**
     * @description 获取当前名字的用户信息
     */
    async queryUserByNameFindOne(realname, username) {

        if (tools.isNull(realname) || tools.isNull(username)) {
            return [];
        }

        const queryURL = realname.includes('(') || realname.includes('（') || !/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(realname) ? `${window.BECONFIG['xmysqlAPI']}/api/bs_hrmresource?_where=((loginid,like,~${username}~))~and(status,ne,5)` : `${window.BECONFIG['xmysqlAPI']}/api/bs_hrmresource?_where=((lastname,like,~${realname}~)~and(loginid,like,~${username}~))~and(status,ne,5)`;

        try {
            //如果用印登记类型为合同类，则查询最大印章编号，然后按序使用更大的印章编号
            var maxinfo = await superagent.get(queryURL).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');

            //剔除掉，没有loginid的用户信息
            maxinfo.body = maxinfo.body.filter(item => {
                return !tools.isNull(item.loginid);
            });

            //返回用户信息
            if (maxinfo && maxinfo.body && maxinfo.body.length >= 1) {
                return true;
            } else {
                return false;
            }

        } catch (error) {
            console.log(error);
        }

    },

    /**
     * 查询数据
     * @param {*} tableName
     * @param {*} whereSQL
     */
    async queryTableData(tableName, whereSQL) {
        //大写转小写
        tableName = tableName.toLowerCase();
        var queryURL = `${window.BECONFIG['xmysqlAPI']}/api/${tableName}?${whereSQL}`;

        try {
            var res = await superagent.get(queryURL).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
            return res.body;
        } catch (err) {
            console.log(err);
        }
    },

    /**
     * 查询数据
     * @param {*} tableName
     * @param {*} whereSQL
     */
    async queryTableDataCount(tableName, whereSQL) {
        tableName = tableName.toLowerCase();
        var queryURL = `${window.BECONFIG['xmysqlAPI']}/api/${tableName}/count?${whereSQL}`;
        try {
            var res = await superagent.get(queryURL).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
            return res.body[0]['no_of_rows'];
        } catch (err) {
            console.log(err);
        }
    },

    /**
     * @description 获取当前编号前缀的合同的列表信息
     * @param {*} prefix
     */
    async queryContractInfoByPrefix(prefix) {

        try {
            //构建查询SQL
            const sql = `${window.BECONFIG['xmysqlAPI']}/api/bs_seal_regist?_where=(contract_id,like,${prefix}~)~and(seal_type,eq,合同类)~and(status,in,已用印,已领取,移交前台,已完成,财务归档,档案归档,已归档)&_p=0&_size=8&_sort=-contract_id`;
            //如果用印登记类型为合同类，则查询最大印章编号，然后按序使用更大的印章编号
            var maxinfo = await superagent.get(sql).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
            //返回用户信息
            if (maxinfo && maxinfo.body && maxinfo.body.length >= 1) {
                return maxinfo.body;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }

    },

    /**
     * @description 获取当前编号前缀的合同的列表信息
     * @param {*} prefix
     */
    async queryContractInfoByPrefixAll(prefix) {

        try {
            const month = dayjs().subtract(12, 'months').format('YYYY-MM-DD'); //获取最近12个月对应的日期
            const year = dayjs().subtract('1', 'year').format('YYYY');
            const curYear = dayjs().format('YYYY');

            //构建查询SQL 查询一年内，且不为[dayjs().subtract('1', 'year').format('YYYY')]的数据 
            const sql = `${window.BECONFIG['xmysqlAPI']}/api/bs_seal_regist?_where=((contract_id,like,${prefix}[${curYear}]~)~or(contract_id,like,${prefix}~${curYear}~))~and(contract_id,nlike,~[${year}]~)~and(create_time,gt,${month})~and(seal_type,eq,合同类)~and(status,in,待用印,已退回,已废弃,已用印,已领取,移交前台,已完成,财务归档,档案归档,已归档)&_p=0&_size=3&_sort=-contract_id`;
            //如果用印登记类型为合同类，则查询最大印章编号，然后按序使用更大的印章编号
            const maxinfo = await superagent.get(sql).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');

            //返回用户信息
            if (maxinfo && maxinfo.body && maxinfo.body.length >= 1) {
                return maxinfo.body;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }

    },

    /**
     * @description 获取当前名字的用户信息
     */
    async queryUserBySealData(name) {

        try {
            //如果用印登记类型为合同类，则查询最大印章编号，然后按序使用更大的印章编号
            var maxinfo = await superagent.get(`${window.BECONFIG['xmysqlAPI']}/api/bs_seal_regist?_where=(deal_manager,like,~${name}~)~and(deal_mail,like,~@~)&_size=1&_p=0`).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
            //返回用户信息
            return maxinfo.body[0];
        } catch (error) {
            console.log(error);
        }

    },

    /**
     * @description 获取当前节点是否有知会或者审批节点信息
     */
    async queryCurNodePageType(pageType) {
        //获取页面类型
        var type = tools.queryUrlString('type');

        try {
            //如果审批详情或者知会详情页面，则设置pageType
            if (type == 'workflow' || type == 'notify') {
                //获取当前节点审批流程数据）
                var flag = await queryProcessLogByID(
                    tools.queryUrlString('table_name'),
                    tools.queryUrlString('processLogID')
                );

                //获取当前节点知会流程数据
                if (tools.deNull(flag) == '') {
                    flag = await queryProcessLogInfByID(
                        tools.queryUrlString('table_name'),
                        tools.queryUrlString('processLogID')
                    );
                }

                //获取页面类型
                pageType = tools.deNull(flag) == '' ? 'view' : pageType;
            } else if (type == 'workflowing') {
                //
                console.log('TODO 暂时不做');
            }
        } catch (error) {
            console.log('获取当前节点是否有知会或者审批节点信息异常:' + error);
        }

        //返回pageType
        return pageType;
    },

    /**
     * 根据数据字典中的节点编号，查询到这个节点对应的流程岗位名称
     */
    async queryProcessLogInfByID(tableName, id) {
        //大写转小写
        tableName = tableName.toLowerCase();
        //提交URL
        var queryURL = `${window.BECONFIG['xmysqlAPI']}/api/pr_log_informed?_where=(table_name,eq,${tableName})~and(id,eq,${id})`;

        try {
            var res = await superagent.get(queryURL).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
            console.log(res);
            return res.body[0];
        } catch (err) {
            console.log(err);
        }
    },

    /**
     * 根据数据字典中的节点编号，查询到这个节点对应的流程岗位名称
     */
    async queryProcessLog(tableName, businessID) {
        //大写转小写
        tableName = tableName.toLowerCase();
        //提交URL
        var queryURL = `${window.BECONFIG['xmysqlAPI']}/api/pr_log?_where=(table_name,eq,${tableName})~and(business_data_id,eq,${businessID})&_sort=operate_time`;

        try {
            var res = await superagent.get(queryURL).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
            console.log(res);

            return res.body;
        } catch (err) {
            console.log(err);
        }
    },

    /**
     * 查询流程权责业务信息
     */
    async queryBusinessInfo(tableName, callback) {
        //大写转小写
        tableName = tableName.toLowerCase();
        //查询URL
        var queryURL = `${window.BECONFIG['xmysqlAPI']}/api/pr_rights?_where=(business,like,~${tableName}~)`;

        try {
            var res = await superagent.get(queryURL).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
            console.log(res.body);

            if (
                typeof res != 'undefined' &&
                res.body instanceof Array &&
                res.body.length > 0 &&
                typeof callback != 'undefined'
            ) {
                callback(res.body);
            }

            return JSON.parse(JSON.stringify(res.body));
        } catch (err) {
            console.log(err);
        }
    },

    /**
     * 检测审批是否存在 存在 false  不存在 true
     * @param {*} tableName
     * @param {*} businessID
     */
    async queryApprovalLength(tableName, businessID) {

        //大写转小写
        tableName = tableName.toLowerCase();
        //查询URL GET	/apis/tableName/:id/exists	True or false whether a row exists or not  /apis/tableName/findOne
        var queryURL = `${window.BECONFIG['xmysqlAPI']}/api/pr_log?_where=(table_name,eq,${tableName})~and(business_data_id,eq,${businessID})`;

        //查询标识
        var vflag = false;

        try {
            var res = await superagent.get(queryURL).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');

            vflag = res.body.length;

            return vflag;
        } catch (err) {
            console.log(err);
        }
    },

    /**
     * @description 将当前自由流程的数据转移到历史数据中
     * @param {*} id
     */
    async transFreeWflowHis(id) {

        //定义返回结果
        var result;

        try {

            //获取本表单业务的所有的自由流程数据
            let wflist = await manageAPI.queryHisFreeWorkflow(id);

            //将历史数据插入到历史自由流程表中
            let wcode = await manageAPI.insertTableData("bs_free_process_h", wflist);

            //删除当前自由流程表中历史数据
            result = await manageAPI.deleteTableItem("bs_free_process", wflist);

            //打印返回结果
            console.log("result :" + result + " wcode :" + wcode);


        } catch (error) {
            console.log("transfer free workflow node into history " + error);
        }

        return result;

    },

    /**
     * 更新数据
     * @param {*} tableName
     * @param {*} id
     * @param {*} node
     */
    async patchTableData(tableName, id, node) {

        //大写转小写
        tableName = tableName.toLowerCase();
        //更新URL PATCH	/apis/tableName/:id	Updates row element by primary key
        var patchURL = `${window.BECONFIG['xmysqlAPI']}/api/${tableName}/${id}`;
        var res = null;

        //如果传入数据为空，则直接返回错误
        if (typeof node == 'undefined' || node == null || node == '') {
            return false;
        }

        try {
            node.xid = tools.queryUniqueID();
            res = await superagent.patch(patchURL).send(node).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
        } catch (err) {
            delete node.xid;
            res = await superagent.patch(patchURL).send(node).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
            console.log(err);
        }

        return res.body;
    },

    /**
     * 根据数据字典中的节点编号，查询到这个节点对应的流程岗位名称
     */
    async postProcessLog(node) {
        //提交URL
        var postURL = `${window.BECONFIG['xmysqlAPI']}/api/pr_log`;
        var res = null;

        try {
            node.xid = tools.queryUniqueID();
            res = await superagent.post(postURL).send(node).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
        } catch (err) {
            delete node.xid;
            res = await superagent.post(postURL).send(node).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
            console.log(err);
        }
        return res.body;
    },

    /**
     * 根据数据字典中的节点编号，查询到这个节点对应的流程岗位名称
     */
    async postProcessLogHistory(node) {
        var postURL = null; //提交URL
        var bflag = node instanceof Array && node.length > 1 ? '/bulk' : ''; //是否批处理
        var res = null;

        //如果只有一条数据,则URL中不���要/bulk路径
        try {
            if (node instanceof Array && node.length == 1) {
                bflag = '';
                node = node[0];
            }
        } catch (error) {
            console.log(error);
        }

        //构建流程历史表提交数据的URL
        try {
            postURL = `${window.BECONFIG['xmysqlAPI']}/api/pr_log_history${bflag}`;
        } catch (error) {
            console.log(error);
        }

        //发送post请求，保存数据
        try {
            node.xid = tools.queryUniqueID();
            res = await superagent.post(postURL).send(node).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
        } catch (err) {
            delete node.xid;
            res = await superagent.post(postURL).send(node).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
            console.log(err);
        }

        return res.body;
    },


    /**
     * 根据数据字典中的节点编号，查询到这个节点对应的流程岗位名称
     */
    async deleteProcessLog(tableName, node) {
        //大写转小写
        tableName = tableName.toLowerCase();
        //提交URL
        var deleteURL = '';
        //遍历node,取出里面的ids
        var ids = '';

        //如果node不是数组，则转化为数组
        if (!(node instanceof Array)) {
            node = [node];
        }

        try {
            node.map((item) => {
                ids = ids + ',' + item['id'];
            });

            //去掉开头的逗号
            ids = ids.indexOf(',') == 0 ? ids.substring(1) : ids;
        } catch (error) {
            console.log(error);
        }

        try {
            deleteURL = `${window.BECONFIG['xmysqlAPI']}/api/pr_log/bulk?_ids=${ids}`;
        } catch (error) {
            console.log(error);
        }

        try {
            var res = await superagent.delete(deleteURL).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
            console.log(res);

            return res.body;
        } catch (err) {
            console.log(err);
        }
    },


    /**
     * 根据数据字典中的节点编号，删除到这个节点对应的流程信息
     */
    async deleteProcessLogInf(tableName, node) {
        //大写转小写
        tableName = tableName.toLowerCase();
        //遍历node,取出里面的ids
        var ids = '';
        //提交URL
        var deleteURL = '';

        //如果node不是数组，则转化为数组
        if (!(node instanceof Array)) {
            node = [node];
        }

        try {
            node.map((item) => {
                ids = ids + ',' + item['id'];
            });

            //去掉开头的逗号
            ids = ids.indexOf(',') == 0 ? ids.substring(1) : ids;
        } catch (error) {
            console.log(error);
        }

        try {
            deleteURL = `${window.BECONFIG['xmysqlAPI']}/api/pr_log_informed/bulk?_ids=${ids}`;
        } catch (error) {
            console.log(error);
        }

        try {
            var res = await superagent.delete(deleteURL).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
            console.log(res);

            return res.body;
        } catch (err) {
            console.log(err);
        }
    },

    async queryApprovalExist(tableName, businessID) {

        //大写转小写
        tableName = tableName.toLowerCase();
        //查询URL GET
        var queryURL = `${window.BECONFIG['xmysqlAPI']}/api/pr_log?_where=(table_name,eq,${tableName})~and(business_data_id,eq,${businessID})`;
        //查询标识
        var vflag = false;

        try {
            var res = await superagent.get(queryURL).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
            vflag = res.body.length > 0 ? true : false;
        } catch (err) {
            console.log(err);
        }

        return vflag;
    },

    /**
     * 根据数据字典中的节点编号，查询到这个节点对应的流程岗位名称
     */
    async postProcessFreeNode(node) {
        //提交URL
        var postURL = `${window.BECONFIG['xmysqlAPI']}/api/bs_free_process`;
        var res = null;
        try {
            node.xid = tools.queryUniqueID();
            res = await superagent.post(postURL).send(node).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
        } catch (err) {
            delete node.xid;
            res = await superagent.post(postURL).send(node).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
            console.log(err);
        }
        return res.body;

    },

    /**
     * 查询数据
     * @param {*} tableName
     * @param {*} foreignKey
     * @param {*} id
     */
    async queryTableDataByField(tableName, field, value) {
        //大写转小写
        tableName = tableName.toLowerCase();
        //更新URL PATCH	/apis/tableName/:id	Updates row element by primary key
        var queryURL = `${window.BECONFIG['xmysqlAPI']}/api/${tableName}?_where=(${field},eq,${value})`;

        try {
            var res = await superagent.get(queryURL).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
            return res.body;
        } catch (err) {
            console.log(err);
        }
    },

    /**
     * 首字母大写
     * @param {*} str
     */
    initialUpperCase(str) {
        return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase()); // 执行代码
    },

    /**
     * 查询用户数据
     * @param {*} searchkey
     * @param {*} data
     */
    async queryUserData(searchkey = '', data = []) {
        try {
            if (searchkey && searchkey.length >= 2) {
                data = await Betools.manage.queryTableData('bs_hrmresource', `_where=(status,in,0,1,2,3,4)~and(lastname,like,~${searchkey}~)&_sort=id&_p=0&_size=100`); // 获取最近12个月的已用印记录
                data.map((item, index) => {
                    item.code = item.id;
                    item.tel = '';
                    item.name = item.lastname;
                    item.departName = item.textfield1 && item.textfield1.includes('||') ? item.textfield1.split('||')[1] : '';
                    item.title = `${item.lastname} ${item.departName}`;
                    item.isDefault = false;
                });
                data = data.filter((item, index, self) => {
                    const findex = self.findIndex((element) => {
                        return element.loginid == item.loginid;
                    })
                    return findex == index;
                });
            }
            return data;
        } catch (err) {
            console.log(err);
            return [];
        }
    },

    /**
     * 添加数据
     * @param {*} tableName
     * @param {*} id
     */
    async deleteTableData(tableName, id) {
        //大写转小写
        tableName = tableName.toLowerCase();
        //Post数据的URL地址
        var deleteURL = `${window.BECONFIG['xmysqlAPI']}/api/${tableName}/${id}`;

        try {
            var res = await superagent.delete(deleteURL).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
            return res.body;
        } catch (err) {
            console.log(err);
        }
    },

    /**
     * 执行上锁(分布式锁)
     * @param {*} tableName
     * @param {*} id
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
                    expire_time: dayjs().add(lockMS, 'millisecond').format('YYYY-MM-DD HH:mm:ss'),
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
            for (const item of tempList) {
                await Betools.manage.deleteTableData("bs_lock_info", item.id);
            }
            return true;
        } catch (error) {
            return false;
        }
    },

    // 查询首页图片
    async queryImagesUrl(type = 'APP') {
        try {
            const userinfo = await Betools.storage.getStore('system_userinfo'); //获取当前登录用户信息
            let whereSQL = null; //查询SQL
            let images = await Betools.storage.getStore('system_app_image'); // 获取缓存中的图片
            if (!images) { // 如果存在图片数据，则直接使用图片数据
                whereSQL = userinfo && userinfo.userid == 9058 ? `~and(create_by,eq,zhaoziyu)~and(bpm_status,in,4,5)~and(type,eq,${type})` : `~and(bpm_status,in,4,5)~and(create_by,in,admin,manager)~and(type,eq,${type})`;
                images = await Betools.query.queryTableDataByWhereSQL('bs_home_pictures', `_where=(status,in,3)${whereSQL}&_fields=files&_sort=-id`);
                images.map(item => { item.files = `https://upload.yunwisdom.club:30443/${item.files}`; });
                Betools.storage.setStore('system_app_image', JSON.stringify(images), 3600 * 24 * 3);
            }
            return images;
        } catch (error) {
            console.log(error);
        }
    },

    /**
     * 执行记录日志(分布式锁)
     * @param {*} tableName
     * @param {*} recordID
     */
    async logRecord(tableName, recordID, username = '', processName = '', action = '', actionOpinion = '', content = '', position = '', processStation = '', data = '', businessCode = '000000000') {

        let businessData = '';

        //如果表名或者表单ID不存在，则直接返回
        if (!tableName || !recordID) {
            return false;
        }

        try {
            businessData = JSON.stringify(data);
        } catch (error) {
            businessData = data;
        }

        try {
            //记录 审批人 经办人 审批表单 表单编号 记录编号 操作(同意/驳回) 意见 内容 表单数据
            const prLogHisNode = {
                id: tools.queryUniqueID(),
                table_name: tableName,
                main_value: recordID,
                proponents: username,
                business_data_id: recordID,
                business_code: businessCode,
                process_name: processName,
                employee: username,
                approve_user: username,
                action: action,
                action_opinion: actionOpinion,
                operate_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                functions_station: position,
                process_station: processStation,
                business_data: businessData,
                content: content,
                process_audit: '',
                create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                relate_data: '',
                origin_data: '',
            }

            return await Betools.workflow.approveViewProcessLog(prLogHisNode);
        } catch (error) {
            return false;
        }

    }


};

var manageExports = {
    manage,
}

module.exports = manageExports