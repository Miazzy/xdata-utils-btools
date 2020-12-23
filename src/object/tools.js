class tools {

    /** 构造函数 */
    constructor() {}

    /**
     * @description 过滤对象中为空的属性
     * @param obj
     * @returns {*}
     */
    filterObj(obj) {
        if (!(typeof obj == 'object')) {
            return;
        }
        for (var key in obj) {
            if (
                obj.hasOwnProperty(key) &&
                (obj[key] == null || obj[key] == undefined || obj[key] === '')
            ) {
                delete obj[key];
            }
        }
        return obj;
    }

    /**
     * @description 过滤空对象
     * @param {*} data
     */
    deNull(data, defaultValue = '') {
        try {
            if (typeof data == 'undefined' || data == null || data == '' || JSON.stringify(data) == "{}") {
                return defaultValue;
            } else {
                return data;
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * @description 过滤空对象
     * @param {*} data
     */
    isNull(data) {
        try {
            if (typeof data == 'undefined' || data == null || data == '' || JSON.stringify(data) == "{}") {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * @description 过滤空对象
     * @param {*} data
     */
    isBlank(data) {
        try {
            return isNull(data);
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * @description 过滤空对象
     * @param {*} data
     */
    isEmpty(data) {
        try {
            return isNull(data);
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * @description JS Sleep休眠函数
     * @param {*} time
     */
    async sleep(time = 1000) {
        return new Promise(function(resolve) { return setTimeout(resolve, time) });
    }

    /**
     * @description 获取百分率占比(除法)
     * @param {*} value
     * @param {*} total
     * @param {*} ratio
     */
    divisionPercentage(value = 0.0, total = 100.00, ratio = (0.00).toFixed(2)) {
        value = typeof value == 'string' ? parseFloat(value) : value;
        total = typeof total == 'string' ? parseFloat(total) : total;
        try {
            ratio = isNull(total) ? (0.00).toFixed(2) : parseFloat(value / total * 100).toFixed(2);
        } catch (error) {
            console.log(error);
        }
        return ratio;
    }


    /**
     * 深度克隆对象、数组
     * @param obj 被克隆的对象
     * @return 克隆后的对象
     */
    cloneObject(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * @description clone对象
     * @param {*} obj 被克隆对象
     */
    clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * 随机生成数字
     *
     * 示例：生成长度为 12 的随机数：randomNumber(12)
     * 示例：生成 3~23 之间的随机数：randomNumber(3, 23)
     *
     * @param1 最小值 | 长度
     * @param2 最大值
     * @return int 生成后的数字
     */
    randomNumber() {
        // 生成 最小值 到 最大值 区间的随机数
        const random = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1) + min);
        };
        if (arguments.length === 1) {
            let [length] = arguments;
            // 生成指定长度的随机数字，首位一定不是 0
            let nums = [...Array(length).keys()].map(
                i => (i > 0 ? random(0, 9) : random(1, 9))
            );
            return parseInt(nums.join(''));
        } else if (arguments.length >= 2) {
            let [min, max] = arguments;
            return random(min, max);
        } else {
            return Number.NaN;
        }
    }

    /**
     * @description 检查是否为微信
     */
    isWechat() {
        var ua = navigator.userAgent.toLowerCase();
        var sua = window.localStorage.getItem('system_navigator_useragent') || '';
        if (ua.match(/MicroMessenger/i) == "micromessenger" || sua.match(/MicroMessenger/i) == "micromessenger") { //这就是微信用的内置浏览器
            return true;
        } else {
            return true;
        }
    }

    /**
     * @description 检查是否为微信
     */
    isWework() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") { //这就是微信用的内置浏览器
            return true;
        } else {
            return false;
        }
    }

    /**
     * @description 检查是否为微信
     */
    isPCWeb() {
        var ua = navigator.userAgent.toLowerCase();
        var sua = window.localStorage.getItem('system_navigator_useragent') || '';
        if (ua.match(/MicroMessenger/i) == "micromessenger" || sua.match(/MicroMessenger/i) == "micromessenger") { //这就是微信用的内置浏览器
            return false;
        } else {
            return true;
        }
    }

    queryZoneProject(company = '', name, zone = '', project = '') {
        let temp = company.split(name);
        console.log(`${temp.toString()}`);
        if (temp[1].includes('>')) {
            temp[1] = temp[1].replace('项目组>', '');
            zone = temp[1].split('>')[0];
            project = temp[1].split('>')[1];
        } else {
            zone = temp[1];
        }
        return { company, zone, project };
    }

    queryZoneProjectAll(company, cnamelist = ['领地集团有限公司', '领悦服务', '宝瑞商管', '医疗健康板块', '金融板块', '邛崃创达公司'], department = '') {
        try {
            let zone = '';
            let project = department ? department.slice(0, department.lastIndexOf('>')) : '';
            department = department ? department.slice(department.lastIndexOf('>') + 1) : '';
            for (const name of cnamelist) {
                if (company.includes(`>${name}>`)) {
                    let temp = queryZoneProject(company, `>${name}>`);
                    company = name;
                    zone = temp.zone;
                    project = !temp.project ? project : temp.project;
                    break;
                }
            }
            return { company, zone, project, department };
        } catch (error) {
            return { company, zone: '', project: '', department };
        }
    }

    /**
     * 随机生成字符串
     * @param length 字符串的长度
     * @param chats 可选字符串区间（只会生成传入的字符串中的字符）
     * @return string 生成的字符串
     */
    randomString(length, chats) {
        if (!length) length = 1;
        if (!chats) chats = '0123456789qwertyuioplkjhgfdsazxcvbnm';
        let str = '';
        for (let i = 0; i < length; i++) {
            let num = randomNumber(0, chats.length - 1);
            str += chats[num];
        }
        return str;
    }

    /**
     * 随机生成uuid
     * @return string 生成的uuid
     */
    randomUUID() {
        let chats = '0123456789abcdef';
        return randomString(32, chats);
    }

    /**
     * 下划线转驼峰
     * @param string
     * @returns {*}
     */
    underLine2CamelCase(string) {
        return string.replace(/_([a-z])/g, function(all, letter) {
            return letter.toUpperCase();
        });
    }

    /**
     * 邮箱
     * @param {*} s
     */
    isEmail(s) {
        return /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
    }

    /**
     * 手机号码
     * @param {*} s
     */
    isMobile(s) {
        return /^1[0-9]{10}$/.test(s)
    }

    /**
     * 电话号码
     * @param {*} s
     */
    isPhone(s) {
        return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
    }

    /**
     * URL地址
     * @param {*} s
     */
    isURL(s) {
        return /^http[s]?:\/\/.*/.test(s)
    }

    /**
     * @description 去除字符串中html标签
     * @param {*} str
     */
    delHtmlTag(str) {
        try {
            if (isNull(str)) {
                return ""; //去掉所有的html标记
            } else {
                return deNull(str).replace(/<[^>]+>/g, "").replace(/&nbsp;/g, ""); //去掉所有的html标记
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * @description 字符串缩略函数
     * @param {*} str
     */
    abbreviation(str, length = 75) {
        try {

            if (deNull(str).length < length) {
                return deNull(str).trim();
            } else {
                return deNull(str).trim().substring(0, length) + '...';
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * @description 查询文档对应预览地址
     * @param {*} text
     */
    async queryFileViewURL(text) {

        //文档URL
        var url = '';

        //查询文档对应预览地址
        try {
            //获取小写文档下载地址
            var textURL = deNull(text).toLowerCase();
            //如果不含有office文档
            if (!(
                    textURL.includes('doc') ||
                    textURL.includes('ppt') ||
                    textURL.includes('xls') ||
                    textURL.includes('pdf')
                )) {
                return false;
            }

            //文档数组
            var fileList = [];

            if (text.indexOf(',') > 0) {
                fileList = text.split(',');
            } else {
                fileList.push(text);
            }

            //获取第一个office文档
            url = window.__.find(fileList, function(text) {
                //获取小写字符串
                text = deNull(text).toLowerCase();
                return (
                    text.includes('doc') ||
                    text.includes('ppt') ||
                    text.includes('xls') ||
                    text.includes('pdf')
                );
            });

            //文档下载地址
            url = window._CONFIG['docDownURL'] + '/' + url;
            //暂存文档地址
            var tempUrl = `${url}`;

            //URL加密，保证中文路径可以被正常解析
            var xurl = url.replace('files/', 'files/convert/');
            //去掉后缀
            xurl = xurl.substring(0, xurl.lastIndexOf('.'));

            //获取文件后缀
            var suffix = deNull(url).substring(url.lastIndexOf('.'), url.length).toLowerCase();

            //如果word文档，则使用微软API打开
            url = deNull(suffix).includes('xls') ? xurl + '.html' : url;
            //如果word文档，则使用微软API打开
            url = deNull(suffix).includes('doc') || deNull(suffix).includes('ppt') || deNull(suffix).includes('pdf') ?
                xurl + '.pdf' :
                url;

            //待检测URL
            var checkURL = decodeURIComponent(url);

            //打印checkURL
            console.log('checkURL :' + checkURL);

            //设置加密路径
            xurl = encodeURIComponent(xurl);

            //如果word文档，则使用微软API打开
            url =
                deNull(suffix).includes('doc') ||
                deNull(suffix).includes('ppt') ||
                deNull(suffix).includes('pdf') ?
                decodeURIComponent(xurl) + '.pdf' : url;

            //检测文件URL标识
            var existFlag = await queryUrlValid(checkURL);

            //如果文件地址不存在，则使用kkfileview预览模式
            if (!existFlag) {
                url = tempUrl;
            } else {
                url = checkURL;
            }

            //打印预览地址日志
            console.log('preview url :' + url);
        } catch (error) {
            //打印错误日志
            console.log('query file view url error :' + error);
        }

        //返回URL
        return url;
    }

    /**
     * @description 检测URL是否有效
     * @param {*} url
     */
    async queryUrlValid(url) {
        //提交URL
        var queryURL = `${window._CONFIG['validURL']}${url}`;

        try {
            var res = await window.superagent.get(queryURL);
            console.log(' url :' + url + ' result :' + JSON.stringify(res));
            return res.body.success;
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * 获取URL参数值
     * @param {*} val
     */
    getUrlParam(name) {
        try {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.hash.substr(window.location.hash.indexOf('?') + 1).match(reg); //匹配目标参数
            if (r != null) return decodeURI(r[2]);
            return null; //返回参数值
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * 获取URL参数值
     * @param {*} val
     */
    queryUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.hash.substr(window.location.hash.indexOf('?') + 1).match(reg); //匹配目标参数
        if (r != null) return decodeURI(r[2]);
        return null; //返回参数值
    }

    /**
     * @description URI加密
     * @param {*} value
     */
    encodeURI(value) {
        return window.encodeURIComponent(value);
    }

    /**
     * @description URI解密
     * @param {*} value
     */
    decodeURI(value) {
        return window.decodeURIComponent(value);
    }

    /**
     * 获取URL参数值
     * @param {*} val
     */
    queryUrlString(name, flag = 'history') {
        try {
            if (flag == 'history') {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                var r = window.location.hash.substr(window.location.hash.indexOf('?') + 1).match(reg); //匹配目标参数
                if (r != null) {
                    if (name == 'system_type') {
                        localStorage.setItem('system_type', decodeURI(r[2]));
                    }
                    return decodeURI(r[2]);
                } else if (name == 'system_type') {
                    return localStorage.getItem('system_type') || 'v2'
                }
                return null; //返回参数值
            } else {
                var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
                var r = window.location.search.substr(1).match(reg); //search,查询？后面的参数，并匹配正则
                if (r != null) return unescape(r[2]);
            }
        } catch (error) {
            console.error(error);
        }
        return '';
    }

    /**
     * @description 合成唯一编码
     */
    queryUniqueID(length = 32) {
        //日期格式化
        var timestamp = new Date().getTime();
        //定义动态编码
        var id = formatDate(timestamp, "yyyyMMddhhmmssS");
        //打印日志
        console.log('动态编号 :' + id);
        //定义随机编码
        var random = (Math.floor(Math.random() * 100000000000000000000) + "") + (Math.floor(Math.random() * 100000000000000000000) + "");
        //打印随机编码
        console.log('随机编号 :' + random);
        //合成动态编码
        id = (id + random).replace(/\./g, '').substring(0, length);
        //返回唯一编码
        return id;
    }

    /**
     * @description 电话号码隐藏中间4位
     * @param {*} mobile 
     */
    mobileHide(mobile) {
        mobile = mobile.slice(0, 11);
        var re = /(\d{3})(\d{4})(\d{4})/;
        return mobile.replace(re, "$1****$3");
    }

    /**
     * @description 电话号码隐藏中间4位
     * @param {*} mobile 
     */
    mobileEnsconce(mobile) {
        mobile = mobile.slice(0, 11);
        var re = /(\d{3})(\d{4})(\d{4})/;
        return mobile.replace(re, "$1****$3");
    }

    /**
     * @description 检测字符串是否包含字符函数
     * @param {*} origin
     * @param {*} arg
     */
    contain(origin, arg) {

        //设置前后缀信息
        origin = `,${origin},`;

        //设置包含的用户
        var ready = '';

        //设置数组信息
        var array = null;

        try {
            array = arg.split(',');

            //遍历数据，并查询出含有的用户数据
            for (var item of array) {
                ready = origin.includes(`,${item},`) ? `${ready},${item}` : ready;
            }

        } catch (error) {
            console.log(error);
        }

        //去掉字符串开头的逗号
        if (ready.startsWith(',')) {
            ready = ready.substring(1);
        }

        //去掉字符串结尾的逗号
        if (ready.endsWith(',')) {
            ready = ready.substring(0, ready.length - 1);
        }

        //返回包含的用户数据
        return ready;
    }
}

var toolsExports = {
    tools: new tools(),
}

module.exports = toolsExports