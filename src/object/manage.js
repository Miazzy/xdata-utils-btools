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

    /**
     * @description 提交并持久化数据到服务器
     */
    async multiTableData(tableName, node, res = null) {

        //大写转小写
        tableName = tableName.toLowerCase();
        //Post数据的URL地址
        var insertURL = `${window.BECONFIG['xmysqlAPI']}/api/${tableName}/multi`;
        //设置node为value
        const value = node;

        //设置时间格式
        Object.keys(value).map(key => {
            value[key] = key.includes('_time') && value[key] ? dayjs(value[key]).format('YYYY-MM-DD HH:mm:ss') : value[key];
        })

        try {
            node.xid = tools.queryUniqueID();
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
     * 查询数据库某表是否存在field字段为value值的数据
     * @param {*} tableName
     * @param {*} field
     * @param {*} value
     * @param {*} _fields
     */
    async queryTableFieldValue(tableName, field, value, _fields = '') {
        //如果存在查询字段，则拼接语句
        _fields = _fields ? `&_fields=${_fields}` : '';
        //大写转小写
        tableName = tableName.toLowerCase();
        //查询URL GET	/apis/tableName/:id/exists	True or false whether a row exists or not  /apis/tableName/findOne
        var queryURL = `${window.BECONFIG['xmysqlAPI']}/api/${tableName}?_where=(${field},eq,${value})${_fields}`;
        //查询标识
        try {
            var res = await superagent.get(queryURL).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
            return res.body;
        } catch (err) {
            console.log(err);
        }
    },

    /**
     * 查询数据库某表是否存在field字段为value值的数据Count
     * @param {*} tableName
     * @param {*} field
     * @param {*} value
     * @param {*} _fields
     */
    async queryTableFieldValueCount(tableName, field, value, _fields = '') {
        //如果存在查询字段，则拼接语句
        _fields = _fields ? `&_fields=${_fields}` : '';
        //大写转小写
        tableName = tableName.toLowerCase();
        //查询URL GET	/apis/tableName/:id/exists	True or false whether a row exists or not  /apis/tableName/findOne
        var queryURL = `${window.BECONFIG['xmysqlAPI']}/api/${tableName}/count?_where=(${field},eq,${value})${_fields}`;
        //查询标识
        try {
            var res = await superagent.get(queryURL).set('xid', tools.queryUniqueID()).set('id', tools.queryUniqueID()).set('accept', 'json');
            return res.body;
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
            let wcode = await postTableData("bs_free_process_h", wflist);

            //删除当前自由流程表中历史数据
            result = await deleteTableData("bs_free_process", wflist);

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
     * 首字母大写
     * @param {*} str
     */
    prefixUpperCase(str) {
        return String.fromCharCode(str.charCodeAt(0) - 32) + str.slice(1);
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
     * 查询公司数据
     * @param {*} searchkey
     * @param {*} data
     */
    async queryCompanyData(searchkey = '', data = []) {
        try {
            if (searchkey && searchkey.length >= 0) {
                data = await Betools.manage.queryTableData('bs_company_flow_base', `_where=(status,in,0)~and(level,gt,2)~and(name,like,~${searchkey}~)&_sort=id&_p=0&_size=30`); // 获取最近12个月的已用印记录
                data.map((item, index) => {
                    item.title = item.name.slice(0, 24);
                    item.code = item.id;
                    item.tel = '';
                    item.name = item.name;
                    item.isDefault = false;
                });
            }
            return data;
        } catch (error) {
            console.log(err);
            return [];
        }
    },

    /**
     * 查询公司工商数据
     * @param {*} searchkey
     * @param {*} data
     */
    async queryCompanyICData(searchkey = '', data = []) {
        try {
            if (searchkey && searchkey.length >= 0) {
                data = await Betools.manage.queryTableData('bs_company_flow_data', `_where=(companyName,like,~${searchkey}~)&_sort=id&_p=0&_size=30`); // 获取最近12个月的已用印记录
                data.map((item, index) => {
                    item.title = item.companyName.slice(0, 24);
                    item.code = item.id;
                    item.tel = '';
                    item.name = item.companyName;
                    item.isDefault = false;
                });
            }
            return data;
        } catch (error) {
            console.log(err);
            return [];
        }
    },

    /**
     * 查询公司及用户数据
     * @param {*} searchkey
     * @param {*} data
     */
    async queryCompanyAndUserData(searchkey = '', data = []) {
        let list = [];
        try {
            if (searchkey && searchkey.length >= 2) {
                data = await Betools.manage.queryUserData(searchkey, data);
                list.concat(data);
                data = await Betools.manage.queryCompanyData(searchkey, data);
                list.concat(data);
            }
            return list;
        } catch (error) {
            console.log(err);
            return [];
        }
    },

    /**
     * 查询公司及用户数据
     * @param {*} searchkey
     * @param {*} data
     */
    async queryCommonData(searchkey = '', data = [], type = 'company' /** company|user */ ) {
        let list = [];
        try {
            if (searchkey && searchkey.length >= 2) {
                if (type == 'user') {
                    data = await Betools.manage.queryUserData(searchkey, data);
                    list.concat(data);
                }
                if (type == 'company') {
                    data = await Betools.manage.queryCompanyData(searchkey, data);
                    list.concat(data);
                }
                if (type == 'company_ic') {
                    data = await Betools.manage.queryCompanyICData(searchkey, data);
                    list.concat(data);
                }
            }
            return list;
        } catch (error) {
            console.log(err);
            return [];
        }
    },

    /**
     * 股权管理平台查询用户数据
     * @param {*} data
     * @param {*} value
     * @param {*} key
     * @param {*} fieldKey
     */
    async commonStockSearch(data, value, key, fieldKey, state) {
        const searchkey = value[key];
        data = await Betools.manage.queryUserData(searchkey, []);
        state.tag['show' + Betools.manage.prefixUpperCase(fieldKey)] = true;
        state.tag.showKey = key;
        state[fieldKey + 'Columns'] = data;
    },

    /**
     * 股权管理平台查询用户数据
     * @param {*} data
     * @param {*} value
     * @param {*} key
     * @param {*} fieldKey
     */
    async commonUserSearch(data, value, key, fieldKey, state) {
        const searchkey = value[key];
        data = await Betools.manage.queryUserData(searchkey, []);
        state.tag['show' + Betools.manage.prefixUpperCase(fieldKey)] = true;
        state.tag.showKey = key;
        state[fieldKey + 'Columns'] = data;
    },

    /**
     * 股权管理平台查询公司数据
     * @param {*} data
     * @param {*} value
     * @param {*} key
     * @param {*} fieldKey
     */
    async commonCompanySearch(data, value, key, fieldKey, state) {
        const searchkey = value[key];
        data = await Betools.manage.queryCompanyData(searchkey, []);
        state.tag['show' + Betools.manage.prefixUpperCase(fieldKey)] = true;
        state.tag.showKey = key;
        state[fieldKey + 'Columns'] = data;
    },

    /**
     * 股权管理平台查询公司/用户数据
     * @param {*} data
     * @param {*} value
     * @param {*} key
     * @param {*} fieldKey
     */
    async commonDataSearch(data, value, key, fieldKey, state, type = 'company') {
        const searchkey = value[key];
        if (type == 'company') {
            data = await Betools.manage.queryCompanyData(searchkey, []);
        } else if (type == 'user') {
            data = await Betools.manage.queryUserData(searchkey, []);
        } else if (type == 'company_ic') {
            data = await Betools.manage.queryCompanyICData(searchkey, []);
        }
        state.tag['show' + Betools.manage.prefixUpperCase(fieldKey)] = true;
        state.tag.showKey = key;
        state[fieldKey + 'Columns'] = data;
    },

    /**
     * 股权管理平台查询公司/用户数据确认
     * @param {*} index
     * @param {*} value
     * @param {*} key
     * @param {*} item
     */
    async commonDataConfirm(index, value, key, item, state, Dialog, type = 'company') {

        state.radio[key] = index;

        if (value && !Betools.tools.isNull(value['lastname'])) {
            item[key.replace(/Name/g, '')] = item[key] = value['lastname']
        } else if (value && !Betools.tools.isNull(value['name'])) {
            item[key.replace(/Name/g, '')] = item[key] = value['name']
        } else {
            item[key.replace(/Name/g, '')] = item[key] = value;
        }
        state.tag['show' + Betools.manage.prefixUpperCase(key)] = false;

        if (key == 'companyName' && type == 'company') {
            //检查公司名是否已经存在 //校验公司名称,如果已经存在此公司名称，需要给出提示
            const companyNameCount = await Betools.manage.queryTableFieldValueCount('bs_company_flow_data', 'companyName', state.item.companyName);
            if (companyNameCount && companyNameCount.length > 0 && companyNameCount[0]['no_of_rows'] > 0) {
                Dialog.confirm({
                    title: '温馨提示',
                    message: '已经存在此公司的基础数据，请勿重复提交！',
                });
                item[key.replace(/Name/g, '')] = item[key] = '';
            }
        }

    },

    /**
     * 搜索公司信息
     * @param {*} data 
     * @param {*} key 
     * @param {*} time 
     * @param {*} curtime 
     * @param {*} cacheKey 
     */
    async companySearch(data, key, time, curtime = new Date().getTime() / 1000, cacheKey = 'system_app_home_company_data', state) {
        time = Betools.storage.getStore(`${cacheKey}_expire`) || 0;
        data = Betools.storage.getStore(`${cacheKey}`);
        //如果缓存中没有获取到数据，则直接查询服务器
        if (Betools.tools.isNull(data) || data.length == 0) {
            data = await companySearchData(data, key, cacheKey);
            console.log(`storage cache : ${curtime}`);
        }
        //如果存在state,则设置state属性
        if (state) {
            state.companyColumns = data;
        }
        //如果缓存时间快到期，则重新查询数据
        if ((time - 3600 * 23.95) < curtime) {
            data = await companySearchData(data, key, cacheKey);
            console.log(`refresh cache : ${curtime}`);
        }
        return data;
    },

    /**
     * 查询公司工商数据
     * @param {*} data 
     * @param {*} key 
     * @param {*} cacheKey 
     * @returns 
     */
    async companySearchData(data, key, cacheKey) {
        data = await Betools.manage.queryTableData('bs_company_flow_data', `_where=(companyName,like,~${key}~)&_sort=-id&_p=0&_size=30`); // 获取最近12个月的已用印记录
        data.map(item => {
            item.establish_time = dayjs(item.establish_time).format('YYYY-MM-DD');
        });
        Betools.storage.setStore(`${cacheKey}`, JSON.stringify(data), 3600 * 24 * 31);
        return data;
    },

    /**
     * 取消函数
     * @param {*} Dialog 
     * @param {*} returnBack 
     * @param {*} title 
     */
    async cancelAndBack(Dialog, returnBack, title) {
        Dialog.confirm({
            title: title,
            message: '点击‘确认’后返回上一页',
        }).then(() => { // on confirm
            returnBack();
        });
    },

    //数据校验
    async checkDataCompanyAdd(element, type) {
        if (type == 'company') {
            //校验公司名称,如果已经存在此公司名称，需要给出提示
            //校验所属行业
            //校验所属区域
            //校验登记状态
            //校验营业执照
            //校验经营范围
            //校验注册地址
            //校验注册资本
            //校验实缴资本
            //校验营业期限
            //校验公司类型
            //校验设立原因
            //校验使用情况
            //校验法人代表
            //校验印章保管人
            //校验备案联络员
            //校验财务负责人
            //校验备注信息
        } else if (type == 'director') {
            //校验董事长
            //校验董事
            //校验执行董事
            //校验总经理
            //校验监事会主席
            //校验监事
        } else if (type == 'stock') {
            //如果没有数据，则提交股东信息
            //如果有数据，校验股东信息及占股比例
        }
    },

    /**
     * 确认函数 CompanyAdd
     * @param {*} elem 
     * @param {*} result 
     * @param {*} validResult 
     * @param {*} response 
     */
    async confirmCompanyAdd(elem, result, validResult, response, state, Dialog) {
        let companyNodes = [];
        let linkNodes = [];
        let stockNodes = [];
        let managerNodes = [];

        // 获取用户信息
        const userinfo = await Betools.storage.getStore('system_userinfo');

        const company = state.companyNameColumns.find((item) => { return item.name == state.item.companyName });
        elem = {
            id: Betools.tools.queryUniqueID(),
            baseID: company.id,
            ...state.item,
            ...state.director,
            ...state.stock,
        };
        companyNodes.push(elem);
        console.log(`element:`, JSON.stringify(elem));

        Dialog.confirm({
            title: '确认提交设立公司申请？',
            message: '点击‘确认’后提交申请',
        }).then(async() => { // on confirm

            try {
                //第一步，执行数据校验
                console.log(`第一步，执行数据校验`);
                validResult = await Betools.manage.checkDataCompanyAdd(elem, 'company');

                //第二步，检查是否有股东信息，如果有股东、董监高信息，则需要提交股东、董监高信息
                console.log(`第二步，检查是否有股东信息，如果有股东、董监高信息，则需要提交股东、董监高信息`);

                //检查股东信息
                if (state.stock) {
                    for (let i = 0; i < 20;) {
                        if (state.stock && state.stock['shareholder' + i]) {
                            //设置股权关系，即股东A 持有 公司B 多少比例 股权
                            const ratio = {
                                    id: Betools.tools.queryUniqueID(),
                                    from_id: state.stock['shareholder' + i],
                                    to_id: company.id,
                                    from_company: state.stock['shareholder' + i],
                                    to_company: elem.companyName,
                                    label: state.stock['ratioDetail' + i],
                                    linkStatus: 0,
                                }
                                //设置stock信息，即公司A拥有股东B
                            const element = {
                                id: Betools.tools.queryUniqueID(),
                                pid: elem.id,
                                baseID: company.id,
                                shareholder: state.stock['shareholder' + i],
                                ratioDetail: state.stock['ratioDetail' + i],
                                type: '100',
                                typeName: 'shareholder',
                                companyName: elem.companyName,
                            }
                            linkNodes.push(ratio);
                            stockNodes.push(element);
                        }
                        i++;
                    }
                }

                //检查董监高信息
                if (state.director && (state.director.supervisor || state.director.manager || state.director.supervisorChairman || state.director.director || state.director.directorExecutive || state.director.directorChairman)) {

                    //设置stock信息，即公司A拥有董监高B //类型 100 股东 200 董事长 300 董事 400 执行董事 500 总经理 600 监事会主席 700 监事 800 法人代表
                    for (let name in state.director) {
                        const element = {
                            id: Betools.tools.queryUniqueID(),
                            pid: elem.id,
                            baseID: company.id,
                            managerName: state.director[name],
                            type: state.type[name],
                            typeName: name,
                            positionName: state.position[name],
                            companyName: elem.companyName,
                        }
                        managerNodes.push(element);
                    }
                }

                //需要提交的表单数据
                const multiElement = {
                    'tname': 'bs_company_flow_data,bs_company_flow_link,bs_company_flow_stock,bs_company_flow_manager',
                    'bs_company_flow_data': companyNodes,
                    'bs_company_flow_link': linkNodes,
                    'bs_company_flow_stock': stockNodes,
                    'bs_company_flow_manager': managerNodes,
                };

                //第三步，向表单提交form对象数据
                console.log(`第三步，向表单提交form对象数据`);
                result = await Betools.manage.multiTableData('bs_dynamic', multiElement);
                await Betools.tools.sleep(Math.random() * 10);

                //第四步，如果返回信息成功，则提示用户申请成功
                if (result.protocol41 == true && result.affectedRows > 0) {
                    console.log(`如果返回信息成功，则提示用户申请成功`);
                    await Dialog.confirm({
                        title: '设立公司申请提交成功！',
                    });
                } else {
                    await Dialog.confirm({
                        title: `设立公司申请失败，请检查是否已提交过此公司申请，Error:[${JSON.stringify(result)}]！`,
                    });
                }
            } catch (error) {
                console.log(error);
            }
        });
    },

    /**
     * 下一步函数 CompanyAdd
     * @param {*} state 
     * @param {*} checkValid 
     * @param {*} Dialog 
     * @param {*} confirm 
     */
    async nextstepCompanyAdd(state, checkValid, Dialog, confirm) {
        if (state.step == 'one') {
            //此次校验，公司基础信息是否填写完整
            const invalidKeys = checkValid(state.item);
            if (Betools.tools.isNull(invalidKeys)) {
                state.step = 'two'
            } else {
                Dialog.confirm({
                    title: '请填写完公司设立信息后进行下一步！',
                    message: `请检查缺失信息：${invalidKeys}`
                })
            }
        } else if (state.step == 'two') {
            //此次校验，公司的董事信息是否填写完整
            const invalidKeys = checkValid(state.director);
            if (Betools.tools.isNull(invalidKeys)) {
                state.step = 'three'
            } else {
                Dialog.confirm({
                    title: '请填写完公司董事信息后进行下一步！',
                    message: `请检查缺失信息：${invalidKeys}`
                })
            }
        } else if (state.step == 'three') {
            const elem = {
                id: Betools.tools.queryUniqueID(),
                ...state.item,
                ...state.director
            };
            console.log(`elemnt:`, JSON.stringify(elem));
            await confirm(elem, null, null);
        }
    },

    /**
     * 上一步函数
     * @param {*} state 
     * @param {*} cancel 
     */
    async prestepCompanyAdd(state, cancel) {
        if (state.step == 'three') {
            state.step = 'two'
        } else if (state.step == 'two') {
            state.step = 'one'
        } else if (state.stop == 'one') {
            await cancel();
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
     * 获取城市数据
     */
    async queryCity(data = null) {
        data = await Betools.storage.getStore(`system_city_data`);
        if (Betools.tools.isNull(data) || data.length == 0) {
            const options = [{
                "text": "安徽省",
                "value": "安徽省",
                "children": [{ "text": "安庆市", "children": [{ "text": "大观区" }, { "text": "怀宁县" }, { "text": "潜山市" }, { "text": "宿松县" }, { "text": "太湖县" }, { "text": "桐城市" }, { "text": "望江县" }, { "text": "迎江区" }, { "text": "宜秀区" }, { "text": "岳西县" }] }, { "text": "蚌埠市", "children": [{ "text": "蚌山区" }, { "text": "固镇县" }, { "text": "淮上区" }, { "text": "怀远县" }, { "text": "龙子湖区" }, { "text": "五河县" }, { "text": "禹会区" }] }, { "text": "亳州市", "children": [{ "text": "利辛县" }, { "text": "蒙城县" }, { "text": "谯城区" }, { "text": "涡阳县" }] }, { "text": "池州市", "children": [{ "text": "东至县" }, { "text": "贵池区" }, { "text": "青阳县" }, { "text": "石台县" }] }, { "text": "滁州市", "children": [{ "text": "定远县" }, { "text": "凤阳县" }, { "text": "来安县" }, { "text": "琅琊区" }, { "text": "明光市" }, { "text": "南谯区" }, { "text": "全椒县" }, { "text": "天长市" }] }, { "text": "阜阳市", "children": [{ "text": "阜南县" }, { "text": "界首市" }, { "text": "临泉县" }, { "text": "太和县" }, { "text": "颍东区" }, { "text": "颍泉区" }, { "text": "颍上县" }, { "text": "颍州区" }] }, { "text": "合肥市", "children": [{ "text": "包河区" }, { "text": "长丰县" }, { "text": "巢湖市" }, { "text": "肥东县" }, { "text": "肥西县" }, { "text": "庐江县" }, { "text": "庐阳区" }, { "text": "蜀山区" }, { "text": "瑶海区" }] }, { "text": "淮北市", "children": [{ "text": "杜集区" }, { "text": "烈山区" }, { "text": "濉溪县" }, { "text": "相山区" }] }, { "text": "淮南市", "children": [{ "text": "八公山区" }, { "text": "大通区" }, { "text": "凤台县" }, { "text": "潘集区" }, { "text": "寿县" }, { "text": "田家庵区" }, { "text": "谢家集区" }] }, { "text": "黄山市", "children": [{ "text": "黄山区" }, { "text": "徽州区" }, { "text": "祁门县" }, { "text": "屯溪区" }, { "text": "歙县" }, { "text": "休宁县" }, { "text": "黟县" }] }, { "text": "六安市", "children": [{ "text": "霍邱县" }, { "text": "霍山县" }, { "text": "金安区" }, { "text": "金寨县" }, { "text": "舒城县" }, { "text": "叶集区" }, { "text": "裕安区" }] }, { "text": "马鞍山市", "children": [{ "text": "博望区" }, { "text": "当涂县" }, { "text": "含山县" }, { "text": "和县" }, { "text": "花山区" }, { "text": "雨山区" }] }, { "text": "宿州市", "children": [{ "text": "砀山县" }, { "text": "灵璧县" }, { "text": "埇桥区" }, { "text": "泗县" }, { "text": "萧县" }] }, { "text": "铜陵市", "children": [{ "text": "枞阳县" }, { "text": "郊区" }, { "text": "铜官区" }, { "text": "义安区" }] }, { "text": "芜湖市", "children": [{ "text": "繁昌县" }, { "text": "镜湖区" }, { "text": "南陵县" }, { "text": "鸠江区" }, { "text": "三山区" }, { "text": "芜湖县" }, { "text": "无为县" }, { "text": "弋江区" }] }, { "text": "宣城市", "children": [{ "text": "广德县" }, { "text": "旌德县" }, { "text": "泾县" }, { "text": "绩溪县" }, { "text": "郎溪县" }, { "text": "宁国市" }, { "text": "宣州区" }] }]
            }, {
                "text": "澳门特别行政区",
                "value": "澳门特别行政区",
                "children": [{ "text": "澳门城区", "children": [{ "text": "大堂区" }, { "text": "风顺堂区" }, { "text": "花地玛堂区" }, { "text": "花王堂区" }, { "text": "嘉模堂区" }, { "text": "路凼填海区" }, { "text": "圣方济各堂区" }, { "text": "望德堂区" }] }]
            }, {
                "text": "北京市",
                "value": "北京市",
                "children": [{ "text": "北京城区", "children": [{ "text": "昌平区" }, { "text": "朝阳区" }, { "text": "大兴区" }, { "text": "东城区" }, { "text": "房山区" }, { "text": "丰台区" }, { "text": "海淀区" }, { "text": "怀柔区" }, { "text": "门头沟区" }, { "text": "密云区" }, { "text": "平谷区" }, { "text": "石景山区" }, { "text": "顺义区" }, { "text": "通州区" }, { "text": "西城区" }, { "text": "延庆区" }] }]
            }, {
                "text": "重庆市",
                "value": "重庆市",
                "children": [{ "text": "重庆城区", "children": [{ "text": "巴南区" }, { "text": "北碚区" }, { "text": "璧山区" }, { "text": "长寿区" }, { "text": "大渡口区" }, { "text": "大足区" }, { "text": "涪陵区" }, { "text": "合川区" }, { "text": "江北区" }, { "text": "江津区" }, { "text": "九龙坡区" }, { "text": "开州区" }, { "text": "梁平区" }, { "text": "南岸区" }, { "text": "南川区" }, { "text": "黔江区" }, { "text": "綦江区" }, { "text": "荣昌区" }, { "text": "沙坪坝区" }, { "text": "铜梁区" }, { "text": "潼南区" }, { "text": "万州区" }, { "text": "武隆区" }, { "text": "永川区" }, { "text": "渝北区" }, { "text": "渝中区" }] }, { "text": "重庆郊县", "children": [{ "text": "城口县" }, { "text": "垫江县" }, { "text": "丰都县" }, { "text": "奉节县" }, { "text": "彭水苗族土家族自治县" }, { "text": "石柱土家族自治县" }, { "text": "巫山县" }, { "text": "巫溪县" }, { "text": "秀山土家族苗族自治县" }, { "text": "酉阳土家族苗族自治县" }, { "text": "云阳县" }, { "text": "忠县" }] }]
            }, {
                "text": "福建省",
                "value": "福建省",
                "children": [{ "text": "福州市", "children": [{ "text": "仓山区" }, { "text": "长乐区" }, { "text": "福清市" }, { "text": "鼓楼区" }, { "text": "晋安区" }, { "text": "连江县" }, { "text": "罗源县" }, { "text": "马尾区" }, { "text": "闽侯县" }, { "text": "闽清县" }, { "text": "平潭县" }, { "text": "台江区" }, { "text": "永泰县" }] }, { "text": "龙岩市", "children": [{ "text": "长汀县" }, { "text": "连城县" }, { "text": "上杭县" }, { "text": "武平县" }, { "text": "新罗区" }, { "text": "永定区" }, { "text": "漳平市" }] }, { "text": "南平市", "children": [{ "text": "光泽县" }, { "text": "建瓯市" }, { "text": "建阳区" }, { "text": "浦城县" }, { "text": "邵武市" }, { "text": "顺昌县" }, { "text": "松溪县" }, { "text": "武夷山市" }, { "text": "延平区" }, { "text": "政和县" }] }, { "text": "宁德市", "children": [{ "text": "福安市" }, { "text": "福鼎市" }, { "text": "古田县" }, { "text": "蕉城区" }, { "text": "屏南县" }, { "text": "寿宁县" }, { "text": "霞浦县" }, { "text": "柘荣县" }, { "text": "周宁县" }] }, { "text": "莆田市", "children": [{ "text": "城厢区" }, { "text": "涵江区" }, { "text": "荔城区" }, { "text": "仙游县" }, { "text": "秀屿区" }] }, { "text": "泉州市", "children": [{ "text": "安溪县" }, { "text": "德化县" }, { "text": "丰泽区" }, { "text": "惠安县" }, { "text": "晋江市" }, { "text": "金门县" }, { "text": "鲤城区" }, { "text": "洛江区" }, { "text": "南安市" }, { "text": "泉港区" }, { "text": "石狮市" }, { "text": "永春县" }] }, { "text": "三明市", "children": [{ "text": "大田县" }, { "text": "将乐县" }, { "text": "建宁县" }, { "text": "梅列区" }, { "text": "明溪县" }, { "text": "宁化县" }, { "text": "清流县" }, { "text": "三元区" }, { "text": "沙县" }, { "text": "泰宁县" }, { "text": "永安市" }, { "text": "尤溪县" }] }, { "text": "厦门市", "children": [{ "text": "海沧区" }, { "text": "湖里区" }, { "text": "集美区" }, { "text": "思明区" }, { "text": "同安区" }, { "text": "翔安区" }] }, { "text": "漳州市", "children": [{ "text": "长泰县" }, { "text": "东山县" }, { "text": "华安县" }, { "text": "龙海市" }, { "text": "龙文区" }, { "text": "南靖县" }, { "text": "平和县" }, { "text": "芗城区" }, { "text": "云霄县" }, { "text": "漳浦县" }, { "text": "诏安县" }] }]
            }, {
                "text": "甘肃省",
                "value": "甘肃省",
                "children": [{ "text": "白银市", "children": [{ "text": "白银区" }, { "text": "会宁县" }, { "text": "景泰县" }, { "text": "靖远县" }, { "text": "平川区" }] }, { "text": "定西市", "children": [{ "text": "安定区" }, { "text": "临洮县" }, { "text": "陇西县" }, { "text": "岷县" }, { "text": "通渭县" }, { "text": "渭源县" }, { "text": "漳县" }] }, { "text": "甘南藏族自治州", "children": [{ "text": "迭部县" }, { "text": "合作市" }, { "text": "临潭县" }, { "text": "碌曲县" }, { "text": "玛曲县" }, { "text": "夏河县" }, { "text": "舟曲县" }, { "text": "卓尼县" }] }, { "text": "嘉峪关市", "children": [{ "text": "长城区" }, { "text": "镜铁区" }, { "text": "文殊镇" }, { "text": "新城镇" }, { "text": "雄关区" }, { "text": "峪泉镇" }] }, { "text": "金昌市", "children": [{ "text": "金川区" }, { "text": "永昌县" }] }, { "text": "酒泉市", "children": [{ "text": "阿克塞哈萨克族自治县" }, { "text": "敦煌市" }, { "text": "瓜州县" }, { "text": "金塔县" }, { "text": "肃北蒙古族自治县" }, { "text": "肃州区" }, { "text": "玉门市" }] }, { "text": "兰州市", "children": [{ "text": "安宁区" }, { "text": "城关区" }, { "text": "皋兰县" }, { "text": "红古区" }, { "text": "七里河区" }, { "text": "西固区" }, { "text": "永登县" }, { "text": "榆中县" }] }, { "text": "临夏回族自治州", "children": [{ "text": "东乡族自治县" }, { "text": "广河县" }, { "text": "和政县" }, { "text": "积石山保安族东乡族撒拉族自治县" }, { "text": "康乐县" }, { "text": "临夏市" }, { "text": "临夏县" }, { "text": "永靖县" }] }, { "text": "陇南市", "children": [{ "text": "成县" }, { "text": "宕昌县" }, { "text": "徽县" }, { "text": "康县" }, { "text": "两当县" }, { "text": "礼县" }, { "text": "文县" }, { "text": "武都区" }, { "text": "西和县" }] }, { "text": "平凉市", "children": [{ "text": "崇信县" }, { "text": "华亭市" }, { "text": "泾川县" }, { "text": "静宁县" }, { "text": "崆峒区" }, { "text": "灵台县" }, { "text": "庄浪县" }] }, { "text": "庆阳市", "children": [{ "text": "合水县" }, { "text": "华池县" }, { "text": "环县" }, { "text": "宁县" }, { "text": "庆城县" }, { "text": "西峰区" }, { "text": "正宁县" }, { "text": "镇原县" }] }, { "text": "天水市", "children": [{ "text": "甘谷县" }, { "text": "麦积区" }, { "text": "秦安县" }, { "text": "清水县" }, { "text": "秦州区" }, { "text": "武山县" }, { "text": "张家川回族自治县" }] }, { "text": "武威市", "children": [{ "text": "古浪县" }, { "text": "凉州区" }, { "text": "民勤县" }, { "text": "天祝藏族自治县" }] }, { "text": "张掖市", "children": [{ "text": "甘州区" }, { "text": "高台县" }, { "text": "临泽县" }, { "text": "民乐县" }, { "text": "山丹县" }, { "text": "肃南裕固族自治县" }] }]
            }, {
                "text": "广东省",
                "value": "广东省",
                "children": [{ "text": "潮州市", "children": [{ "text": "潮安区" }, { "text": "饶平县" }, { "text": "湘桥区" }] }, { "text": "东莞市", "children": [{ "text": "长安镇" }, { "text": "常平镇" }, { "text": "茶山镇" }, { "text": "大朗镇" }, { "text": "大岭山镇" }, { "text": "道滘镇" }, { "text": "东城街道" }, { "text": "东莞生态园" }, { "text": "东坑镇" }, { "text": "凤岗镇" }, { "text": "高埗镇" }, { "text": "莞城街道" }, { "text": "横沥镇" }, { "text": "洪梅镇" }, { "text": "厚街镇" }, { "text": "黄江镇" }, { "text": "虎门港管委会" }, { "text": "虎门镇" }, { "text": "寮步镇" }, { "text": "麻涌镇" }, { "text": "南城街道" }, { "text": "桥头镇" }, { "text": "清溪镇" }, { "text": "企石镇" }, { "text": "沙田镇" }, { "text": "石碣镇" }, { "text": "石龙镇" }, { "text": "石排镇" }, { "text": "松山湖管委会" }, { "text": "塘厦镇" }, { "text": "望牛墩镇" }, { "text": "万江街道" }, { "text": "谢岗镇" }, { "text": "樟木头镇" }, { "text": "中堂镇" }] }, { "text": "东沙群岛", "children": [{ "text": "东沙群岛" }] }, { "text": "佛山市", "children": [{ "text": "禅城区" }, { "text": "高明区" }, { "text": "南海区" }, { "text": "三水区" }, { "text": "顺德区" }] }, { "text": "广州市", "children": [{ "text": "白云区" }, { "text": "从化区" }, { "text": "番禺区" }, { "text": "海珠区" }, { "text": "花都区" }, { "text": "黄埔区" }, { "text": "荔湾区" }, { "text": "南沙区" }, { "text": "天河区" }, { "text": "越秀区" }, { "text": "增城区" }] }, { "text": "河源市", "children": [{ "text": "东源县" }, { "text": "和平县" }, { "text": "连平县" }, { "text": "龙川县" }, { "text": "源城区" }, { "text": "紫金县" }] }, { "text": "惠州市", "children": [{ "text": "博罗县" }, { "text": "惠城区" }, { "text": "惠东县" }, { "text": "惠阳区" }, { "text": "龙门县" }] }, { "text": "江门市", "children": [{ "text": "恩平市" }, { "text": "鹤山市" }, { "text": "江海区" }, { "text": "开平市" }, { "text": "蓬江区" }, { "text": "台山市" }, { "text": "新会区" }] }, { "text": "揭阳市", "children": [{ "text": "惠来县" }, { "text": "揭东区" }, { "text": "揭西县" }, { "text": "普宁市" }, { "text": "榕城区" }] }, { "text": "茂名市", "children": [{ "text": "电白区" }, { "text": "高州市" }, { "text": "化州市" }, { "text": "茂南区" }, { "text": "信宜市" }] }, { "text": "梅州市", "children": [{ "text": "大埔县" }, { "text": "丰顺县" }, { "text": "蕉岭县" }, { "text": "梅江区" }, { "text": "梅县区" }, { "text": "平远县" }, { "text": "五华县" }, { "text": "兴宁市" }] }, { "text": "清远市", "children": [{ "text": "佛冈县" }, { "text": "连南瑶族自治县" }, { "text": "连山壮族瑶族自治县" }, { "text": "连州市" }, { "text": "清城区" }, { "text": "清新区" }, { "text": "阳山县" }, { "text": "英德市" }] }, { "text": "汕头市", "children": [{ "text": "潮南区" }, { "text": "潮阳区" }, { "text": "澄海区" }, { "text": "濠江区" }, { "text": "金平区" }, { "text": "龙湖区" }, { "text": "南澳县" }] }, { "text": "汕尾市", "children": [{ "text": "城区" }, { "text": "海丰县" }, { "text": "陆丰市" }, { "text": "陆河县" }] }, { "text": "韶关市", "children": [{ "text": "浈江区" }, { "text": "乐昌市" }, { "text": "南雄市" }, { "text": "曲江区" }, { "text": "仁化县" }, { "text": "乳源瑶族自治县" }, { "text": "始兴县" }, { "text": "翁源县" }, { "text": "武江区" }, { "text": "新丰县" }] }, { "text": "深圳市", "children": [{ "text": "宝安区" }, { "text": "福田区" }, { "text": "光明区" }, { "text": "龙岗区" }, { "text": "龙华区" }, { "text": "罗湖区" }, { "text": "南山区" }, { "text": "坪山区" }, { "text": "盐田区" }] }, { "text": "阳江市", "children": [{ "text": "江城区" }, { "text": "阳春市" }, { "text": "阳东区" }, { "text": "阳西县" }] }, { "text": "云浮市", "children": [{ "text": "罗定市" }, { "text": "新兴县" }, { "text": "云安区" }, { "text": "郁南县" }, { "text": "云城区" }] }, { "text": "湛江市", "children": [{ "text": "赤坎区" }, { "text": "雷州市" }, { "text": "廉江市" }, { "text": "麻章区" }, { "text": "坡头区" }, { "text": "遂溪县" }, { "text": "吴川市" }, { "text": "霞山区" }, { "text": "徐闻县" }] }, { "text": "肇庆市", "children": [{ "text": "德庆县" }, { "text": "鼎湖区" }, { "text": "端州区" }, { "text": "封开县" }, { "text": "高要区" }, { "text": "广宁县" }, { "text": "怀集县" }, { "text": "四会市" }] }, { "text": "中山市", "children": [{ "text": "板芙镇" }, { "text": "大涌镇" }, { "text": "东凤镇" }, { "text": "东区街道" }, { "text": "东升镇" }, { "text": "阜沙镇" }, { "text": "港口镇" }, { "text": "古镇镇" }, { "text": "横栏镇" }, { "text": "黄圃镇" }, { "text": "火炬开发区街道" }, { "text": "民众镇" }, { "text": "南朗镇" }, { "text": "南区街道" }, { "text": "南头镇" }, { "text": "三角镇" }, { "text": "三乡镇" }, { "text": "沙溪镇" }, { "text": "神湾镇" }, { "text": "石岐区街道" }, { "text": "坦洲镇" }, { "text": "五桂山街道" }, { "text": "小榄镇" }, { "text": "西区街道" }] }, { "text": "珠海市", "children": [{ "text": "斗门区" }, { "text": "金湾区" }, { "text": "香洲区" }] }]
            }, {
                "text": "广西壮族自治区",
                "value": "广西壮族自治区",
                "children": [{ "text": "百色市", "children": [{ "text": "德保县" }, { "text": "靖西市" }, { "text": "乐业县" }, { "text": "凌云县" }, { "text": "隆林各族自治县" }, { "text": "那坡县" }, { "text": "平果县" }, { "text": "田东县" }, { "text": "田林县" }, { "text": "田阳县" }, { "text": "西林县" }, { "text": "右江区" }] }, { "text": "北海市", "children": [{ "text": "海城区" }, { "text": "合浦县" }, { "text": "铁山港区" }, { "text": "银海区" }] }, { "text": "崇左市", "children": [{ "text": "大新县" }, { "text": "扶绥县" }, { "text": "江州区" }, { "text": "龙州县" }, { "text": "宁明县" }, { "text": "凭祥市" }, { "text": "天等县" }] }, { "text": "防城港市", "children": [{ "text": "东兴市" }, { "text": "防城区" }, { "text": "港口区" }, { "text": "上思县" }] }, { "text": "贵港市", "children": [{ "text": "港北区" }, { "text": "港南区" }, { "text": "桂平市" }, { "text": "平南县" }, { "text": "覃塘区" }] }, { "text": "桂林市", "children": [{ "text": "叠彩区" }, { "text": "恭城瑶族自治县" }, { "text": "灌阳县" }, { "text": "灵川县" }, { "text": "临桂区" }, { "text": "荔浦市" }, { "text": "龙胜各族自治县" }, { "text": "平乐县" }, { "text": "七星区" }, { "text": "全州县" }, { "text": "象山区" }, { "text": "兴安县" }, { "text": "秀峰区" }, { "text": "阳朔县" }, { "text": "雁山区" }, { "text": "永福县" }, { "text": "资源县" }] }, { "text": "河池市", "children": [{ "text": "巴马瑶族自治县" }, { "text": "大化瑶族自治县" }, { "text": "东兰县" }, { "text": "都安瑶族自治县" }, { "text": "凤山县" }, { "text": "环江毛南族自治县" }, { "text": "金城江区" }, { "text": "罗城仫佬族自治县" }, { "text": "南丹县" }, { "text": "天峨县" }, { "text": "宜州区" }] }, { "text": "贺州市", "children": [{ "text": "八步区" }, { "text": "富川瑶族自治县" }, { "text": "平桂区" }, { "text": "昭平县" }, { "text": "钟山县" }] }, { "text": "来宾市", "children": [{ "text": "合山市" }, { "text": "金秀瑶族自治县" }, { "text": "武宣县" }, { "text": "象州县" }, { "text": "忻城县" }, { "text": "兴宾区" }] }, { "text": "柳州市", "children": [{ "text": "城中区" }, { "text": "柳北区" }, { "text": "柳城县" }, { "text": "柳江区" }, { "text": "柳南区" }, { "text": "鹿寨县" }, { "text": "融安县" }, { "text": "融水苗族自治县" }, { "text": "三江侗族自治县" }, { "text": "鱼峰区" }] }, { "text": "南宁市", "children": [{ "text": "宾阳县" }, { "text": "横县" }, { "text": "江南区" }, { "text": "良庆区" }, { "text": "隆安县" }, { "text": "马山县" }, { "text": "青秀区" }, { "text": "上林县" }, { "text": "武鸣区" }, { "text": "兴宁区" }, { "text": "西乡塘区" }, { "text": "邕宁区" }] }, { "text": "钦州市", "children": [{ "text": "灵山县" }, { "text": "浦北县" }, { "text": "钦北区" }, { "text": "钦南区" }] }, { "text": "梧州市", "children": [{ "text": "苍梧县" }, { "text": "岑溪市" }, { "text": "长洲区" }, { "text": "龙圩区" }, { "text": "蒙山县" }, { "text": "藤县" }, { "text": "万秀区" }] }, { "text": "玉林市", "children": [{ "text": "北流市" }, { "text": "博白县" }, { "text": "福绵区" }, { "text": "陆川县" }, { "text": "容县" }, { "text": "兴业县" }, { "text": "玉州区" }] }]
            }, {
                "text": "贵州省",
                "value": "贵州省",
                "children": [{ "text": "安顺市", "children": [{ "text": "关岭布依族苗族自治县" }, { "text": "平坝区" }, { "text": "普定县" }, { "text": "西秀区" }, { "text": "镇宁布依族苗族自治县" }, { "text": "紫云苗族布依族自治县" }] }, { "text": "毕节市", "children": [{ "text": "大方县" }, { "text": "赫章县" }, { "text": "金沙县" }, { "text": "纳雍县" }, { "text": "黔西县" }, { "text": "七星关区" }, { "text": "威宁彝族回族苗族自治县" }, { "text": "织金县" }] }, { "text": "贵阳市", "children": [{ "text": "白云区" }, { "text": "观山湖区" }, { "text": "花溪区" }, { "text": "开阳县" }, { "text": "南明区" }, { "text": "清镇市" }, { "text": "乌当区" }, { "text": "息烽县" }, { "text": "修文县" }, { "text": "云岩区" }] }, { "text": "六盘水市", "children": [{ "text": "六枝特区" }, { "text": "盘州市" }, { "text": "水城县" }, { "text": "钟山区" }] }, { "text": "黔东南苗族侗族自治州", "children": [{ "text": "岑巩县" }, { "text": "从江县" }, { "text": "丹寨县" }, { "text": "黄平县" }, { "text": "剑河县" }, { "text": "锦屏县" }, { "text": "凯里市" }, { "text": "雷山县" }, { "text": "黎平县" }, { "text": "麻江县" }, { "text": "榕江县" }, { "text": "三穗县" }, { "text": "施秉县" }, { "text": "台江县" }, { "text": "天柱县" }, { "text": "镇远县" }] }, { "text": "黔南布依族苗族自治州", "children": [{ "text": "长顺县" }, { "text": "独山县" }, { "text": "都匀市" }, { "text": "福泉市" }, { "text": "贵定县" }, { "text": "惠水县" }, { "text": "荔波县" }, { "text": "龙里县" }, { "text": "罗甸县" }, { "text": "平塘县" }, { "text": "三都水族自治县" }, { "text": "瓮安县" }] }, { "text": "黔西南布依族苗族自治州", "children": [{ "text": "安龙县" }, { "text": "册亨县" }, { "text": "普安县" }, { "text": "晴隆县" }, { "text": "望谟县" }, { "text": "兴仁市" }, { "text": "兴义市" }, { "text": "贞丰县" }] }, { "text": "铜仁市", "children": [{ "text": "碧江区" }, { "text": "德江县" }, { "text": "江口县" }, { "text": "石阡县" }, { "text": "思南县" }, { "text": "松桃苗族自治县" }, { "text": "万山区" }, { "text": "沿河土家族自治县" }, { "text": "印江土家族苗族自治县" }, { "text": "玉屏侗族自治县" }] }, { "text": "遵义市", "children": [{ "text": "播州区" }, { "text": "赤水市" }, { "text": "道真仡佬族苗族自治县" }, { "text": "凤冈县" }, { "text": "红花岗区" }, { "text": "汇川区" }, { "text": "湄潭县" }, { "text": "仁怀市" }, { "text": "绥阳县" }, { "text": "桐梓县" }, { "text": "务川仡佬族苗族自治县" }, { "text": "习水县" }, { "text": "余庆县" }, { "text": "正安县" }] }]
            }, {
                "text": "海南省",
                "value": "海南省",
                "children": [{ "text": "白沙黎族自治县", "children": [{ "text": "邦溪镇" }, { "text": "打安镇" }, { "text": "阜龙乡" }, { "text": "国营白沙农场" }, { "text": "国营邦溪农场" }, { "text": "国营龙江农场" }, { "text": "金波乡" }, { "text": "南开乡" }, { "text": "七坊镇" }, { "text": "青松乡" }, { "text": "荣邦乡" }, { "text": "细水乡" }, { "text": "牙叉镇" }, { "text": "元门乡" }] }, { "text": "保亭黎族苗族自治县", "children": [{ "text": "保城镇" }, { "text": "国营金江农场" }, { "text": "国营三道农场" }, { "text": "国营新星农场" }, { "text": "海南保亭热带作物研究所" }, { "text": "加茂镇" }, { "text": "六弓乡" }, { "text": "毛感乡" }, { "text": "南林乡" }, { "text": "三道镇" }, { "text": "什玲镇" }, { "text": "响水镇" }, { "text": "新政镇" }] }, { "text": "昌江黎族自治县", "children": [{ "text": "叉河镇" }, { "text": "昌化镇" }, { "text": "国营霸王岭林场" }, { "text": "国营红林农场" }, { "text": "海南矿业联合有限公司" }, { "text": "海尾镇" }, { "text": "七叉镇" }, { "text": "石碌镇" }, { "text": "十月田镇" }, { "text": "王下乡" }, { "text": "乌烈镇" }] }, { "text": "澄迈县", "children": [{ "text": "大丰镇" }, { "text": "福山镇" }, { "text": "国营和岭农场" }, { "text": "国营红岗农场" }, { "text": "国营红光农场" }, { "text": "国营金安农场" }, { "text": "国营昆仑农场" }, { "text": "国营西达农场" }, { "text": "加乐镇" }, { "text": "金江镇" }, { "text": "老城镇" }, { "text": "桥头镇" }, { "text": "仁兴镇" }, { "text": "瑞溪镇" }, { "text": "文儒镇" }, { "text": "永发镇" }, { "text": "中兴镇" }] }, { "text": "儋州市", "children": [{ "text": "白马井镇" }, { "text": "大成镇" }, { "text": "东成镇" }, { "text": "峨蔓镇" }, { "text": "光村镇" }, { "text": "国营八一农场" }, { "text": "国营蓝洋农场" }, { "text": "国营西联农场" }, { "text": "国营西培农场" }, { "text": "海头镇" }, { "text": "和庆镇" }, { "text": "华南热作学院" }, { "text": "兰洋镇" }, { "text": "木棠镇" }, { "text": "那大镇" }, { "text": "南丰镇" }, { "text": "排浦镇" }, { "text": "三都镇" }, { "text": "王五镇" }, { "text": "新州镇" }, { "text": "洋浦经济开发区" }, { "text": "雅星镇" }, { "text": "中和镇" }] }, { "text": "定安县", "children": [{ "text": "定城镇" }, { "text": "富文镇" }, { "text": "国营金鸡岭农场" }, { "text": "国营南海农场" }, { "text": "国营中瑞农场" }, { "text": "翰林镇" }, { "text": "黄竹镇" }, { "text": "雷鸣镇" }, { "text": "岭口镇" }, { "text": "龙河镇" }, { "text": "龙湖镇" }, { "text": "龙门镇" }, { "text": "新竹镇" }] }, { "text": "东方市", "children": [{ "text": "板桥镇" }, { "text": "八所镇" }, { "text": "大田镇" }, { "text": "东方华侨农场" }, { "text": "东河镇" }, { "text": "感城镇" }, { "text": "国营广坝农场" }, { "text": "江边乡" }, { "text": "三家镇" }, { "text": "四更镇" }, { "text": "天安乡" }, { "text": "新龙镇" }] }, { "text": "海口市", "children": [{ "text": "龙华区" }, { "text": "美兰区" }, { "text": "琼山区" }, { "text": "秀英区" }] }, { "text": "乐东黎族自治县", "children": [{ "text": "抱由镇" }, { "text": "大安镇" }, { "text": "佛罗镇" }, { "text": "国营保国农场" }, { "text": "国营尖峰岭林业公司" }, { "text": "国营乐光农场" }, { "text": "国营山荣农场" }, { "text": "国营莺歌海盐场" }, { "text": "黄流镇" }, { "text": "尖峰镇" }, { "text": "九所镇" }, { "text": "利国镇" }, { "text": "千家镇" }, { "text": "万冲镇" }, { "text": "莺歌海镇" }, { "text": "志仲镇" }] }, { "text": "临高县", "children": [{ "text": "博厚镇" }, { "text": "波莲镇" }, { "text": "调楼镇" }, { "text": "东英镇" }, { "text": "多文镇" }, { "text": "国营红华农场" }, { "text": "国营加来农场" }, { "text": "和舍镇" }, { "text": "皇桐镇" }, { "text": "临城镇" }, { "text": "南宝镇" }, { "text": "新盈镇" }] }, { "text": "陵水黎族自治县", "children": [{ "text": "本号镇" }, { "text": "光坡镇" }, { "text": "国营吊罗山林业公司" }, { "text": "国营岭门农场" }, { "text": "国营南平农场" }, { "text": "黎安镇" }, { "text": "隆广镇" }, { "text": "群英乡" }, { "text": "三才镇" }, { "text": "提蒙乡" }, { "text": "文罗镇" }, { "text": "新村镇" }, { "text": "椰林镇" }, { "text": "英州镇" }] }, { "text": "琼海市", "children": [{ "text": "彬村山华侨农场" }, { "text": "博鳌镇" }, { "text": "长坡镇" }, { "text": "大路镇" }, { "text": "国营东红农场" }, { "text": "国营东升农场" }, { "text": "国营东太农场" }, { "text": "会山镇" }, { "text": "嘉积镇" }, { "text": "龙江镇" }, { "text": "石壁镇" }, { "text": "潭门镇" }, { "text": "塔洋镇" }, { "text": "万泉镇" }, { "text": "阳江镇" }, { "text": "中原镇" }] }, { "text": "琼中黎族苗族自治县", "children": [{ "text": "长征镇" }, { "text": "吊罗山乡" }, { "text": "国营长征农场" }, { "text": "国营加钗农场" }, { "text": "国营黎母山林业公司" }, { "text": "国营乌石农场" }, { "text": "国营阳江农场" }, { "text": "和平镇" }, { "text": "红毛镇" }, { "text": "黎母山镇" }, { "text": "上安乡" }, { "text": "什运乡" }, { "text": "湾岭镇" }, { "text": "营根镇" }, { "text": "中平镇" }] }, { "text": "三沙市", "children": [{ "text": "南沙群岛" }, { "text": "西沙群岛" }, { "text": "中沙群岛的岛礁及其海域" }] }, { "text": "三亚市", "children": [{ "text": "海棠区" }, { "text": "吉阳区" }, { "text": "天涯区" }, { "text": "崖州区" }] }, { "text": "屯昌县", "children": [{ "text": "枫木镇" }, { "text": "国营中建农场" }, { "text": "国营中坤农场" }, { "text": "南坤镇" }, { "text": "南吕镇" }, { "text": "坡心镇" }, { "text": "屯城镇" }, { "text": "乌坡镇" }, { "text": "西昌镇" }, { "text": "新兴镇" }] }, { "text": "万宁市", "children": [{ "text": "北大镇" }, { "text": "长丰镇" }, { "text": "大茂镇" }, { "text": "地方国营六连林场" }, { "text": "东澳镇" }, { "text": "国营东和农场" }, { "text": "国营东兴农场" }, { "text": "国营新中农场" }, { "text": "和乐镇" }, { "text": "后安镇" }, { "text": "礼纪镇" }, { "text": "龙滚镇" }, { "text": "南桥镇" }, { "text": "三更罗镇" }, { "text": "山根镇" }, { "text": "万城镇" }, { "text": "兴隆华侨农场" }] }, { "text": "文昌市", "children": [{ "text": "抱罗镇" }, { "text": "昌洒镇" }, { "text": "东阁镇" }, { "text": "东郊镇" }, { "text": "东路镇" }, { "text": "冯坡镇" }, { "text": "公坡镇" }, { "text": "国营东路农场" }, { "text": "国营罗豆农场" }, { "text": "国营南阳农场" }, { "text": "会文镇" }, { "text": "锦山镇" }, { "text": "龙楼镇" }, { "text": "蓬莱镇" }, { "text": "铺前镇" }, { "text": "潭牛镇" }, { "text": "文城镇" }, { "text": "翁田镇" }, { "text": "文教镇" }, { "text": "重兴镇" }] }, { "text": "五指山市", "children": [{ "text": "畅好乡" }, { "text": "番阳镇" }, { "text": "国营畅好农场" }, { "text": "毛道乡" }, { "text": "毛阳镇" }, { "text": "南圣镇" }, { "text": "水满乡" }, { "text": "通什镇" }] }]
            }, {
                "text": "河北省",
                "value": "河北省",
                "children": [{ "text": "保定市", "children": [{ "text": "安国市" }, { "text": "安新县" }, { "text": "博野县" }, { "text": "定兴县" }, { "text": "定州市" }, { "text": "阜平县" }, { "text": "高碑店市" }, { "text": "高阳县" }, { "text": "竞秀区" }, { "text": "涞水县" }, { "text": "涞源县" }, { "text": "莲池区" }, { "text": "蠡县" }, { "text": "满城区" }, { "text": "清苑区" }, { "text": "曲阳县" }, { "text": "容城县" }, { "text": "顺平县" }, { "text": "唐县" }, { "text": "望都县" }, { "text": "雄县" }, { "text": "徐水区" }, { "text": "易县" }, { "text": "涿州市" }] }, { "text": "沧州市", "children": [{ "text": "泊头市" }, { "text": "沧县" }, { "text": "东光县" }, { "text": "海兴县" }, { "text": "河间市" }, { "text": "黄骅市" }, { "text": "孟村回族自治县" }, { "text": "南皮县" }, { "text": "青县" }, { "text": "任丘市" }, { "text": "肃宁县" }, { "text": "吴桥县" }, { "text": "献县" }, { "text": "新华区" }, { "text": "盐山县" }, { "text": "运河区" }] }, { "text": "承德市", "children": [{ "text": "承德县" }, { "text": "丰宁满族自治县" }, { "text": "宽城满族自治县" }, { "text": "隆化县" }, { "text": "滦平县" }, { "text": "平泉市" }, { "text": "双滦区" }, { "text": "双桥区" }, { "text": "围场满族蒙古族自治县" }, { "text": "兴隆县" }, { "text": "鹰手营子矿区" }] }, { "text": "邯郸市", "children": [{ "text": "成安县" }, { "text": "磁县" }, { "text": "丛台区" }, { "text": "大名县" }, { "text": "肥乡区" }, { "text": "峰峰矿区" }, { "text": "复兴区" }, { "text": "广平县" }, { "text": "馆陶县" }, { "text": "邯山区" }, { "text": "鸡泽县" }, { "text": "临漳县" }, { "text": "邱县" }, { "text": "曲周县" }, { "text": "涉县" }, { "text": "魏县" }, { "text": "武安市" }, { "text": "永年区" }] }, { "text": "衡水市", "children": [{ "text": "安平县" }, { "text": "阜城县" }, { "text": "故城县" }, { "text": "景县" }, { "text": "冀州区" }, { "text": "饶阳县" }, { "text": "深州市" }, { "text": "桃城区" }, { "text": "武强县" }, { "text": "武邑县" }, { "text": "枣强县" }] }, { "text": "廊坊市", "children": [{ "text": "安次区" }, { "text": "霸州市" }, { "text": "大厂回族自治县" }, { "text": "大城县" }, { "text": "广阳区" }, { "text": "固安县" }, { "text": "三河市" }, { "text": "文安县" }, { "text": "香河县" }, { "text": "永清县" }] }, { "text": "秦皇岛市", "children": [{ "text": "北戴河区" }, { "text": "昌黎县" }, { "text": "抚宁区" }, { "text": "海港区" }, { "text": "卢龙县" }, { "text": "青龙满族自治县" }, { "text": "山海关区" }] }, {
                    "text": "石家庄市",
                    "children": [{ "text": "长安区" }, { "text": "藁城区" }, { "text": "高邑县" }, { "text": "井陉矿区" }, { "text": "井陉县" }, { "text": "晋州市" }, { "text": "灵寿县" }, { "text": "栾城区" }, { "text": "鹿泉区" }, { "text": "平山县" }, { "text": "桥西区" }, { "text": "深泽县" },
                        { "text": "无极县" }, { "text": "行唐县" }, { "text": "新华区" }, { "text": "辛集市" }, { "text": "新乐市" }, { "text": "元氏县" }, { "text": "裕华区" }, { "text": "赞皇县" }, { "text": "赵县" }, { "text": "正定县" }
                    ]
                }, { "text": "唐山市", "children": [{ "text": "曹妃甸区" }, { "text": "丰南区" }, { "text": "丰润区" }, { "text": "古冶区" }, { "text": "开平区" }, { "text": "乐亭县" }, { "text": "滦南县" }, { "text": "滦州市" }, { "text": "路北区" }, { "text": "路南区" }, { "text": "迁安市" }, { "text": "迁西县" }, { "text": "玉田县" }, { "text": "遵化市" }] }, { "text": "邢台市", "children": [{ "text": "柏乡县" }, { "text": "广宗县" }, { "text": "巨鹿县" }, { "text": "临城县" }, { "text": "临西县" }, { "text": "隆尧县" }, { "text": "南宫市" }, { "text": "南和县" }, { "text": "内丘县" }, { "text": "宁晋县" }, { "text": "平乡县" }, { "text": "桥东区" }, { "text": "桥西区" }, { "text": "清河县" }, { "text": "任县" }, { "text": "沙河市" }, { "text": "威县" }, { "text": "邢台县" }, { "text": "新河县" }] }, { "text": "张家口市", "children": [{ "text": "赤城县" }, { "text": "崇礼区" }, { "text": "沽源县" }, { "text": "怀安县" }, { "text": "怀来县" }, { "text": "康保县" }, { "text": "桥东区" }, { "text": "桥西区" }, { "text": "尚义县" }, { "text": "万全区" }, { "text": "蔚县" }, { "text": "下花园区" }, { "text": "宣化区" }, { "text": "阳原县" }, { "text": "张北县" }, { "text": "涿鹿县" }] }]
            }, {
                "text": "黑龙江省",
                "value": "黑龙江省",
                "children": [{ "text": "大庆市", "children": [{ "text": "大同区" }, { "text": "杜尔伯特蒙古族自治县" }, { "text": "红岗区" }, { "text": "林甸县" }, { "text": "龙凤区" }, { "text": "让胡路区" }, { "text": "萨尔图区" }, { "text": "肇源县" }, { "text": "肇州县" }] }, { "text": "大兴安岭地区", "children": [{ "text": "呼玛县" }, { "text": "加格达奇区" }, { "text": "漠河市" }, { "text": "塔河县" }] }, { "text": "哈尔滨市", "children": [{ "text": "阿城区" }, { "text": "巴彦县" }, { "text": "宾县" }, { "text": "道里区" }, { "text": "道外区" }, { "text": "方正县" }, { "text": "呼兰区" }, { "text": "木兰县" }, { "text": "南岗区" }, { "text": "平房区" }, { "text": "尚志市" }, { "text": "双城区" }, { "text": "松北区" }, { "text": "通河县" }, { "text": "五常市" }, { "text": "香坊区" }, { "text": "延寿县" }, { "text": "依兰县" }] }, { "text": "鹤岗市", "children": [{ "text": "东山区" }, { "text": "工农区" }, { "text": "萝北县" }, { "text": "南山区" }, { "text": "绥滨县" }, { "text": "向阳区" }, { "text": "兴安区" }, { "text": "兴山区" }] }, { "text": "黑河市", "children": [{ "text": "爱辉区" }, { "text": "北安市" }, { "text": "嫩江县" }, { "text": "孙吴县" }, { "text": "五大连池市" }, { "text": "逊克县" }] }, { "text": "佳木斯市", "children": [{ "text": "东风区" }, { "text": "富锦市" }, { "text": "抚远市" }, { "text": "桦川县" }, { "text": "桦南县" }, { "text": "郊区" }, { "text": "前进区" }, { "text": "汤原县" }, { "text": "同江市" }, { "text": "向阳区" }] }, { "text": "鸡西市", "children": [{ "text": "城子河区" }, { "text": "滴道区" }, { "text": "恒山区" }, { "text": "虎林市" }, { "text": "鸡东县" }, { "text": "鸡冠区" }, { "text": "梨树区" }, { "text": "麻山区" }, { "text": "密山市" }] }, { "text": "牡丹江市", "children": [{ "text": "爱民区" }, { "text": "东安区" }, { "text": "东宁市" }, { "text": "海林市" }, { "text": "林口县" }, { "text": "穆棱市" }, { "text": "宁安市" }, { "text": "绥芬河市" }, { "text": "西安区" }, { "text": "阳明区" }] }, { "text": "齐齐哈尔市", "children": [{ "text": "昂昂溪区" }, { "text": "拜泉县" }, { "text": "富拉尔基区" }, { "text": "富裕县" }, { "text": "甘南县" }, { "text": "建华区" }, { "text": "克东县" }, { "text": "克山县" }, { "text": "龙江县" }, { "text": "龙沙区" }, { "text": "梅里斯达斡尔族区" }, { "text": "讷河市" }, { "text": "碾子山区" }, { "text": "泰来县" }, { "text": "铁锋区" }, { "text": "依安县" }] }, { "text": "七台河市", "children": [{ "text": "勃利县" }, { "text": "茄子河区" }, { "text": "桃山区" }, { "text": "新兴区" }] }, { "text": "双鸭山市", "children": [{ "text": "宝清县" }, { "text": "宝山区" }, { "text": "尖山区" }, { "text": "集贤县" }, { "text": "岭东区" }, { "text": "饶河县" }, { "text": "四方台区" }, { "text": "友谊县" }] }, { "text": "绥化市", "children": [{ "text": "安达市" }, { "text": "北林区" }, { "text": "海伦市" }, { "text": "兰西县" }, { "text": "明水县" }, { "text": "庆安县" }, { "text": "青冈县" }, { "text": "绥棱县" }, { "text": "望奎县" }, { "text": "肇东市" }] }, { "text": "伊春市", "children": [{ "text": "翠峦区" }, { "text": "带岭区" }, { "text": "红星区" }, { "text": "嘉荫县" }, { "text": "金山屯区" }, { "text": "美溪区" }, { "text": "南岔区" }, { "text": "上甘岭区" }, { "text": "汤旺河区" }, { "text": "铁力市" }, { "text": "乌马河区" }, { "text": "乌伊岭区" }, { "text": "五营区" }, { "text": "西林区" }, { "text": "新青区" }, { "text": "伊春区" }, { "text": "友好区" }] }]
            }, {
                "text": "河南省",
                "value": "河南省",
                "children": [{ "text": "安阳市", "children": [{ "text": "安阳县" }, { "text": "北关区" }, { "text": "滑县" }, { "text": "林州市" }, { "text": "龙安区" }, { "text": "内黄县" }, { "text": "汤阴县" }, { "text": "文峰区" }, { "text": "殷都区" }] }, { "text": "鹤壁市", "children": [{ "text": "鹤山区" }, { "text": "浚县" }, { "text": "淇滨区" }, { "text": "淇县" }, { "text": "山城区" }] }, { "text": "焦作市", "children": [{ "text": "博爱县" }, { "text": "解放区" }, { "text": "马村区" }, { "text": "孟州市" }, { "text": "沁阳市" }, { "text": "山阳区" }, { "text": "温县" }, { "text": "武陟县" }, { "text": "修武县" }, { "text": "中站区" }] }, { "text": "济源市", "children": [{ "text": "济源市北海街道" }, { "text": "济源市承留镇" }, { "text": "济源市大峪镇" }, { "text": "济源市济水街道" }, { "text": "济源市克井镇" }, { "text": "济源市梨林镇" }, { "text": "济源市坡头镇" }, { "text": "济源市沁园街道" }, { "text": "济源市邵原镇" }, { "text": "济源市思礼镇" }, { "text": "济源市天坛街道" }, { "text": "济源市王屋镇" }, { "text": "济源市五龙口镇" }, { "text": "济源市下冶镇" }, { "text": "济源市玉泉街道" }, { "text": "济源市轵城镇" }] }, { "text": "开封市", "children": [{ "text": "鼓楼区" }, { "text": "兰考县" }, { "text": "龙亭区" }, { "text": "杞县" }, { "text": "顺河回族区" }, { "text": "通许县" }, { "text": "尉氏县" }, { "text": "祥符区" }, { "text": "禹王台区" }] }, { "text": "漯河市", "children": [{ "text": "临颍县" }, { "text": "舞阳县" }, { "text": "郾城区" }, { "text": "源汇区" }, { "text": "召陵区" }] }, { "text": "洛阳市", "children": [{ "text": "瀍河回族区" }, { "text": "涧西区" }, { "text": "吉利区" }, { "text": "老城区" }, { "text": "栾川县" }, { "text": "洛龙区" }, { "text": "洛宁县" }, { "text": "孟津县" }, { "text": "汝阳县" }, { "text": "嵩县" }, { "text": "西工区" }, { "text": "新安县" }, { "text": "偃师市" }, { "text": "伊川县" }, { "text": "宜阳县" }] }, { "text": "南阳市", "children": [{ "text": "邓州市" }, { "text": "方城县" }, { "text": "南召县" }, { "text": "内乡县" }, { "text": "社旗县" }, { "text": "唐河县" }, { "text": "桐柏县" }, { "text": "宛城区" }, { "text": "卧龙区" }, { "text": "淅川县" }, { "text": "新野县" }, { "text": "西峡县" }, { "text": "镇平县" }] }, { "text": "平顶山市", "children": [{ "text": "宝丰县" }, { "text": "郏县" }, { "text": "鲁山县" }, { "text": "汝州市" }, { "text": "石龙区" }, { "text": "卫东区" }, { "text": "舞钢市" }, { "text": "新华区" }, { "text": "叶县" }, { "text": "湛河区" }] }, { "text": "濮阳市", "children": [{ "text": "范县" }, { "text": "华龙区" }, { "text": "南乐县" }, { "text": "濮阳县" }, { "text": "清丰县" }, { "text": "台前县" }] }, { "text": "三门峡市", "children": [{ "text": "湖滨区" }, { "text": "灵宝市" }, { "text": "卢氏县" }, { "text": "陕州区" }, { "text": "渑池县" }, { "text": "义马市" }] }, { "text": "商丘市", "children": [{ "text": "梁园区" }, { "text": "民权县" }, { "text": "宁陵县" }, { "text": "睢县" }, { "text": "睢阳区" }, { "text": "夏邑县" }, { "text": "永城市" }, { "text": "虞城县" }, { "text": "柘城县" }] }, { "text": "新乡市", "children": [{ "text": "长垣县" }, { "text": "封丘县" }, { "text": "凤泉区" }, { "text": "红旗区" }, { "text": "辉县市" }, { "text": "获嘉县" }, { "text": "牧野区" }, { "text": "卫滨区" }, { "text": "卫辉市" }, { "text": "新乡县" }, { "text": "延津县" }, { "text": "原阳县" }] }, { "text": "信阳市", "children": [{ "text": "光山县" }, { "text": "固始县" }, { "text": "浉河区" }, { "text": "淮滨县" }, { "text": "潢川县" }, { "text": "罗山县" }, { "text": "平桥区" }, { "text": "商城县" }, { "text": "新县" }, { "text": "息县" }] }, { "text": "许昌市", "children": [{ "text": "长葛市" }, { "text": "建安区" }, { "text": "魏都区" }, { "text": "襄城县" }, { "text": "鄢陵县" }, { "text": "禹州市" }] }, { "text": "郑州市", "children": [{ "text": "登封市" }, { "text": "二七区" }, { "text": "巩义市" }, { "text": "管城回族区" }, { "text": "惠济区" }, { "text": "金水区" }, { "text": "上街区" }, { "text": "荥阳市" }, { "text": "新密市" }, { "text": "新郑市" }, { "text": "中牟县" }, { "text": "中原区" }] }, { "text": "周口市", "children": [{ "text": "川汇区" }, { "text": "郸城县" }, { "text": "扶沟县" }, { "text": "淮阳县" }, { "text": "鹿邑县" }, { "text": "商水县" }, { "text": "沈丘县" }, { "text": "太康县" }, { "text": "项城市" }, { "text": "西华县" }] }, { "text": "驻马店市", "children": [{ "text": "泌阳县" }, { "text": "平舆县" }, { "text": "确山县" }, { "text": "汝南县" }, { "text": "上蔡县" }, { "text": "遂平县" }, { "text": "新蔡县" }, { "text": "西平县" }, { "text": "驿城区" }, { "text": "正阳县" }] }]
            }, {
                "text": "湖北省",
                "value": "湖北省",
                "children": [{ "text": "恩施土家族苗族自治州", "children": [{ "text": "巴东县" }, { "text": "恩施市" }, { "text": "鹤峰县" }, { "text": "建始县" }, { "text": "来凤县" }, { "text": "利川市" }, { "text": "咸丰县" }, { "text": "宣恩县" }] }, { "text": "鄂州市", "children": [{ "text": "鄂城区" }, { "text": "华容区" }, { "text": "梁子湖区" }] }, { "text": "黄冈市", "children": [{ "text": "红安县" }, { "text": "黄梅县" }, { "text": "黄州区" }, { "text": "罗田县" }, { "text": "麻城市" }, { "text": "蕲春县" }, { "text": "团风县" }, { "text": "武穴市" }, { "text": "浠水县" }, { "text": "英山县" }] }, { "text": "黄石市", "children": [{ "text": "大冶市" }, { "text": "黄石港区" }, { "text": "铁山区" }, { "text": "下陆区" }, { "text": "西塞山区" }, { "text": "阳新县" }] }, { "text": "荆门市", "children": [{ "text": "东宝区" }, { "text": "掇刀区" }, { "text": "京山市" }, { "text": "沙洋县" }, { "text": "钟祥市" }] }, { "text": "荆州市", "children": [{ "text": "公安县" }, { "text": "洪湖市" }, { "text": "江陵县" }, { "text": "监利县" }, { "text": "荆州区" }, { "text": "沙市区" }, { "text": "石首市" }, { "text": "松滋市" }] }, { "text": "潜江市", "children": [{ "text": "白鹭湖管理区" }, { "text": "高场街道" }, { "text": "高石碑镇" }, { "text": "广华街道" }, { "text": "浩口原种场" }, { "text": "浩口镇" }, { "text": "后湖管理区" }, { "text": "江汉石油管理局" }, { "text": "积玉口镇" }, { "text": "老新镇" }, { "text": "龙湾镇" }, { "text": "潜江经济开发区" }, { "text": "泰丰街道" }, { "text": "王场镇" }, { "text": "熊口管理区" }, { "text": "熊口镇" }, { "text": "杨市街道" }, { "text": "园林街道" }, { "text": "运粮湖管理区" }, { "text": "渔洋镇" }, { "text": "张金镇" }, { "text": "周矶管理区" }, { "text": "周矶街道" }, { "text": "竹根滩镇" }, { "text": "总口管理区" }] }, { "text": "神农架林区", "children": [{ "text": "红坪镇" }, { "text": "九湖镇" }, { "text": "木鱼镇" }, { "text": "松柏镇" }, { "text": "宋洛乡" }, { "text": "下谷坪土家族乡" }, { "text": "新华镇" }, { "text": "阳日镇" }] }, { "text": "十堰市", "children": [{ "text": "丹江口市" }, { "text": "房县" }, { "text": "茅箭区" }, { "text": "郧西县" }, { "text": "郧阳区" }, { "text": "张湾区" }, { "text": "竹山县" }, { "text": "竹溪县" }] }, { "text": "随州市", "children": [{ "text": "广水市" }, { "text": "随县" }, { "text": "曾都区" }] }, { "text": "天门市", "children": [{ "text": "白茅湖农场" }, { "text": "沉湖管委会" }, { "text": "多宝镇" }, { "text": "多祥镇" }, { "text": "佛子山镇" }, { "text": "干驿镇" }, { "text": "横林镇" }, { "text": "黄潭镇" }, { "text": "胡市镇" }, { "text": "蒋场镇" }, { "text": "蒋湖农场" }, { "text": "竟陵街道" }, { "text": "净潭乡" }, { "text": "九真镇" }, { "text": "卢市镇" }, { "text": "马湾镇" }, { "text": "麻洋镇" }, { "text": "彭市镇" }, { "text": "侨乡街道开发区" }, { "text": "石家河镇" }, { "text": "拖市镇" }, { "text": "汪场镇" }, { "text": "小板镇" }, { "text": "杨林街道" }, { "text": "岳口镇" }, { "text": "渔薪镇" }, { "text": "皂市镇" }, { "text": "张港镇" }] }, { "text": "武汉市", "children": [{ "text": "蔡甸区" }, { "text": "东西湖区" }, { "text": "汉南区" }, { "text": "汉阳区" }, { "text": "洪山区" }, { "text": "黄陂区" }, { "text": "江岸区" }, { "text": "江汉区" }, { "text": "江夏区" }, { "text": "硚口区" }, { "text": "青山区" }, { "text": "武昌区" }, { "text": "新洲区" }] }, { "text": "襄阳市", "children": [{ "text": "保康县" }, { "text": "樊城区" }, { "text": "谷城县" }, { "text": "老河口市" }, { "text": "南漳县" }, { "text": "襄城区" }, { "text": "襄州区" }, { "text": "宜城市" }, { "text": "枣阳市" }] }, { "text": "咸宁市", "children": [{ "text": "赤壁市" }, { "text": "崇阳县" }, { "text": "嘉鱼县" }, { "text": "通城县" }, { "text": "通山县" }, { "text": "咸安区" }] }, { "text": "仙桃市", "children": [{ "text": "长倘口镇" }, { "text": "陈场镇" }, { "text": "豆河镇" }, { "text": "干河街道" }, { "text": "工业园区" }, { "text": "郭河镇" }, { "text": "胡场镇" }, { "text": "九合垸原种场" }, { "text": "龙华山街道" }, { "text": "毛嘴镇" }, { "text": "沔城回族镇" }, { "text": "排湖风景区" }, { "text": "彭场镇" }, { "text": "三伏潭镇" }, { "text": "沙湖原种场" }, { "text": "沙湖镇" }, { "text": "沙嘴街道" }, { "text": "通海口镇" }, { "text": "五湖渔场" }, { "text": "西流河镇" }, { "text": "畜禽良种场" }, { "text": "杨林尾镇" }, { "text": "张沟镇" }, { "text": "赵西垸林场" }, { "text": "郑场镇" }] }, { "text": "孝感市", "children": [{ "text": "安陆市" }, { "text": "大悟县" }, { "text": "汉川市" }, { "text": "孝昌县" }, { "text": "孝南区" }, { "text": "应城市" }, { "text": "云梦县" }] }, { "text": "宜昌市", "children": [{ "text": "长阳土家族自治县" }, { "text": "当阳市" }, { "text": "点军区" }, { "text": "猇亭区" }, { "text": "五峰土家族自治县" }, { "text": "伍家岗区" }, { "text": "西陵区" }, { "text": "兴山县" }, { "text": "宜都市" }, { "text": "夷陵区" }, { "text": "远安县" }, { "text": "枝江市" }, { "text": "秭归县" }] }]
            }, {
                "text": "湖南省",
                "value": "湖南省",
                "children": [{ "text": "常德市", "children": [{ "text": "安乡县" }, { "text": "鼎城区" }, { "text": "汉寿县" }, { "text": "津市市" }, { "text": "临澧县" }, { "text": "澧县" }, { "text": "石门县" }, { "text": "桃源县" }, { "text": "武陵区" }] }, { "text": "长沙市", "children": [{ "text": "长沙县" }, { "text": "芙蓉区" }, { "text": "开福区" }, { "text": "浏阳市" }, { "text": "宁乡市" }, { "text": "天心区" }, { "text": "望城区" }, { "text": "岳麓区" }, { "text": "雨花区" }] }, { "text": "郴州市", "children": [{ "text": "安仁县" }, { "text": "北湖区" }, { "text": "桂东县" }, { "text": "桂阳县" }, { "text": "嘉禾县" }, { "text": "临武县" }, { "text": "汝城县" }, { "text": "苏仙区" }, { "text": "宜章县" }, { "text": "永兴县" }, { "text": "资兴市" }] }, { "text": "衡阳市", "children": [{ "text": "常宁市" }, { "text": "衡东县" }, { "text": "衡南县" }, { "text": "衡山县" }, { "text": "衡阳县" }, { "text": "耒阳市" }, { "text": "南岳区" }, { "text": "祁东县" }, { "text": "石鼓区" }, { "text": "雁峰区" }, { "text": "蒸湘区" }, { "text": "珠晖区" }] }, { "text": "怀化市", "children": [{ "text": "辰溪县" }, { "text": "鹤城区" }, { "text": "洪江市" }, { "text": "会同县" }, { "text": "靖州苗族侗族自治县" }, { "text": "麻阳苗族自治县" }, { "text": "通道侗族自治县" }, { "text": "新晃侗族自治县" }, { "text": "溆浦县" }, { "text": "沅陵县" }, { "text": "芷江侗族自治县" }, { "text": "中方县" }] }, { "text": "娄底市", "children": [{ "text": "涟源市" }, { "text": "冷水江市" }, { "text": "娄星区" }, { "text": "双峰县" }, { "text": "新化县" }] }, { "text": "邵阳市", "children": [{ "text": "北塔区" }, { "text": "城步苗族自治县" }, { "text": "大祥区" }, { "text": "洞口县" }, { "text": "隆回县" }, { "text": "邵东县" }, { "text": "邵阳县" }, { "text": "双清区" }, { "text": "绥宁县" }, { "text": "武冈市" }, { "text": "新宁县" }, { "text": "新邵县" }] }, { "text": "湘潭市", "children": [{ "text": "韶山市" }, { "text": "湘潭县" }, { "text": "湘乡市" }, { "text": "岳塘区" }, { "text": "雨湖区" }] }, { "text": "湘西土家族苗族自治州", "children": [{ "text": "保靖县" }, { "text": "凤凰县" }, { "text": "古丈县" }, { "text": "花垣县" }, { "text": "吉首市" }, { "text": "龙山县" }, { "text": "泸溪县" }, { "text": "永顺县" }] }, { "text": "益阳市", "children": [{ "text": "安化县" }, { "text": "赫山区" }, { "text": "南县" }, { "text": "桃江县" }, { "text": "沅江市" }, { "text": "资阳区" }] }, { "text": "永州市", "children": [{ "text": "道县" }, { "text": "东安县" }, { "text": "江华瑶族自治县" }, { "text": "江永县" }, { "text": "蓝山县" }, { "text": "零陵区" }, { "text": "冷水滩区" }, { "text": "宁远县" }, { "text": "祁阳县" }, { "text": "双牌县" }, { "text": "新田县" }] }, { "text": "岳阳市", "children": [{ "text": "华容县" }, { "text": "君山区" }, { "text": "临湘市" }, { "text": "汨罗市" }, { "text": "平江县" }, { "text": "湘阴县" }, { "text": "岳阳楼区" }, { "text": "岳阳县" }, { "text": "云溪区" }] }, { "text": "张家界市", "children": [{ "text": "慈利县" }, { "text": "桑植县" }, { "text": "武陵源区" }, { "text": "永定区" }] }, { "text": "株洲市", "children": [{ "text": "茶陵县" }, { "text": "荷塘区" }, { "text": "醴陵市" }, { "text": "渌口区" }, { "text": "芦淞区" }, { "text": "石峰区" }, { "text": "天元区" }, { "text": "炎陵县" }, { "text": "攸县" }] }]
            }, {
                "text": "江苏省",
                "value": "江苏省",
                "children": [{ "text": "常州市", "children": [{ "text": "金坛区" }, { "text": "溧阳市" }, { "text": "天宁区" }, { "text": "武进区" }, { "text": "新北区" }, { "text": "钟楼区" }] }, { "text": "淮安市", "children": [{ "text": "洪泽区" }, { "text": "淮安区" }, { "text": "淮阴区" }, { "text": "金湖县" }, { "text": "涟水县" }, { "text": "清江浦区" }, { "text": "盱眙县" }] }, { "text": "连云港市", "children": [{ "text": "东海县" }, { "text": "赣榆区" }, { "text": "灌南县" }, { "text": "灌云县" }, { "text": "海州区" }, { "text": "连云区" }] }, { "text": "南京市", "children": [{ "text": "高淳区" }, { "text": "鼓楼区" }, { "text": "江宁区" }, { "text": "建邺区" }, { "text": "溧水区" }, { "text": "六合区" }, { "text": "浦口区" }, { "text": "秦淮区" }, { "text": "栖霞区" }, { "text": "玄武区" }, { "text": "雨花台区" }] }, { "text": "南通市", "children": [{ "text": "崇川区" }, { "text": "港闸区" }, { "text": "海安市" }, { "text": "海门市" }, { "text": "启东市" }, { "text": "如东县" }, { "text": "如皋市" }, { "text": "通州区" }] }, { "text": "宿迁市", "children": [{ "text": "沭阳县" }, { "text": "泗洪县" }, { "text": "泗阳县" }, { "text": "宿城区" }, { "text": "宿豫区" }] }, { "text": "苏州市", "children": [{ "text": "常熟市" }, { "text": "姑苏区" }, { "text": "虎丘区" }, { "text": "昆山市" }, { "text": "苏州工业园区" }, { "text": "太仓市" }, { "text": "吴江区" }, { "text": "吴中区" }, { "text": "相城区" }, { "text": "张家港市" }] }, { "text": "泰州市", "children": [{ "text": "高港区" }, { "text": "海陵区" }, { "text": "姜堰区" }, { "text": "靖江市" }, { "text": "泰兴市" }, { "text": "兴化市" }] }, { "text": "无锡市", "children": [{ "text": "滨湖区" }, { "text": "惠山区" }, { "text": "江阴市" }, { "text": "梁溪区" }, { "text": "新吴区" }, { "text": "锡山区" }, { "text": "宜兴市" }] }, { "text": "徐州市", "children": [{ "text": "丰县" }, { "text": "鼓楼区" }, { "text": "贾汪区" }, { "text": "沛县" }, { "text": "邳州市" }, { "text": "泉山区" }, { "text": "睢宁县" }, { "text": "铜山区" }, { "text": "新沂市" }, { "text": "云龙区" }] }, { "text": "盐城市", "children": [{ "text": "滨海县" }, { "text": "大丰区" }, { "text": "东台市" }, { "text": "阜宁县" }, { "text": "建湖县" }, { "text": "射阳县" }, { "text": "亭湖区" }, { "text": "响水县" }, { "text": "盐都区" }] }, { "text": "扬州市", "children": [{ "text": "宝应县" }, { "text": "高邮市" }, { "text": "广陵区" }, { "text": "邗江区" }, { "text": "江都区" }, { "text": "仪征市" }] }, { "text": "镇江市", "children": [{ "text": "丹徒区" }, { "text": "丹阳市" }, { "text": "京口区" }, { "text": "句容市" }, { "text": "润州区" }, { "text": "扬中市" }] }]
            }, {
                "text": "江西省",
                "value": "江西省",
                "children": [{ "text": "抚州市", "children": [{ "text": "崇仁县" }, { "text": "东乡区" }, { "text": "广昌县" }, { "text": "金溪县" }, { "text": "乐安县" }, { "text": "黎川县" }, { "text": "临川区" }, { "text": "南城县" }, { "text": "南丰县" }, { "text": "宜黄县" }, { "text": "资溪县" }] }, { "text": "赣州市", "children": [{ "text": "安远县" }, { "text": "崇义县" }, { "text": "大余县" }, { "text": "定南县" }, { "text": "赣县区" }, { "text": "会昌县" }, { "text": "龙南县" }, { "text": "南康区" }, { "text": "宁都县" }, { "text": "全南县" }, { "text": "瑞金市" }, { "text": "上犹县" }, { "text": "石城县" }, { "text": "信丰县" }, { "text": "兴国县" }, { "text": "寻乌县" }, { "text": "于都县" }, { "text": "章贡区" }] }, { "text": "吉安市", "children": [{ "text": "安福县" }, { "text": "吉安县" }, { "text": "井冈山市" }, { "text": "吉水县" }, { "text": "吉州区" }, { "text": "青原区" }, { "text": "遂川县" }, { "text": "泰和县" }, { "text": "万安县" }, { "text": "峡江县" }, { "text": "新干县" }, { "text": "永丰县" }, { "text": "永新县" }] }, { "text": "景德镇市", "children": [{ "text": "昌江区" }, { "text": "浮梁县" }, { "text": "乐平市" }, { "text": "珠山区" }] }, { "text": "九江市", "children": [{ "text": "柴桑区" }, { "text": "德安县" }, { "text": "都昌县" }, { "text": "共青城市" }, { "text": "湖口县" }, { "text": "濂溪区" }, { "text": "庐山市" }, { "text": "彭泽县" }, { "text": "瑞昌市" }, { "text": "武宁县" }, { "text": "修水县" }, { "text": "浔阳区" }, { "text": "永修县" }] }, { "text": "南昌市", "children": [{ "text": "安义县" }, { "text": "东湖区" }, { "text": "进贤县" }, { "text": "南昌县" }, { "text": "青山湖区" }, { "text": "青云谱区" }, { "text": "湾里区" }, { "text": "西湖区" }, { "text": "新建区" }] }, { "text": "萍乡市", "children": [{ "text": "安源区" }, { "text": "莲花县" }, { "text": "芦溪县" }, { "text": "上栗县" }, { "text": "湘东区" }] }, { "text": "上饶市", "children": [{ "text": "德兴市" }, { "text": "广丰区" }, { "text": "横峰县" }, { "text": "婺源县" }, { "text": "鄱阳县" }, { "text": "铅山县" }, { "text": "上饶县" }, { "text": "万年县" }, { "text": "信州区" }, { "text": "弋阳县" }, { "text": "余干县" }, { "text": "玉山县" }] }, { "text": "新余市", "children": [{ "text": "分宜县" }, { "text": "渝水区" }] }, { "text": "宜春市", "children": [{ "text": "丰城市" }, { "text": "奉新县" }, { "text": "高安市" }, { "text": "靖安县" }, { "text": "上高县" }, { "text": "铜鼓县" }, { "text": "万载县" }, { "text": "宜丰县" }, { "text": "袁州区" }, { "text": "樟树市" }] }, { "text": "鹰潭市", "children": [{ "text": "贵溪市" }, { "text": "月湖区" }, { "text": "余江区" }] }]
            }, {
                "text": "吉林省",
                "value": "吉林省",
                "children": [{ "text": "白城市", "children": [{ "text": "大安市" }, { "text": "洮北区" }, { "text": "洮南市" }, { "text": "通榆县" }, { "text": "镇赉县" }] }, { "text": "白山市", "children": [{ "text": "长白朝鲜族自治县" }, { "text": "抚松县" }, { "text": "浑江区" }, { "text": "江源区" }, { "text": "靖宇县" }, { "text": "临江市" }] }, { "text": "长春市", "children": [{ "text": "朝阳区" }, { "text": "德惠市" }, { "text": "二道区" }, { "text": "九台区" }, { "text": "宽城区" }, { "text": "绿园区" }, { "text": "南关区" }, { "text": "农安县" }, { "text": "双阳区" }, { "text": "榆树市" }] },
                    { "text": "吉林市", "children": [{ "text": "昌邑区" }, { "text": "船营区" }, { "text": "丰满区" }, { "text": "桦甸市" }, { "text": "蛟河市" }, { "text": "龙潭区" }, { "text": "磐石市" }, { "text": "舒兰市" }, { "text": "永吉县" }] }, { "text": "辽源市", "children": [{ "text": "东丰县" }, { "text": "东辽县" }, { "text": "龙山区" }, { "text": "西安区" }] }, { "text": "四平市", "children": [{ "text": "公主岭市" }, { "text": "梨树县" }, { "text": "双辽市" }, { "text": "铁东区" }, { "text": "铁西区" }, { "text": "伊通满族自治县" }] }, { "text": "松原市", "children": [{ "text": "长岭县" }, { "text": "扶余市" }, { "text": "宁江区" }, { "text": "乾安县" }, { "text": "前郭尔罗斯蒙古族自治县" }] }, { "text": "通化市", "children": [{ "text": "东昌区" }, { "text": "二道江区" }, { "text": "辉南县" }, { "text": "集安市" }, { "text": "柳河县" }, { "text": "梅河口市" }, { "text": "通化县" }] }, { "text": "延边朝鲜族自治州", "children": [{ "text": "安图县" }, { "text": "敦化市" }, { "text": "和龙市" }, { "text": "珲春市" }, { "text": "龙井市" }, { "text": "图们市" }, { "text": "汪清县" }, { "text": "延吉市" }] }
                ]
            }, {
                "text": "辽宁省",
                "value": "辽宁省",
                "children": [{ "text": "鞍山市", "children": [{ "text": "海城市" }, { "text": "立山区" }, { "text": "千山区" }, { "text": "台安县" }, { "text": "铁东区" }, { "text": "铁西区" }, { "text": "岫岩满族自治县" }] }, { "text": "本溪市", "children": [{ "text": "本溪满族自治县" }, { "text": "桓仁满族自治县" }, { "text": "明山区" }, { "text": "南芬区" }, { "text": "平山区" }, { "text": "溪湖区" }] }, { "text": "朝阳市", "children": [{ "text": "北票市" }, { "text": "朝阳县" }, { "text": "建平县" }, { "text": "喀喇沁左翼蒙古族自治县" }, { "text": "凌源市" }, { "text": "龙城区" }, { "text": "双塔区" }] }, { "text": "大连市", "children": [{ "text": "长海县" }, { "text": "甘井子区" }, { "text": "金州区" }, { "text": "旅顺口区" }, { "text": "普兰店区" }, { "text": "沙河口区" }, { "text": "瓦房店市" }, { "text": "西岗区" }, { "text": "中山区" }, { "text": "庄河市" }] }, { "text": "丹东市", "children": [{ "text": "东港市" }, { "text": "凤城市" }, { "text": "宽甸满族自治县" }, { "text": "元宝区" }, { "text": "振安区" }, { "text": "振兴区" }] }, { "text": "抚顺市", "children": [{ "text": "东洲区" }, { "text": "抚顺县" }, { "text": "清原满族自治县" }, { "text": "顺城区" }, { "text": "望花区" }, { "text": "新宾满族自治县" }, { "text": "新抚区" }] }, { "text": "阜新市", "children": [{ "text": "阜新蒙古族自治县" }, { "text": "海州区" }, { "text": "清河门区" }, { "text": "太平区" }, { "text": "细河区" }, { "text": "新邱区" }, { "text": "彰武县" }] }, { "text": "葫芦岛市", "children": [{ "text": "建昌县" }, { "text": "连山区" }, { "text": "龙港区" }, { "text": "南票区" }, { "text": "绥中县" }, { "text": "兴城市" }] }, { "text": "锦州市", "children": [{ "text": "北镇市" }, { "text": "古塔区" }, { "text": "黑山县" }, { "text": "凌海市" }, { "text": "凌河区" }, { "text": "太和区" }, { "text": "义县" }] }, { "text": "辽阳市", "children": [{ "text": "白塔区" }, { "text": "灯塔市" }, { "text": "弓长岭区" }, { "text": "宏伟区" }, { "text": "辽阳县" }, { "text": "太子河区" }, { "text": "文圣区" }] }, { "text": "盘锦市", "children": [{ "text": "大洼区" }, { "text": "盘山县" }, { "text": "双台子区" }, { "text": "兴隆台区" }] }, { "text": "沈阳市", "children": [{ "text": "大东区" }, { "text": "法库县" }, { "text": "和平区" }, { "text": "皇姑区" }, { "text": "浑南区" }, { "text": "康平县" }, { "text": "辽中区" }, { "text": "沈北新区" }, { "text": "沈河区" }, { "text": "苏家屯区" }, { "text": "铁西区" }, { "text": "新民市" }, { "text": "于洪区" }] }, { "text": "铁岭市", "children": [{ "text": "昌图县" }, { "text": "调兵山市" }, { "text": "开原市" }, { "text": "清河区" }, { "text": "铁岭县" }, { "text": "西丰县" }, { "text": "银州区" }] }, { "text": "营口市", "children": [{ "text": "鲅鱼圈区" }, { "text": "大石桥市" }, { "text": "盖州市" }, { "text": "老边区" }, { "text": "西市区" }, { "text": "站前区" }] }]
            }, {
                "text": "内蒙古自治区",
                "value": "内蒙古自治区",
                "children": [{ "text": "阿拉善盟", "children": [{ "text": "阿拉善右旗" }, { "text": "阿拉善左旗" }, { "text": "额济纳旗" }] }, { "text": "包头市", "children": [{ "text": "白云鄂博矿区" }, { "text": "达尔罕茂明安联合旗" }, { "text": "东河区" }, { "text": "固阳县" }, { "text": "九原区" }, { "text": "昆都仑区" }, { "text": "青山区" }, { "text": "石拐区" }, { "text": "土默特右旗" }] }, { "text": "巴彦淖尔市", "children": [{ "text": "磴口县" }, { "text": "杭锦后旗" }, { "text": "临河区" }, { "text": "乌拉特后旗" }, { "text": "乌拉特前旗" }, { "text": "乌拉特中旗" }, { "text": "五原县" }] }, { "text": "赤峰市", "children": [{ "text": "阿鲁科尔沁旗" }, { "text": "敖汉旗" }, { "text": "巴林右旗" }, { "text": "巴林左旗" }, { "text": "红山区" }, { "text": "喀喇沁旗" }, { "text": "克什克腾旗" }, { "text": "林西县" }, { "text": "宁城县" }, { "text": "松山区" }, { "text": "翁牛特旗" }, { "text": "元宝山区" }] }, { "text": "鄂尔多斯市", "children": [{ "text": "达拉特旗" }, { "text": "东胜区" }, { "text": "鄂托克旗" }, { "text": "鄂托克前旗" }, { "text": "杭锦旗" }, { "text": "康巴什区" }, { "text": "乌审旗" }, { "text": "伊金霍洛旗" }, { "text": "准格尔旗" }] }, { "text": "呼和浩特市", "children": [{ "text": "和林格尔县" }, { "text": "回民区" }, { "text": "清水河县" }, { "text": "赛罕区" }, { "text": "土默特左旗" }, { "text": "托克托县" }, { "text": "武川县" }, { "text": "新城区" }, { "text": "玉泉区" }] }, { "text": "呼伦贝尔市", "children": [{ "text": "阿荣旗" }, { "text": "陈巴尔虎旗" }, { "text": "额尔古纳市" }, { "text": "鄂伦春自治旗" }, { "text": "鄂温克族自治旗" }, { "text": "根河市" }, { "text": "海拉尔区" }, { "text": "满洲里市" }, { "text": "莫力达瓦达斡尔族自治旗" }, { "text": "新巴尔虎右旗" }, { "text": "新巴尔虎左旗" }, { "text": "牙克石市" }, { "text": "扎赉诺尔区" }, { "text": "扎兰屯市" }] }, { "text": "通辽市", "children": [{ "text": "霍林郭勒市" }, { "text": "开鲁县" }, { "text": "科尔沁区" }, { "text": "科尔沁左翼后旗" }, { "text": "科尔沁左翼中旗" }, { "text": "库伦旗" }, { "text": "奈曼旗" }, { "text": "扎鲁特旗" }] }, { "text": "乌海市", "children": [{ "text": "海勃湾区" }, { "text": "海南区" }, { "text": "乌达区" }] }, { "text": "乌兰察布市", "children": [{ "text": "察哈尔右翼后旗" }, { "text": "察哈尔右翼前旗" }, { "text": "察哈尔右翼中旗" }, { "text": "丰镇市" }, { "text": "化德县" }, { "text": "集宁区" }, { "text": "凉城县" }, { "text": "商都县" }, { "text": "四子王旗" }, { "text": "兴和县" }, { "text": "卓资县" }] }, { "text": "锡林郭勒盟", "children": [{ "text": "阿巴嘎旗" }, { "text": "东乌珠穆沁旗" }, { "text": "多伦县" }, { "text": "二连浩特市" }, { "text": "苏尼特右旗" }, { "text": "苏尼特左旗" }, { "text": "太仆寺旗" }, { "text": "镶黄旗" }, { "text": "锡林浩特市" }, { "text": "西乌珠穆沁旗" }, { "text": "正蓝旗" }, { "text": "正镶白旗" }] }, { "text": "兴安盟", "children": [{ "text": "阿尔山市" }, { "text": "科尔沁右翼前旗" }, { "text": "科尔沁右翼中旗" }, { "text": "突泉县" }, { "text": "乌兰浩特市" }, { "text": "扎赉特旗" }] }]
            }, {
                "text": "宁夏回族自治区",
                "value": "宁夏回族自治区",
                "children": [{ "text": "固原市", "children": [{ "text": "泾源县" }, { "text": "隆德县" }, { "text": "彭阳县" }, { "text": "西吉县" }, { "text": "原州区" }] }, { "text": "石嘴山市", "children": [{ "text": "大武口区" }, { "text": "惠农区" }, { "text": "平罗县" }] }, { "text": "吴忠市", "children": [{ "text": "红寺堡区" }, { "text": "利通区" }, { "text": "青铜峡市" }, { "text": "同心县" }, { "text": "盐池县" }] }, { "text": "银川市", "children": [{ "text": "贺兰县" }, { "text": "金凤区" }, { "text": "灵武市" }, { "text": "兴庆区" }, { "text": "西夏区" }, { "text": "永宁县" }] }, { "text": "中卫市", "children": [{ "text": "海原县" }, { "text": "沙坡头区" }, { "text": "中宁县" }] }]
            }, {
                "text": "青海省",
                "value": "青海省",
                "children": [{ "text": "果洛藏族自治州", "children": [{ "text": "班玛县" }, { "text": "达日县" }, { "text": "甘德县" }, { "text": "久治县" }, { "text": "玛多县" }, { "text": "玛沁县" }] }, { "text": "海北藏族自治州", "children": [{ "text": "刚察县" }, { "text": "海晏县" }, { "text": "门源回族自治县" }, { "text": "祁连县" }] }, { "text": "海东市", "children": [{ "text": "化隆回族自治县" }, { "text": "互助土族自治县" }, { "text": "乐都区" }, { "text": "民和回族土族自治县" }, { "text": "平安区" }, { "text": "循化撒拉族自治县" }] }, { "text": "海南藏族自治州", "children": [{ "text": "共和县" }, { "text": "贵德县" }, { "text": "贵南县" }, { "text": "同德县" }, { "text": "兴海县" }] }, { "text": "海西蒙古族藏族自治州", "children": [{ "text": "德令哈市" }, { "text": "都兰县" }, { "text": "格尔木市" }, { "text": "海西蒙古族藏族自治州直辖" }, { "text": "茫崖市" }, { "text": "天峻县" }, { "text": "乌兰县" }] }, { "text": "黄南藏族自治州", "children": [{ "text": "河南蒙古族自治县" }, { "text": "尖扎县" }, { "text": "同仁县" }, { "text": "泽库县" }] }, { "text": "西宁市", "children": [{ "text": "城北区" }, { "text": "城东区" }, { "text": "城西区" }, { "text": "城中区" }, { "text": "大通回族土族自治县" }, { "text": "湟源县" }, { "text": "湟中县" }] }, { "text": "玉树藏族自治州", "children": [{ "text": "称多县" }, { "text": "囊谦县" }, { "text": "曲麻莱县" }, { "text": "玉树市" }, { "text": "杂多县" }, { "text": "治多县" }] }]
            }, {
                "text": "山东省",
                "value": "山东省",
                "children": [{ "text": "滨州市", "children": [{ "text": "滨城区" }, { "text": "博兴县" }, { "text": "惠民县" }, { "text": "无棣县" }, { "text": "阳信县" }, { "text": "沾化区" }, { "text": "邹平市" }] }, { "text": "德州市", "children": [{ "text": "德城区" }, { "text": "乐陵市" }, { "text": "陵城区" }, { "text": "临邑县" }, { "text": "宁津县" }, { "text": "平原县" }, { "text": "齐河县" }, { "text": "庆云县" }, { "text": "武城县" }, { "text": "夏津县" }, { "text": "禹城市" }] }, { "text": "东营市", "children": [{ "text": "东营区" }, { "text": "广饶县" }, { "text": "河口区" }, { "text": "垦利区" }, { "text": "利津县" }] }, { "text": "菏泽市", "children": [{ "text": "曹县" }, { "text": "成武县" }, { "text": "单县" }, { "text": "定陶区" }, { "text": "东明县" }, { "text": "鄄城县" }, { "text": "巨野县" }, { "text": "牡丹区" }, { "text": "郓城县" }] }, { "text": "济南市", "children": [{ "text": "长清区" }, { "text": "钢城区" }, { "text": "槐荫区" }, { "text": "济阳区" }, { "text": "莱芜区" }, { "text": "历城区" }, { "text": "历下区" }, { "text": "平阴县" }, { "text": "商河县" }, { "text": "市中区" }, { "text": "天桥区" }, { "text": "章丘区" }] }, { "text": "济宁市", "children": [{ "text": "嘉祥县" }, { "text": "金乡县" }, { "text": "梁山县" }, { "text": "曲阜市" }, { "text": "任城区" }, { "text": "泗水县" }, { "text": "微山县" }, { "text": "汶上县" }, { "text": "兖州区" }, { "text": "鱼台县" }, { "text": "邹城市" }] }, { "text": "聊城市", "children": [{ "text": "茌平县" }, { "text": "东阿县" }, { "text": "东昌府区" }, { "text": "高唐县" }, { "text": "冠县" }, { "text": "临清市" }, { "text": "莘县" }, { "text": "阳谷县" }] }, { "text": "临沂市", "children": [{ "text": "费县" }, { "text": "河东区" }, { "text": "莒南县" }, { "text": "兰陵县" }, { "text": "兰山区" }, { "text": "临沭县" }, { "text": "罗庄区" }, { "text": "蒙阴县" }, { "text": "平邑县" }, { "text": "郯城县" }, { "text": "沂南县" }, { "text": "沂水县" }] }, { "text": "青岛市", "children": [{ "text": "城阳区" }, { "text": "黄岛区" }, { "text": "胶州市" }, { "text": "即墨区" }, { "text": "莱西市" }, { "text": "崂山区" }, { "text": "李沧区" }, { "text": "平度市" }, { "text": "市北区" }, { "text": "市南区" }] }, { "text": "日照市", "children": [{ "text": "东港区" }, { "text": "莒县" }, { "text": "岚山区" }, { "text": "五莲县" }] }, { "text": "泰安市", "children": [{ "text": "岱岳区" }, { "text": "东平县" }, { "text": "肥城市" }, { "text": "宁阳县" }, { "text": "泰山区" }, { "text": "新泰市" }] }, { "text": "潍坊市", "children": [{ "text": "安丘市" }, { "text": "昌乐县" }, { "text": "昌邑市" }, { "text": "坊子区" }, { "text": "高密市" }, { "text": "寒亭区" }, { "text": "奎文区" }, { "text": "临朐县" }, { "text": "青州市" }, { "text": "寿光市" }, { "text": "潍城区" }, { "text": "诸城市" }] }, { "text": "威海市", "children": [{ "text": "环翠区" }, { "text": "荣成市" }, { "text": "乳山市" }, { "text": "文登区" }] }, { "text": "烟台市", "children": [{ "text": "长岛县" }, { "text": "福山区" }, { "text": "海阳市" }, { "text": "莱山区" }, { "text": "莱阳市" }, { "text": "莱州市" }, { "text": "龙口市" }, { "text": "牟平区" }, { "text": "蓬莱市" }, { "text": "栖霞市" }, { "text": "招远市" }, { "text": "芝罘区" }] }, { "text": "枣庄市", "children": [{ "text": "山亭区" }, { "text": "市中区" }, { "text": "台儿庄区" }, { "text": "滕州市" }, { "text": "薛城区" }, { "text": "峄城区" }] }, { "text": "淄博市", "children": [{ "text": "博山区" }, { "text": "高青县" }, { "text": "桓台县" }, { "text": "临淄区" }, { "text": "沂源县" }, { "text": "张店区" }, { "text": "周村区" }, { "text": "淄川区" }] }]
            }, {
                "text": "上海市",
                "value": "上海市",
                "children": [{ "text": "上海城区", "children": [{ "text": "宝山区" }, { "text": "长宁区" }, { "text": "崇明区" }, { "text": "奉贤区" }, { "text": "虹口区" }, { "text": "黄浦区" }, { "text": "嘉定区" }, { "text": "静安区" }, { "text": "金山区" }, { "text": "闵行区" }, { "text": "浦东新区" }, { "text": "普陀区" }, { "text": "青浦区" }, { "text": "松江区" }, { "text": "徐汇区" }, { "text": "杨浦区" }] }]
            }, {
                "text": "陕西省",
                "value": "陕西省",
                "children": [{ "text": "安康市", "children": [{ "text": "白河县" }, { "text": "汉滨区" }, { "text": "汉阴县" }, { "text": "岚皋县" }, { "text": "宁陕县" }, { "text": "平利县" }, { "text": "石泉县" }, { "text": "旬阳县" }, { "text": "镇坪县" }, { "text": "紫阳县" }] }, { "text": "宝鸡市", "children": [{ "text": "陈仓区" }, { "text": "凤县" }, { "text": "凤翔县" }, { "text": "扶风县" }, { "text": "金台区" }, { "text": "麟游县" }, { "text": "陇县" }, { "text": "眉县" }, { "text": "千阳县" }, { "text": "岐山县" }, { "text": "太白县" }, { "text": "渭滨区" }] }, { "text": "汉中市", "children": [{ "text": "城固县" }, { "text": "佛坪县" }, { "text": "汉台区" }, { "text": "留坝县" }, { "text": "略阳县" }, { "text": "勉县" }, { "text": "南郑区" }, { "text": "宁强县" }, { "text": "西乡县" }, { "text": "洋县" }, { "text": "镇巴县" }] }, { "text": "商洛市", "children": [{ "text": "丹凤县" }, { "text": "洛南县" }, { "text": "商南县" }, { "text": "商州区" }, { "text": "山阳县" }, { "text": "镇安县" }, { "text": "柞水县" }] }, { "text": "铜川市", "children": [{ "text": "王益区" }, { "text": "耀州区" }, { "text": "宜君县" }, { "text": "印台区" }] }, { "text": "渭南市", "children": [{ "text": "白水县" }, { "text": "澄城县" }, { "text": "大荔县" }, { "text": "富平县" }, { "text": "韩城市" }, { "text": "合阳县" }, { "text": "华阴市" }, { "text": "华州区" }, { "text": "临渭区" }, { "text": "蒲城县" }, { "text": "潼关县" }] }, { "text": "西安市", "children": [{ "text": "灞桥区" }, { "text": "碑林区" }, { "text": "长安区" }, { "text": "高陵区" }, { "text": "蓝田县" }, { "text": "莲湖区" }, { "text": "临潼区" }, { "text": "未央区" }, { "text": "新城区" }, { "text": "阎良区" }, { "text": "雁塔区" }, { "text": "鄠邑区" }, { "text": "周至县" }] }, { "text": "咸阳市", "children": [{ "text": "彬州市" }, { "text": "长武县" }, { "text": "淳化县" }, { "text": "泾阳县" }, { "text": "礼泉县" }, { "text": "乾县" }, { "text": "秦都区" }, { "text": "三原县" }, { "text": "渭城区" }, { "text": "武功县" }, { "text": "兴平市" }, { "text": "旬邑县" }, { "text": "杨陵区" }, { "text": "永寿县" }] }, { "text": "延安市", "children": [{ "text": "安塞区" }, { "text": "宝塔区" }, { "text": "富县" }, { "text": "甘泉县" }, { "text": "黄陵县" }, { "text": "黄龙县" }, { "text": "洛川县" }, { "text": "吴起县" }, { "text": "延长县" }, { "text": "延川县" }, { "text": "宜川县" }, { "text": "志丹县" }, { "text": "子长县" }] }, { "text": "榆林市", "children": [{ "text": "定边县" }, { "text": "府谷县" }, { "text": "横山区" }, { "text": "佳县" }, { "text": "靖边县" }, { "text": "米脂县" }, { "text": "清涧县" }, { "text": "神木市" }, { "text": "绥德县" }, { "text": "吴堡县" }, { "text": "榆阳区" }, { "text": "子洲县" }] }]
            }, {
                "text": "山西省",
                "value": "山西省",
                "children": [{ "text": "长治市", "children": [{ "text": "长子县" }, { "text": "壶关县" }, { "text": "黎城县" }, { "text": "潞城区" }, { "text": "潞州区" }, { "text": "平顺县" }, { "text": "沁县" }, { "text": "沁源县" }, { "text": "上党区" }, { "text": "屯留区" }, { "text": "武乡县" }, { "text": "襄垣县" }] }, { "text": "大同市", "children": [{ "text": "广灵县" }, { "text": "浑源县" }, { "text": "灵丘县" }, { "text": "平城区" }, { "text": "天镇县" }, { "text": "新荣区" }, { "text": "阳高县" }, { "text": "云冈区" }, { "text": "云州区" }, { "text": "左云县" }] }, { "text": "晋城市", "children": [{ "text": "城区" }, { "text": "高平市" }, { "text": "陵川县" }, { "text": "沁水县" }, { "text": "阳城县" }, { "text": "泽州县" }] }, { "text": "晋中市", "children": [{ "text": "和顺县" }, { "text": "介休市" }, { "text": "灵石县" }, { "text": "平遥县" }, { "text": "祁县" }, { "text": "寿阳县" }, { "text": "太谷县" }, { "text": "昔阳县" }, { "text": "榆次区" }, { "text": "榆社县" }, { "text": "左权县" }] }, { "text": "临汾市", "children": [{ "text": "安泽县" }, { "text": "大宁县" }, { "text": "汾西县" }, { "text": "浮山县" }, { "text": "古县" }, { "text": "洪洞县" }, { "text": "侯马市" }, { "text": "霍州市" }, { "text": "吉县" }, { "text": "蒲县" }, { "text": "曲沃县" }, { "text": "襄汾县" }, { "text": "乡宁县" }, { "text": "隰县" }, { "text": "尧都区" }, { "text": "翼城县" }, { "text": "永和县" }] }, { "text": "吕梁市", "children": [{ "text": "方山县" }, { "text": "汾阳市" }, { "text": "交城县" }, { "text": "交口县" }, { "text": "岚县" }, { "text": "临县" }, { "text": "离石区" }, { "text": "柳林县" }, { "text": "石楼县" }, { "text": "文水县" }, { "text": "孝义市" }, { "text": "兴县" }, { "text": "中阳县" }] }, { "text": "朔州市", "children": [{ "text": "怀仁市" }, { "text": "平鲁区" }, { "text": "山阴县" }, { "text": "朔城区" }, { "text": "应县" }, { "text": "右玉县" }] }, { "text": "太原市", "children": [{ "text": "古交市" }, { "text": "尖草坪区" }, { "text": "晋源区" }, { "text": "娄烦县" }, { "text": "清徐县" }, { "text": "万柏林区" }, { "text": "小店区" }, { "text": "杏花岭区" }, { "text": "阳曲县" }, { "text": "迎泽区" }] }, { "text": "忻州市", "children": [{ "text": "保德县" }, { "text": "代县" }, { "text": "定襄县" }, { "text": "繁峙县" }, { "text": "河曲县" }, { "text": "静乐县" }, { "text": "岢岚县" }, { "text": "宁武县" }, { "text": "偏关县" }, { "text": "神池县" }, { "text": "五台县" }, { "text": "五寨县" }, { "text": "忻府区" }, { "text": "原平市" }] }, { "text": "阳泉市", "children": [{ "text": "城区" }, { "text": "郊区" }, { "text": "矿区" }, { "text": "平定县" }, { "text": "盂县" }] }, { "text": "运城市", "children": [{ "text": "河津市" }, { "text": "绛县" }, { "text": "稷山县" }, { "text": "临猗县" }, { "text": "平陆县" }, { "text": "芮城县" }, { "text": "万荣县" }, { "text": "闻喜县" }, { "text": "夏县" }, { "text": "新绛县" }, { "text": "盐湖区" }, { "text": "永济市" }, { "text": "垣曲县" }] }]
            }, {
                "text": "四川省",
                "value": "四川省",
                "children": [{ "text": "阿坝藏族羌族自治州", "children": [{ "text": "阿坝县" }, { "text": "黑水县" }, { "text": "红原县" }, { "text": "金川县" }, { "text": "九寨沟县" }, { "text": "理县" }, { "text": "马尔康市" }, { "text": "茂县" }, { "text": "壤塘县" }, { "text": "若尔盖县" }, { "text": "松潘县" }, { "text": "汶川县" }, { "text": "小金县" }] }, { "text": "巴中市", "children": [{ "text": "巴州区" }, { "text": "恩阳区" }, { "text": "南江县" }, { "text": "平昌县" }, { "text": "通江县" }] }, { "text": "成都市", "children": [{ "text": "成华区" }, { "text": "崇州市" }, { "text": "大邑县" }, { "text": "都江堰市" }, { "text": "简阳市" }, { "text": "锦江区" }, { "text": "金牛区" }, { "text": "金堂县" }, { "text": "龙泉驿区" }, { "text": "彭州市" }, { "text": "郫都区" }, { "text": "蒲江县" }, { "text": "青白江区" }, { "text": "青羊区" }, { "text": "邛崃市" }, { "text": "双流区" }, { "text": "温江区" }, { "text": "武侯区" }, { "text": "新都区" }, { "text": "新津县" }] }, { "text": "达州市", "children": [{ "text": "达川区" }, { "text": "大竹县" }, { "text": "开江县" }, { "text": "渠县" }, { "text": "通川区" }, { "text": "万源市" }, { "text": "宣汉县" }] }, { "text": "德阳市", "children": [{ "text": "广汉市" }, { "text": "旌阳区" }, { "text": "罗江区" }, { "text": "绵竹市" }, { "text": "什邡市" }, { "text": "中江县" }] }, { "text": "甘孜藏族自治州", "children": [{ "text": "白玉县" }, { "text": "巴塘县" }, { "text": "丹巴县" }, { "text": "稻城县" }, { "text": "道孚县" }, { "text": "德格县" }, { "text": "得荣县" }, { "text": "甘孜县" }, { "text": "九龙县" }, { "text": "康定市" }, { "text": "理塘县" }, { "text": "泸定县" }, { "text": "炉霍县" }, { "text": "色达县" }, { "text": "石渠县" }, { "text": "乡城县" }, { "text": "新龙县" }, { "text": "雅江县" }] }, { "text": "广安市", "children": [{ "text": "广安区" }, { "text": "华蓥市" }, { "text": "邻水县" }, { "text": "前锋区" }, { "text": "武胜县" }, { "text": "岳池县" }] }, { "text": "广元市", "children": [{ "text": "苍溪县" }, { "text": "朝天区" }, { "text": "剑阁县" }, { "text": "利州区" }, { "text": "青川县" }, { "text": "旺苍县" }, { "text": "昭化区" }] }, { "text": "乐山市", "children": [{ "text": "峨边彝族自治县" }, { "text": "峨眉山市" }, { "text": "夹江县" }, { "text": "犍为县" }, { "text": "井研县" }, { "text": "金口河区" }, { "text": "马边彝族自治县" }, { "text": "沐川县" }, { "text": "沙湾区" }, { "text": "市中区" }, { "text": "五通桥区" }] }, { "text": "凉山彝族自治州", "children": [{ "text": "布拖县" }, { "text": "德昌县" }, { "text": "甘洛县" }, { "text": "会东县" }, { "text": "会理县" }, { "text": "金阳县" }, { "text": "雷波县" }, { "text": "美姑县" }, { "text": "冕宁县" }, { "text": "木里藏族自治县" }, { "text": "宁南县" }, { "text": "普格县" }, { "text": "西昌市" }, { "text": "喜德县" }, { "text": "盐源县" }, { "text": "越西县" }, { "text": "昭觉县" }] }, { "text": "泸州市", "children": [{ "text": "古蔺县" }, { "text": "合江县" }, { "text": "江阳区" }, { "text": "龙马潭区" }, { "text": "泸县" }, { "text": "纳溪区" }, { "text": "叙永县" }] }, { "text": "眉山市", "children": [{ "text": "丹棱县" }, { "text": "东坡区" }, { "text": "洪雅县" }, { "text": "彭山区" }, { "text": "青神县" }, { "text": "仁寿县" }] }, { "text": "绵阳市", "children": [{ "text": "安州区" }, { "text": "北川羌族自治县" }, { "text": "涪城区" }, { "text": "江油市" }, { "text": "平武县" }, { "text": "三台县" }, { "text": "盐亭县" }, { "text": "游仙区" }, { "text": "梓潼县" }] }, { "text": "内江市", "children": [{ "text": "东兴区" }, { "text": "隆昌市" }, { "text": "市中区" }, { "text": "威远县" }, { "text": "资中县" }] }, { "text": "南充市", "children": [{ "text": "高坪区" }, { "text": "嘉陵区" }, { "text": "阆中市" }, { "text": "南部县" }, { "text": "蓬安县" }, { "text": "顺庆区" }, { "text": "西充县" }, { "text": "仪陇县" }, { "text": "营山县" }] }, { "text": "攀枝花市", "children": [{ "text": "东区" }, { "text": "米易县" }, { "text": "仁和区" }, { "text": "西区" }, { "text": "盐边县" }] }, { "text": "遂宁市", "children": [{ "text": "安居区" }, { "text": "船山区" }, { "text": "大英县" }, { "text": "蓬溪县" }, { "text": "射洪县" }] }, { "text": "雅安市", "children": [{ "text": "宝兴县" }, { "text": "汉源县" }, { "text": "芦山县" }, { "text": "名山区" }, { "text": "石棉县" }, { "text": "天全县" }, { "text": "荥经县" }, { "text": "雨城区" }] }, { "text": "宜宾市", "children": [{ "text": "长宁县" }, { "text": "翠屏区" }, { "text": "高县" }, { "text": "珙县" }, { "text": "江安县" }, { "text": "筠连县" }, { "text": "南溪区" }, { "text": "屏山县" }, { "text": "兴文县" }, { "text": "叙州区" }] }, { "text": "自贡市", "children": [{ "text": "大安区" }, { "text": "富顺县" }, { "text": "贡井区" }, { "text": "荣县" }, { "text": "沿滩区" }, { "text": "自流井区" }] }, { "text": "资阳市", "children": [{ "text": "安岳县" }, { "text": "乐至县" }, { "text": "雁江区" }] }]
            }, {
                "text": "台湾省",
                "value": "台湾省",
                "children": [{ "text": "高雄市", "children": [{ "text": "阿莲区" }, { "text": "大寮区" }, { "text": "大社区" }, { "text": "大树区" }, { "text": "凤山区" }, { "text": "冈山区" }, { "text": "鼓山区" }, { "text": "湖内区" }, { "text": "甲仙区" }, { "text": "苓雅区" }, { "text": "林园区" }, { "text": "六龟区" }, { "text": "路竹区" }, { "text": "茂林区" }, { "text": "美浓区" }, { "text": "弥陀区" }, { "text": "那玛夏区" }, { "text": "内门区" }, { "text": "楠梓区" }, { "text": "鸟松区" }, { "text": "前金区" }, { "text": "前镇区" }, { "text": "桥头区" }, { "text": "茄萣区" }, { "text": "旗津区" }, { "text": "旗山区" }, { "text": "仁武区" }, { "text": "三民区" }, { "text": "杉林区" }, { "text": "桃源区" }, { "text": "田寮区" }, { "text": "小港区" }, { "text": "新兴区" }, { "text": "燕巢区" }, { "text": "盐埕区" }, { "text": "永安区" }, { "text": "梓官区" }, { "text": "左营区" }] }, { "text": "花莲县", "children": [{ "text": "丰滨乡" }, { "text": "凤林镇" }, { "text": "富里乡" }, { "text": "光复乡" }, { "text": "花莲市" }, { "text": "吉安乡" }, { "text": "瑞穗乡" }, { "text": "寿丰乡" }, { "text": "万荣乡" }, { "text": "新城乡" }, { "text": "秀林乡" }, { "text": "玉里镇" }, { "text": "卓溪乡" }] }, { "text": "嘉义市", "children": [{ "text": "东区" }, { "text": "西区" }] }, { "text": "嘉义县", "children": [{ "text": "阿里山乡" }, { "text": "布袋镇" }, { "text": "大林镇" }, { "text": "大埔乡" }, { "text": "东石乡" }, { "text": "番路乡" }, { "text": "六脚乡" }, { "text": "鹿草乡" }, { "text": "梅山乡" }, { "text": "民雄乡" }, { "text": "朴子市" }, { "text": "水上乡" }, { "text": "太保市" }, { "text": "溪口乡" }, { "text": "新港乡" }, { "text": "义竹乡" }, { "text": "中埔乡" }, { "text": "竹崎乡" }] }, { "text": "基隆市", "children": [{ "text": "安乐区" }, { "text": "暖暖区" }, { "text": "七堵区" }, { "text": "仁爱区" }, { "text": "信义区" }, { "text": "中山区" }, { "text": "中正区" }] }, { "text": "苗栗县", "children": [{ "text": "大湖乡" }, { "text": "公馆乡" }, { "text": "后龙镇" }, { "text": "苗栗市" }, { "text": "南庄乡" }, { "text": "三湾乡" }, { "text": "三义乡" }, { "text": "狮潭乡" }, { "text": "泰安乡" }, { "text": "铜锣乡" }, { "text": "通霄镇" }, { "text": "头份镇" }, { "text": "头屋乡" }, { "text": "西湖乡" }, { "text": "苑里镇" }, { "text": "造桥乡" }, { "text": "竹南镇" }, { "text": "卓兰镇" }] }, { "text": "南投县", "children": [{ "text": "草屯镇" }, { "text": "国姓乡" }, { "text": "集集镇" }, { "text": "鹿谷乡" }, { "text": "名间乡" }, { "text": "南投市" }, { "text": "埔里镇" }, { "text": "仁爱乡" }, { "text": "水里乡" }, { "text": "信义乡" }, { "text": "鱼池乡" }, { "text": "中寮乡" }, { "text": "竹山镇" }] }, { "text": "澎湖县", "children": [{ "text": "白沙乡" }, { "text": "湖西乡" }, { "text": "马公市" }, { "text": "七美乡" }, { "text": "望安乡" }, { "text": "西屿乡" }] }, { "text": "屏东县", "children": [{ "text": "枋寮乡" }, { "text": "枋山乡" }, { "text": "长治乡" }, { "text": "潮州镇" }, { "text": "车城乡" }, { "text": "春日乡" }, { "text": "崁顶乡" }, { "text": "东港镇" }, { "text": "高树乡" }, { "text": "恒春镇" }, { "text": "佳冬乡" }, { "text": "九如乡" }, { "text": "来义乡" }, { "text": "里港乡" }, { "text": "林边乡" }, { "text": "麟洛乡" }, { "text": "琉球乡" }, { "text": "玛家乡" }, { "text": "满州乡" }, { "text": "牡丹乡" }, { "text": "南州乡" }, { "text": "内埔乡" }, { "text": "屏东市" }, { "text": "三地门乡" }, { "text": "狮子乡" }, { "text": "泰武乡" }, { "text": "万丹乡" }, { "text": "万峦乡" }, { "text": "雾台乡" }, { "text": "新埤乡" }, { "text": "新园乡" }, { "text": "盐埔乡" }, { "text": "竹田乡" }] }, { "text": "台北市", "children": [{ "text": "北投区" }, { "text": "大安区" }, { "text": "大同区" }, { "text": "内湖区" }, { "text": "南港区" }, { "text": "士林区" }, { "text": "松山区" }, { "text": "万华区" }, { "text": "文山区" }, { "text": "信义区" }, { "text": "中山区" }, { "text": "中正区" }] }, { "text": "台东县", "children": [{ "text": "卑南乡" }, { "text": "长滨乡" }, { "text": "成功镇" }, { "text": "池上乡" }, { "text": "达仁乡" }, { "text": "大武乡" }, { "text": "东河乡" }, { "text": "关山镇" }, { "text": "海端乡" }, { "text": "金峰乡" }, { "text": "兰屿乡" }, { "text": "鹿野乡" }, { "text": "绿岛乡" }, { "text": "台东市" }, { "text": "太麻里乡" }, { "text": "延平乡" }] }, { "text": "台南市", "children": [{ "text": "安定区" }, { "text": "安南区" }, { "text": "安平区" }, { "text": "白河区" }, { "text": "北门区" }, { "text": "北区" }, { "text": "大内区" }, { "text": "东区" }, { "text": "东山区" }, { "text": "关庙区" }, { "text": "官田区" }, { "text": "归仁区" }, { "text": "后壁区" }, { "text": "佳里区" }, { "text": "将军区" }, { "text": "六甲区" }, { "text": "柳营区" }, { "text": "龙崎区" }, { "text": "麻豆区" }, { "text": "南化区" }, { "text": "南区" }, { "text": "楠西区" }, { "text": "七股区" }, { "text": "仁德区" }, { "text": "善化区" }, { "text": "山上区" }, { "text": "下营区" }, { "text": "西港区" }, { "text": "新化区" }, { "text": "新市区" }, { "text": "新营区" }, { "text": "学甲区" }, { "text": "盐水区" }, { "text": "永康区" }, { "text": "玉井区" }, { "text": "中西区" }, { "text": "左镇区" }] }, { "text": "台中市", "children": [{ "text": "北区" }, { "text": "北屯区" }, { "text": "大安区" }, { "text": "大肚区" }, { "text": "大甲区" }, { "text": "大里区" }, { "text": "大雅区" }, { "text": "东区" }, { "text": "东势区" }, { "text": "丰原区" }, { "text": "和平区" }, { "text": "后里区" }, { "text": "龙井区" }, { "text": "南区" }, { "text": "南屯区" }, { "text": "清水区" }, { "text": "沙鹿区" }, { "text": "神冈区" }, { "text": "石冈区" }, { "text": "太平区" }, { "text": "潭子区" }, { "text": "外埔区" }, { "text": "雾峰区" }, { "text": "梧栖区" }, { "text": "乌日区" }, { "text": "新社区" }, { "text": "西区" }, { "text": "西屯区" }, { "text": "中区" }] }, { "text": "桃园市", "children": [{ "text": "八德市" }, { "text": "大溪镇" }, { "text": "大园乡" }, { "text": "复兴乡" }, { "text": "观音乡" }, { "text": "龟山乡" }, { "text": "龙潭乡" }, { "text": "芦竹乡" }, { "text": "平镇市" }, { "text": "桃园区" }, { "text": "新屋乡" }, { "text": "杨梅市" }, { "text": "中坜市" }] }, { "text": "新北市", "children": [{ "text": "八里区" }, { "text": "板桥区" }, { "text": "淡水区" }, { "text": "贡寮区" }, { "text": "金山区" }, { "text": "林口区" }, { "text": "芦洲区" }, { "text": "坪林区" }, { "text": "平溪区" }, { "text": "瑞芳区" }, { "text": "三峡区" }, { "text": "三芝区" }, { "text": "三重区" }, { "text": "深坑区" }, { "text": "石碇区" }, { "text": "石门区" }, { "text": "双溪区" }, { "text": "树林区" }, { "text": "泰山区" }, { "text": "土城区" }, { "text": "万里区" }, { "text": "五股区" }, { "text": "乌来区" }, { "text": "新店区" }, { "text": "新庄区" }, { "text": "汐止区" }, { "text": "莺歌区" }, { "text": "永和区" }, { "text": "中和区" }] }, { "text": "新竹市", "children": [{ "text": "北区" }, { "text": "东区" }, { "text": "香山区" }] }, { "text": "新竹县", "children": [{ "text": "宝山乡" }, { "text": "北埔乡" }, { "text": "峨眉乡" }, { "text": "关西镇" }, { "text": "横山乡" }, { "text": "湖口乡" }, { "text": "尖石乡" }, { "text": "五峰乡" }, { "text": "新丰乡" }, { "text": "新埔镇" }, { "text": "芎林乡" }, { "text": "竹北市" }, { "text": "竹东镇" }] }, { "text": "宜兰县", "children": [{ "text": "大同乡" }, { "text": "冬山乡" }, { "text": "礁溪乡" }, { "text": "罗东镇" }, { "text": "南澳乡" }, { "text": "三星乡" }, { "text": "苏澳镇" }, { "text": "头城镇" }, { "text": "五结乡" }, { "text": "宜兰市" }, { "text": "员山乡" }, { "text": "壮围乡" }] }, { "text": "云林县", "children": [{ "text": "褒忠乡" }, { "text": "北港镇" }, { "text": "大埤乡" }, { "text": "东势乡" }, { "text": "斗六市" }, { "text": "斗南镇" }, { "text": "二仑乡" }, { "text": "古坑乡" }, { "text": "虎尾镇" }, { "text": "口湖乡" }, { "text": "林内乡" }, { "text": "仑背乡" }, { "text": "麦寮乡" }, { "text": "水林乡" }, { "text": "四湖乡" }, { "text": "台西乡" }, { "text": "莿桐乡" }, { "text": "土库镇" }, { "text": "西螺镇" }, { "text": "元长乡" }] }, { "text": "彰化县", "children": [{ "text": "北斗镇" }, { "text": "埤头乡" }, { "text": "大城乡" }, { "text": "大村乡" }, { "text": "二林镇" }, { "text": "二水乡" }, { "text": "芳苑乡" }, { "text": "芬园乡" }, { "text": "福兴乡" }, { "text": "和美镇" }, { "text": "花坛乡" }, { "text": "鹿港镇" }, { "text": "埔心乡" }, { "text": "埔盐乡" }, { "text": "伸港乡" }, { "text": "社头乡" }, { "text": "田尾乡" }, { "text": "田中镇" }, { "text": "线西乡" }, { "text": "溪湖镇" }, { "text": "秀水乡" }, { "text": "溪州乡" }, { "text": "永靖乡" }, { "text": "员林镇" }, { "text": "彰化市" }, { "text": "竹塘乡" }] }]
            }, {
                "text": "天津市",
                "value": "天津市",
                "children": [{ "text": "天津城区", "children": [{ "text": "宝坻区" }, { "text": "北辰区" }, { "text": "滨海新区" }, { "text": "东丽区" }, { "text": "河北区" }, { "text": "河东区" }, { "text": "和平区" }, { "text": "河西区" }, { "text": "红桥区" }, { "text": "静海区" }, { "text": "津南区" }, { "text": "蓟州区" }, { "text": "南开区" }, { "text": "宁河区" }, { "text": "武清区" }, { "text": "西青区" }] }]
            }, {
                "text": "香港特别行政区",
                "value": "香港特别行政区",
                "children": [{ "text": "香港城区", "children": [{ "text": "北区" }, { "text": "大埔区" }, { "text": "东区" }, { "text": "观塘区" }, { "text": "黄大仙区" }, { "text": "九龙城区" }, { "text": "葵青区" }, { "text": "离岛区" }, { "text": "南区" }, { "text": "荃湾区" }, { "text": "沙田区" }, { "text": "深水埗区" }, { "text": "屯门区" }, { "text": "湾仔区" }, { "text": "西贡区" }, { "text": "油尖旺区" }, { "text": "元朗区" }, { "text": "中西区" }] }]
            }, {
                "text": "西藏自治区",
                "value": "西藏自治区",
                "children": [{ "text": "阿里地区", "children": [{ "text": "措勤县" }, { "text": "噶尔县" }, { "text": "改则县" }, { "text": "革吉县" }, { "text": "普兰县" }, { "text": "日土县" }, { "text": "札达县" }] }, { "text": "昌都市", "children": [{ "text": "八宿县" }, { "text": "边坝县" }, { "text": "察雅县" }, { "text": "丁青县" }, { "text": "贡觉县" }, { "text": "江达县" }, { "text": "卡若区" }, { "text": "类乌齐县" }, { "text": "洛隆县" }, { "text": "芒康县" }, { "text": "左贡县" }] }, { "text": "拉萨市", "children": [{ "text": "城关区" }, { "text": "当雄县" }, { "text": "达孜区" }, { "text": "堆龙德庆区" }, { "text": "林周县" }, { "text": "墨竹工卡县" }, { "text": "尼木县" }, { "text": "曲水县" }] }, { "text": "林芝市", "children": [{ "text": "巴宜区" }, { "text": "波密县" }, { "text": "察隅县" }, { "text": "工布江达县" }, { "text": "朗县" }, { "text": "米林县" }, { "text": "墨脱县" }] }, { "text": "那曲市", "children": [{ "text": "安多县" }, { "text": "班戈县" }, { "text": "巴青县" }, { "text": "比如县" }, { "text": "嘉黎县" }, { "text": "聂荣县" }, { "text": "尼玛县" }, { "text": "色尼区" }, { "text": "申扎县" }, { "text": "双湖县" }, { "text": "索县" }] }, { "text": "日喀则市", "children": [{ "text": "昂仁县" }, { "text": "白朗县" }, { "text": "定结县" }, { "text": "定日县" }, { "text": "岗巴县" }, { "text": "江孜县" }, { "text": "吉隆县" }, { "text": "康马县" }, { "text": "拉孜县" }, { "text": "南木林县" }, { "text": "聂拉木县" }, { "text": "仁布县" }, { "text": "萨嘎县" }, { "text": "萨迦县" }, { "text": "桑珠孜区" }, { "text": "谢通门县" }, { "text": "亚东县" }, { "text": "仲巴县" }] }, { "text": "山南市", "children": [{ "text": "措美县" }, { "text": "错那县" }, { "text": "贡嘎县" }, { "text": "加查县" }, { "text": "浪卡子县" }, { "text": "隆子县" }, { "text": "洛扎县" }, { "text": "乃东区" }, { "text": "琼结县" }, { "text": "曲松县" }, { "text": "桑日县" }, { "text": "扎囊县" }] }]
            }, {
                "text": "新疆维吾尔自治区",
                "value": "新疆维吾尔自治区",
                "children": [{ "text": "阿克苏地区", "children": [{ "text": "阿克苏市" }, { "text": "阿瓦提县" }, { "text": "拜城县" }, { "text": "柯坪县" }, { "text": "库车县" }, { "text": "沙雅县" }, { "text": "温宿县" }, { "text": "乌什县" }, { "text": "新和县" }] }, { "text": "阿拉尔市", "children": [{ "text": "阿拉尔农场" }, { "text": "兵团八团" }, { "text": "兵团第一师水利水电工程处" }, { "text": "兵团第一师塔里木灌区水利管理处" }, { "text": "兵团第一师幸福农场" }, { "text": "兵团七团" }, { "text": "兵团十二团" }, { "text": "兵团十六团" }, { "text": "兵团十三团" }, { "text": "兵团十四团" }, { "text": "兵团十团" }, { "text": "兵团十一团" }, { "text": "工业园区" }, { "text": "金银川路街道" }, { "text": "南口街道" }, { "text": "青松路街道" }, { "text": "托喀依乡" }, { "text": "幸福路街道" }, { "text": "中心监狱" }] }, { "text": "阿勒泰地区", "children": [{ "text": "阿勒泰市" }, { "text": "布尔津县" }, { "text": "福海县" }, { "text": "富蕴县" }, { "text": "哈巴河县" }, { "text": "吉木乃县" }, { "text": "青河县" }] }, { "text": "巴音郭楞蒙古自治州", "children": [{ "text": "博湖县" }, { "text": "和静县" }, { "text": "和硕县" }, { "text": "库尔勒市" }, { "text": "轮台县" }, { "text": "且末县" }, { "text": "若羌县" }, { "text": "尉犁县" }, { "text": "焉耆回族自治县" }] }, { "text": "北屯市", "children": [{ "text": "北屯镇" }, { "text": "兵团一八八团" }, { "text": "兵团一八七团" }, { "text": "兵团一八三团" }] }, { "text": "博尔塔拉蒙古自治州", "children": [{ "text": "阿拉山口市" }, { "text": "博乐市" }, { "text": "精河县" }, { "text": "温泉县" }] }, { "text": "昌吉回族自治州", "children": [{ "text": "昌吉市" }, { "text": "阜康市" }, { "text": "呼图壁县" }, { "text": "吉木萨尔县" }, { "text": "玛纳斯县" }, { "text": "木垒哈萨克自治县" }, { "text": "奇台县" }] }, { "text": "哈密市", "children": [{ "text": "巴里坤哈萨克自治县" }, { "text": "伊吾县" }, { "text": "伊州区" }] }, { "text": "和田地区", "children": [{ "text": "策勒县" }, { "text": "和田市" }, { "text": "和田县" }, { "text": "洛浦县" }, { "text": "民丰县" }, { "text": "墨玉县" }, { "text": "皮山县" }, { "text": "于田县" }] }, { "text": "喀什地区", "children": [{ "text": "巴楚县" }, { "text": "伽师县" }, { "text": "喀什市" }, { "text": "麦盖提县" }, { "text": "莎车县" }, { "text": "疏附县" }, { "text": "疏勒县" }, { "text": "塔什库尔干塔吉克自治县" }, { "text": "叶城县" }, { "text": "英吉沙县" }, { "text": "岳普湖县" }, { "text": "泽普县" }] }, { "text": "可克达拉市", "children": [{ "text": "兵团六十八团" }, { "text": "兵团六十六团" }, { "text": "兵团六十七团" }, { "text": "兵团六十三团" }, { "text": "兵团六十四团" }, { "text": "都拉塔口岸" }] }, { "text": "克拉玛依市", "children": [{ "text": "白碱滩区" }, { "text": "独山子区" }, { "text": "克拉玛依区" }, { "text": "乌尔禾区" }] }, { "text": "克孜勒苏柯尔克孜自治州", "children": [{ "text": "阿合奇县" }, { "text": "阿克陶县" }, { "text": "阿图什市" }, { "text": "乌恰县" }] }, { "text": "昆玉市", "children": [{ "text": "兵团二二四团" }, { "text": "兵团皮山农场" }, { "text": "兵团四十七团" }, { "text": "兵团一牧场" }, { "text": "博斯坦乡" }, { "text": "喀拉喀什镇" }, { "text": "阔依其乡" }, { "text": "奴尔乡" }, { "text": "普恰克其乡" }, { "text": "乌尔其乡" }, { "text": "乌鲁克萨依乡" }] }, { "text": "石河子市", "children": [{ "text": "北泉镇" }, { "text": "兵团一五二团" }, { "text": "东城街道" }, { "text": "红山街道" }, { "text": "老街街道" }, { "text": "石河子乡" }, { "text": "向阳街道" }, { "text": "新城街道" }] }, { "text": "双河市", "children": [{ "text": "兵团八十九团" }, { "text": "兵团八十六团" }, { "text": "兵团八十四团" }, { "text": "兵团八十一团" }, { "text": "兵团九十团" }] }, { "text": "塔城地区", "children": [{ "text": "额敏县" }, { "text": "和布克赛尔蒙古自治县" }, { "text": "沙湾县" }, { "text": "塔城市" }, { "text": "托里县" }, { "text": "乌苏市" }, { "text": "裕民县" }] }, { "text": "铁门关市", "children": [{ "text": "兵团二十九团" }, { "text": "农二师三十团" }] }, { "text": "吐鲁番市", "children": [{ "text": "高昌区" }, { "text": "鄯善县" }, { "text": "托克逊县" }] }, { "text": "图木舒克市", "children": [{ "text": "兵团四十九团" }, { "text": "兵团四十四团" }, { "text": "兵团图木舒克市喀拉拜勒镇" }, { "text": "兵团图木舒克市永安坝" }, { "text": "兵团五十三团" }, { "text": "兵团五十团" }, { "text": "兵团五十一团" }, { "text": "前海街道" }, { "text": "齐干却勒街道" }, { "text": "永安坝街道" }] }, { "text": "五家渠市", "children": [{ "text": "兵团一零二团" }, { "text": "兵团一零三团" }, { "text": "兵团一零一团" }, { "text": "军垦路街道" }, { "text": "青湖路街道" }, { "text": "人民路街道" }] }, { "text": "乌鲁木齐市", "children": [{ "text": "达坂城区" }, { "text": "米东区" }, { "text": "沙依巴克区" }, { "text": "水磨沟区" }, { "text": "天山区" }, { "text": "头屯河区" }, { "text": "乌鲁木齐县" }, { "text": "新市区" }] }, { "text": "伊犁哈萨克自治州", "children": [{ "text": "察布查尔锡伯自治县" }, { "text": "巩留县" }, { "text": "霍城县" }, { "text": "霍尔果斯市" }, { "text": "奎屯市" }, { "text": "尼勒克县" }, { "text": "特克斯县" }, { "text": "新源县" }, { "text": "伊宁市" }, { "text": "伊宁县" }, { "text": "昭苏县" }] }]
            }, {
                "text": "云南省",
                "value": "云南省",
                "children": [{ "text": "保山市", "children": [{ "text": "昌宁县" }, { "text": "龙陵县" }, { "text": "隆阳区" }, { "text": "施甸县" }, { "text": "腾冲市" }] }, { "text": "楚雄彝族自治州", "children": [{ "text": "楚雄市" }, { "text": "大姚县" }, { "text": "禄丰县" }, { "text": "牟定县" }, { "text": "南华县" }, { "text": "双柏县" }, { "text": "武定县" }, { "text": "姚安县" }, { "text": "永仁县" }, { "text": "元谋县" }] }, { "text": "大理白族自治州", "children": [{ "text": "宾川县" }, { "text": "大理市" }, { "text": "洱源县" }, { "text": "鹤庆县" }, { "text": "剑川县" }, { "text": "弥渡县" }, { "text": "南涧彝族自治县" }, { "text": "巍山彝族回族自治县" }, { "text": "祥云县" }, { "text": "漾濞彝族自治县" }, { "text": "永平县" }, { "text": "云龙县" }] }, { "text": "德宏傣族景颇族自治州", "children": [{ "text": "梁河县" }, { "text": "陇川县" }, { "text": "芒市" }, { "text": "瑞丽市" }, { "text": "盈江县" }] }, { "text": "迪庆藏族自治州", "children": [{ "text": "德钦县" }, { "text": "维西傈僳族自治县" }, { "text": "香格里拉市" }] }, { "text": "红河哈尼族彝族自治州", "children": [{ "text": "个旧市" }, { "text": "河口瑶族自治县" }, { "text": "红河县" }, { "text": "建水县" }, { "text": "金平苗族瑶族傣族自治县" }, { "text": "开远市" }, { "text": "泸西县" }, { "text": "绿春县" }, { "text": "蒙自市" }, { "text": "弥勒市" }, { "text": "屏边苗族自治县" }, { "text": "石屏县" }, { "text": "元阳县" }] }, { "text": "昆明市", "children": [{ "text": "安宁市" }, { "text": "呈贡区" }, { "text": "东川区" }, { "text": "富民县" }, { "text": "官渡区" }, { "text": "晋宁区" }, { "text": "禄劝彝族苗族自治县" }, { "text": "盘龙区" }, { "text": "石林彝族自治县" }, { "text": "嵩明县" }, { "text": "五华区" }, { "text": "西山区" }, { "text": "寻甸回族彝族自治县" }, { "text": "宜良县" }] }, { "text": "丽江市", "children": [{ "text": "古城区" }, { "text": "华坪县" }, { "text": "宁蒗彝族自治县" }, { "text": "永胜县" }, { "text": "玉龙纳西族自治县" }] }, { "text": "临沧市", "children": [{ "text": "沧源佤族自治县" }, { "text": "凤庆县" }, { "text": "耿马傣族佤族自治县" }, { "text": "临翔区" }, { "text": "双江拉祜族佤族布朗族傣族自治县" }, { "text": "永德县" }, { "text": "云县" }, { "text": "镇康县" }] }, { "text": "怒江傈僳族自治州", "children": [{ "text": "福贡县" }, { "text": "贡山独龙族怒族自治县" }, { "text": "兰坪白族普米族自治县" }, { "text": "泸水市" }] }, { "text": "普洱市", "children": [{ "text": "江城哈尼族彝族自治县" }, { "text": "景东彝族自治县" }, { "text": "景谷傣族彝族自治县" }, { "text": "澜沧拉祜族自治县" }, { "text": "孟连傣族拉祜族佤族自治县" }, { "text": "墨江哈尼族自治县" }, { "text": "宁洱哈尼族彝族自治县" }, { "text": "思茅区" }, { "text": "西盟佤族自治县" }, { "text": "镇沅彝族哈尼族拉祜族自治县" }] }, { "text": "曲靖市", "children": [{ "text": "富源县" }, { "text": "会泽县" }, { "text": "陆良县" }, { "text": "罗平县" }, { "text": "马龙区" }, { "text": "麒麟区" }, { "text": "师宗县" }, { "text": "宣威市" }, { "text": "沾益区" }] }, { "text": "文山壮族苗族自治州", "children": [{ "text": "富宁县" }, { "text": "广南县" }, { "text": "马关县" }, { "text": "麻栗坡县" }, { "text": "丘北县" }, { "text": "文山市" }, { "text": "西畴县" }, { "text": "砚山县" }] }, { "text": "西双版纳傣族自治州", "children": [{ "text": "景洪市" }, { "text": "勐海县" }, { "text": "勐腊县" }] }, { "text": "玉溪市", "children": [{ "text": "澄江县" }, { "text": "峨山彝族自治县" }, { "text": "红塔区" }, { "text": "华宁县" }, { "text": "江川区" }, { "text": "通海县" }, { "text": "新平彝族傣族自治县" }, { "text": "易门县" }, { "text": "元江哈尼族彝族傣族自治县" }] }, { "text": "昭通市", "children": [{ "text": "大关县" }, { "text": "鲁甸县" }, { "text": "巧家县" }, { "text": "水富市" }, { "text": "绥江县" }, { "text": "威信县" }, { "text": "盐津县" }, { "text": "彝良县" }, { "text": "永善县" }, { "text": "昭阳区" }, { "text": "镇雄县" }] }]
            }, {
                "text": "浙江省",
                "value": "浙江省",
                "children": [{ "text": "杭州市", "children": [{ "text": "滨江区" }, { "text": "淳安县" }, { "text": "富阳区" }, { "text": "拱墅区" }, { "text": "建德市" }, { "text": "江干区" }, { "text": "临安区" }, { "text": "上城区" }, { "text": "桐庐县" }, { "text": "下城区" }, { "text": "萧山区" }, { "text": "西湖区" }, { "text": "余杭区" }] }, { "text": "湖州市", "children": [{ "text": "安吉县" }, { "text": "长兴县" }, { "text": "德清县" }, { "text": "南浔区" }, { "text": "吴兴区" }] }, { "text": "嘉兴市", "children": [{ "text": "海宁市" }, { "text": "海盐县" }, { "text": "嘉善县" }, { "text": "南湖区" }, { "text": "平湖市" }, { "text": "桐乡市" }, { "text": "秀洲区" }] }, { "text": "金华市", "children": [{ "text": "东阳市" }, { "text": "金东区" }, { "text": "兰溪市" }, { "text": "婺城区" }, { "text": "磐安县" }, { "text": "浦江县" }, { "text": "武义县" }, { "text": "义乌市" }, { "text": "永康市" }] }, { "text": "丽水市", "children": [{ "text": "景宁畲族自治县" }, { "text": "缙云县" }, { "text": "莲都区" }, { "text": "龙泉市" }, { "text": "青田县" }, { "text": "庆元县" }, { "text": "松阳县" }, { "text": "遂昌县" }, { "text": "云和县" }] }, { "text": "宁波市", "children": [{ "text": "北仑区" }, { "text": "慈溪市" }, { "text": "奉化区" }, { "text": "海曙区" }, { "text": "江北区" }, { "text": "宁海县" }, { "text": "象山县" }, { "text": "鄞州区" }, { "text": "余姚市" }, { "text": "镇海区" }] }, { "text": "衢州市", "children": [{ "text": "常山县" }, { "text": "江山市" }, { "text": "开化县" }, { "text": "柯城区" }, { "text": "龙游县" }, { "text": "衢江区" }] }, { "text": "绍兴市", "children": [{ "text": "嵊州市" }, { "text": "柯桥区" }, { "text": "上虞区" }, { "text": "新昌县" }, { "text": "越城区" }, { "text": "诸暨市" }] }, { "text": "台州市", "children": [{ "text": "黄岩区" }, { "text": "椒江区" }, { "text": "临海市" }, { "text": "路桥区" }, { "text": "三门县" }, { "text": "天台县" }, { "text": "温岭市" }, { "text": "仙居县" }, { "text": "玉环市" }] }, { "text": "温州市", "children": [{ "text": "苍南县" }, { "text": "洞头区" }, { "text": "乐清市" }, { "text": "龙湾区" }, { "text": "鹿城区" }, { "text": "瓯海区" }, { "text": "平阳县" }, { "text": "瑞安市" }, { "text": "泰顺县" }, { "text": "文成县" }, { "text": "永嘉县" }] }, { "text": "舟山市", "children": [{ "text": "嵊泗县" }, { "text": "岱山县" }, { "text": "定海区" }, { "text": "普陀区" }] }]
            }];
            try {
                for (const city of options) {
                    try {
                        for (const zone of city.children) {
                            zone.value = zone.text;
                            try {
                                for (const block of zone.children) {
                                    block.value = block.text;
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
                Betools.storage.setStore(`system_city_data`, JSON.stringify(options), 3600 * 24 * 365);
            } catch (error) {
                console.log(error);
            }
            return options;
        } else {
            return data;
        }
    },

    /**
     * 添加数据
     * @param {*} tableName
     * @param {*} id
     */
    async deleteTableDataByWhere(tableName, fieldName, fieldValue) {
        //大写转小写
        tableName = tableName.toLowerCase();
        //delete数据的URL地址
        var deleteURL = `${window.BECONFIG['xmysqlAPI']}/api/${tableName}?fieldName=${fieldName}&fieldValue=${fieldValue}`;
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