/**
 * @function 检测URL是否有效
 * @param {*} url
 */
async function queryUrlValid(url) {
    if (window.BECONFIG && superagent) {
        var queryURL = `${window.BECONFIG['validURL']}${url}`;
        try {
            var res = await superagent.get(queryURL);
            console.log(' url :' + url + ' result :' + JSON.stringify(res));
            return res.body.success;
        } catch (err) {
            console.log(err);
        }
    }
}

/**
 * @function 处理预览功能
 * @param {*} item
 */
async function handlePreview(item) {
    if (window.BECONFIG) {
        let type = ['doc', 'docx', 'xlsx', 'xls', 'ppt', 'pptx'];
        //检测转化后的FileURL是否可用，如果可用则使用本地地址预览，否则使用kkfileview预览
        let existFlag = await queryUrlValid(item.file);
        let suffix = item.name.split('.');
        suffix = suffix[suffix.length - 1];
        //如果文件地址不存在，则使用kkfileview预览模式，否则使用自带预览服务
        if (!existFlag && type.includes(suffix)) {
            window.open(window.BECONFIG["previewURL"] + item.msrc);
        } else {
            //window打开链接
            window.open(item.src);
        }
    }
}

/**
 * @function 处理下载功能
 */
async function handleDownLoad(item) {
    //执行下载操作
    try {
        vant.Toast.success('开始下载中，请稍等...');
        window.saveAs(item.msrc, item.name);
    } catch (error) {
        window.open(item.msrc);
    }
}

var fileExports = {
    queryUrlValid,
    handlePreview,
    handleDownLoad,
}

module.exports = fileExports