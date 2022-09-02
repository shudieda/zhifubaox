// 获取截图
const getHtmlImage = async (options = {}) => {
    let {canvasBox, canvasBoxOffsetLeft, canvasBoxOffsetTop, canvasBoxOffsetHeight,downloadName} = options
    // 大概估算出，图片最大面积为maxPixels，超出只能舍弃一些分辨率，判断请转到scale配置
    const maxPixels = 880 * 3270 * 1;

    return new Promise(async (resolve, reject) => {
        if (!canvasBox) {
            resolve(null)
            return
        }

        // 获取 canvas 的宽度和高度
        let domWidth = canvasBox.offsetWidth
        let domHeight = canvasBoxOffsetHeight || canvasBox.offsetHeight
        // console.log(domWidth, domHeight)

        // 确保截图能保存
        setTimeout(() => {
            html2canvas(canvasBox, {
                // allowTaint: true, //是否允许跨域，会对canvas造成污染，导致无法使用canvas.toDataURL 方法
                useCORS: true, //是否允许跨域
                // proxy: 'http://127.0.0.1',
                backgroundColor: '#fff',
                width: domWidth,
                height: domHeight,
                x: canvasBoxOffsetLeft || canvasBox.offsetLeft,
                y: canvasBoxOffsetTop || canvasBox.offsetTop,
                // x: 397,
                // y: 490,
                // 用于计算 dpi
                scale: maxPixels / (domWidth * domHeight) > 1 ? 1 : maxPixels / (domWidth * domHeight),
            }).then((canvas) => {
                if (canvas) {
                    let dataUrl = canvas.toDataURL('image/jpg'); // image/png ， image/jpg

                    // 亦可以在这里进行图片的下载
                    let image = document.createElement('img')
                    image.src = dataUrl
                    let a = document.createElement('a')
                    a.href = dataUrl
                    a.download = downloadName || '下载' // 自定义名称
                    a.click()

                    // 下载成功后返回一个 url 地址
                    resolve(dataUrl)
                } else {
                    resolve(null)
                }
            });
        }, 500);
    })

}
