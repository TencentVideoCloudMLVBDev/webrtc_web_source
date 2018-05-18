var Sketchpad = {
  template: '\
    <div class="edu-index-body">                                                                                                                                                                                                                                        \
        <!-- 视频部分 start -->                                                                                                                                                                                                                              \
        <div style="width: 100%;">                                                                                                                                                                                                           \
            <div style="width: 100%; height: 600px;border:1px solid #999;">                                                                                                                                                                                                        \
              <transition name="fade">                                                                                                                                                                                                                       \
                <div class="processbar" v-if="processbar > 0"><p>已经上传 {{ processbar }}%</p></div>                                                                                                                                                       \
              </transition>                                                                                                                                                                                                                                  \
                <!-- 播放器 start -->                                                                                                                                                                                                                        \
                  <div id="sketchpad" style="position:relative">                                                                                                                                                                                                                       \
                  </div>                                                                                                                                                                                                                                     \
                <!-- 播放器 end -->                                                                                                                                                                                                                          \
            </div>                                                                                                                                                                                                                                           \
            <div class="edu-main-video-ft" v-if="canDraw">                                                                                                                                                                                                                  \
                <div class="edu-col">                                                                                                                                                                                                                        \
                    <div class="edu-page">                                                                                                                                                                                                                   \
                        <!-- 不能点击换页时 加disable -->                                                                                                                                                                                                    \
                        <a @click="frontPage" href="javascript:void(0);" class="edu-page-first" :class="{disable: paintCurrentPage == 0}"  title="上一页">                                                                                                     \</a>                                                                                                                                                                                                           \
                        <div class="edu-page-num">                                                                                                                                                                                                           \
                            <a href="javascript:void(0);">                                                                                                                                                                                                   \
                                <span class="hover">{{paintCurrentPage + 1}}</span>                                                                                                                                                                                  \
                                <span>/</span>                                                                                                                                                                                                               \
                                <span>{{paintPageList.length}}</span>                                                                                                                                                                                                  \
                            </a>                                                                                                                                                                                                                             \
                        </div>                                                                                                                                                                                                                               \
                        <a @click="nextPage" href="javascript:void(0);" class="edu-page-next" :class="{disable: paintCurrentPage == (paintPageList.length - 1)}" title="下一页">                                                                                                \
                        </a>                                                                                                                                                                                                                                 \
                    </div>                                                                                                                                                                                                                                   \
                </div>                                                                                                                                                                                                                                       \
                <div class="edu-col eda-col-operation">                                                                                                                                                                                                      \
                    <a @click="addPage" href="javascript:void(0);" class="edu-add-btn edu-ft-btn" title="增加"></a>                                                                                                                                          \
                    <a @click="delPage" href="javascript:void(0);" class="edu-delete-btn edu-ft-btn" title="删除"></a>                                                                                                                                      \
                </div>                                                                                                                                                                                                                                       \
            </div>                                                                                                                                                                                                                                           \
        </div>                                                                                                                                                                                                                                               \
        <!-- 视频部分 end -->                                                                                                                                                                                                                                \
                                                                                                                                                                                                                                                            \
        <!-- 工具 start -->                                                                                                                                                                                                                                  \
        <div class="edu-toolbar-box" style="z-index: 100;" v-if="canDraw">                                                                                                                                                                                                  \
            <ul class="edu-toolbar-menu">                                                                                                                                                                                                                    \
                <li class="tool-bgcolor">                                                                                                                                                                                                                    \
                                                                                                                                                                                                                                                            \
                    <div @click="toggleTool(\'color\')" :class="{hover: (isToggleTool(\'color\'))}" class="choose-state"><i class="tool" title="色板"><span :class="\'bg-\'+(getChoosedColor())"></span></i></div>                                                 \
                    <div v-show="(isToggleTool(\'color\'))" class="choose-drop-down bgcolor-drop-down" style="display: block;">                                                                                                                                \
                        <ul>                                                                                                                                                                                                                                 \
                          <li  v-for="(color, index) in colorPad.colors" v-bind:class="{hover: index===colorPad.chooseIndex}" @click="chooseColor(index)"><span :class="\'bg-\'+(color)"></span></li>                                                          \
                        </ul>                                                                                                                                                                                                                                \
                    </div>                                                                                                                                                                                                                                   \
                </li>                                                                                                                                                                                                                                        \
                <li v-if="brushPad.enable" class="paint-brush">                                                                                                                                                                                              \
                    <div @click="toggleTool(\'brush\')" :class="{hover: (isToggleTool(\'brush\'))}" class="choose-state"><i class="tool" title="画笔"></i></div>                                                                                                 \
                    <div v-show="(isToggleTool(\'brush\'))" class="choose-drop-down paint-brush-drop-down" style="display: block;">                                                                                                                            \
                        <ul>                                                                                                                                                                                                                                 \
                            <li v-for="(brush, index) in brushPad.brushes" :class="{hover: brushPad.chooseIndex === index}"  @click="chooseBrush(index)"><span :class="\'paint-brush-size-\'+(brush)"></span></li>                                             \
                        </ul>                                                                                                                                                                                                                                \
                    </div>                                                                                                                                                                                                                                   \
                </li>                                                                                                                                                                                                                                        \
                <li class="straight-line">                                                                                                                                                                                                                   \
                    <div  @click="toggleTool(\'line\')" :class="{hover: (isToggleTool(\'line\'))}" class="choose-state"><i class="tool" title="直线"></i></div>                                                                                                  \
                    <div v-show="(isToggleTool(\'line\'))" class="choose-drop-down straight-line-drop-down" style="display: block;">                                                                                                                           \
                        <ul>                                                                                                                                                                                                                                 \
                            <li v-for="(line, index) in linePad.lines" :class="{hover: linePad.chooseIndex === index}"  @click="chooseLine(index)"><span :class="\'straight-line-size-\'+(line)"></span></li>                                                  \
                        </ul>                                                                                                                                                                                                                                \
                    </div>                                                                                                                                                                                                                                   \
                </li>                                                                                                                                                                                                                                        \
                <li v-if="graphicalPad.enable" class="graphical">                                                                                                                                                                                            \
                    <div @click="toggleTool(\'graphical\')" :class="{hover: (isToggleTool(\'graphical\'))}" class="choose-state"><i class="tool" title="图形"><span :class="\'graphical-\'+(graphicalPad.graphicals[graphicalPad.chooseIndex])"></span></i></div>  \
                    <div v-show="(isToggleTool(\'graphical\'))" class="choose-drop-down" style="display: block;">                                                                                                                                              \
                        <ul>                                                                                                                                                                                                                                 \
                            <li v-for="(gph, index) in graphicalPad.graphicals" :class="{hover: index === graphicalPad.chooseIndex}" @click="chooseGraphical(index)"><span :class="\'graphical-\'+(gph)"></span></li>                                          \
                        </ul>                                                                                                                                                                                                                                \
                        <!-- <p class="graphical-title">描边厚度</p>                                                                                                                                                                                         \
                        <div class="edu-adjust">                                                                                                                                                                                                             \
                            <div class="edu-adjust-col">                                                                                                                                                                                                     \
                                <div class="edu-adjust-progress">                                                                                                                                                                                            \
                                    <div class="edu-adjust-progress-value" aria-valuemax="100" aria-valuemin="0" aria-valuenow="30" style="width:30%">                                                                                                       \
                                        <img src="../assets/css/img/slice/index-sound.svg" alt="">                                                                                                                                                           \
                                    </div>                                                                                                                                                                                                                   \
                                </div>                                                                                                                                                                                                                       \
                            </div>                                                                                                                                                                                                                           \
                            <div class="edu-adjust-col">                                                                                                                                                                                                     \
                                <span aria-valuetext="运行中" class="edu-progress-text edu-progress-text-color">5</span>                                                                                                                                     \
                            </div>                                                                                                                                                                                                                           \
                        </div> -->                                                                                                                                                                                                                           \
                    </div>                                                                                                                                                                                                                                   \
                </li>                                                                                                                                                                                                                                        \
                <li v-if="eraser.enable" class="tool-eraser">                                                                                                                                                                                                \
                    <div @click="toggleTool(\'tool-eraser\')" :class="{hover: (isToggleTool(\'tool-eraser\'))}" class="choose-state"><i class="tool" title="橡皮擦"></i></div>                                                                                   \
                </li>                                                                                                                                                                                                                                        \
                <li class="upload-picture">                                                                                                                                                                                                                  \
                    <div @click="chooseFile" class="choose-state"><i class="tool" title="上传文件"></i></div>                                                                                                                                                \
                </li>                                                                                                                                                                                                                                        \
                <li class="clear-board">                                                                                                                                                                                                                  \
                    <div @click="clearBoard" class="choose-state"><i class="tool" title="清空白板"></i></div>                                                                                                                                                \
                </li>                                                                                                                                                                                                                                         \
            </ul>                                                                                                                                                                                                                                            \
        </div>                                                                                                                                                                                                                                               \
        <input id="inputElement" type="file" style="display:none" v-on:change="onChooseFile"/>                                                                                                                                                                    \
        <!-- 工具 end -->                                                                                                                                                                                                                                    \
    </div>',
  props: {
    userAuthData: {
      type: Object
    },
    inputData: {
      type: String
    },
    toggleSketchPage: {
      type: Number | Boolean
    },
    canDraw: {
      type: Boolean,
      value: false
    }
  },
  data: function () {
    return {
      cos: {
        bucket: "",
        region: "",
        sign: "",
        appid: '1253488539'
      },
      processbar: 0,
      paint: null,
      colorPad: {
        colors: ["green", "yellow", "red", "black", "blue", "gray"],
        values: [0x008000FF, 0xff9903FF, 0xff0000FF, 0x0FF, 0xffFF, 0x808080FF],
        chooseIndex: 0
      },
      brushPad: {
        enable: true,
        brushes: [4, 8, 12],
        chooseIndex: 0
      },
      linePad: {
        lines: [4, 8, 12],
        chooseIndex: 0
      },
      graphicalPad: {
        enable: true,
        graphicals: [
          "square-empty",
          "square-entity",
          "ellipse-empty",
          "ellipse-entity"
        ],
        values: [
          'graph-rect',
          'graph-rect-solid',
          'graph-oval',
          'graph-oval-solid'
        ],
        chooseIndex: 0
      },
      eraser: {
        enable: true,
      },
      page: {
        count: 1,
        cur: 0,
        value: []
      },

      paintCurrentPage: 0, // 白板当前页
      paintPageList: [], // 白板总页数

      toggleToolName: null
    };
  },
  methods: {
    setType: function (type) {
      console.log("==> setType: ", type);
      this.paint.setType(type);
    },
    cancelBackgroundPic: function () {
      console.log("==> cancelBackgroundPic");
      this.paint.cancelBackgroundPic();
    },
    sendClear: function () {
      console.log("==> sendClear");
      this.paint.sendClear();
    },
    process: function () {
      console.log("==> process");
      this.paint.process();
    },
    revert: function () {
      console.log("==> revert");
      this.paint.revert();
    },
    getChoosedColor: function () {
      var index = this.colorPad.chooseIndex;
      return this.colorPad.colors[index];
    },
    chooseColor: function (index) {
      console.log('设备颜色：', this.colorPad[index]);
      this.toggleToolName = null;
      this.colorPad.chooseIndex = index;
      this.paint.setColor(this.colorPad.values[index])
    },
    chooseBrush: function (index) {
      var size = this.brushPad.brushes[index] * 12;
      this.paint.setType('line')
      this.paint.setThin(size)
      this.toggleToolName = null;
      this.brushPad.chooseIndex = index;
    },
    chooseLine: function (index) {
      var size = this.linePad.lines[index] * 12;
      this.paint.setType('graph-line')
      this.paint.setThin(size);
      this.toggleToolName = null;
      this.linePad.chooseIndex = index;
    },

    chooseGraphical: function (index) {
      var v = this.graphicalPad.values[index];
      console.log('-->set graph: ', v)
      this.paint.setType(v);
      this.toggleToolName = null;
      this.graphicalPad.chooseIndex = index;
    },

    clearBoard() {
      this.paint.clear();
    },

    upload: function (file, cb) {
      var self = this;
      var index = file.name.lastIndexOf(".");
      var key = "web-" + Date.now() + file.name.substring(index);

      var fd = new FormData();
      fd.append('key', key);
      fd.append('Signature', self.cos.sign);
      fd.append('success_action_status', '200');
      fd.append('file', file);

      var url = 'https://eddieli-1253488539.cos.ap-shanghai.myqcloud.com';
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 206) {
          var result = url + '/' + key;
          cb(result, key);
        } else {
          alert('上传失败', '提示');
        }
      };
      xhr.onerror = function () {
        alert('文件 ' + key + ' 上传失败，请检查是否没配置 CORS 跨域规则');
      };
      xhr.send(fd);
    },

    // 正常方式访问，但是跨域问题，无法读取自定义的header字段user-returncode
    previewFile: function (key) {
      var url = "http://" + this.cos.bucket + "-" + this.cos.appid + ".file.preview.myqcloud.com/" + key + "?cmd=doc_preview&page=1";
      console.log('preview url: ', url)
      var xhr = new XMLHttpRequest();
      var self = this;
      xhr.onprogress = function (event) {
        console.log('previewFile ', parseFloat(event.loaded / event.total * 100));
      }
      xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            console.log("headers ===> ", xhr.getAllResponseHeaders())
            var pageSize = xhr.getResponseHeader('User-ReturnCode');
            console.log('获取PageSize： ', pageSize)
            self.restorePageData(key, pageSize);
            //TODO
          } else {
            console.log('获取失败： ', xhr.getResponseHeader('User-ReturnCode'))
          }
        }
      }
      xhr.open('HEAD', url, true);
      xhr.setRequestHeader('Access-Control-Request-Headers', 'User-ReturnCode')
      xhr.send();
    },

    // 使用代理的方式获取user-returncode
    proxyPreviewFile: function (result, key) {
      var self = this;

      var previewUrl = "http://" + this.cos.bucket + "-" + this.cos.appid + ".file.preview.myqcloud.com/" + key + "?cmd=doc_preview&page=";
      var proxyUrl = 'https://test.tim.qq.com/v4/ilvb_edu/whiteboard?sdkappid=1400042982&identifier=wilder&usersig=123'
      console.log('proxyPreviewFile - previewUrl: ', previewUrl, ' proxyUrl: ', proxyUrl);
      // 如是图片类型
      if(/\.(bmp|jpg|jpeg|png|gif|webp)/i.test(previewUrl)) {
        self.paint.setBackgroundPic(result);
        return;
      }
      
      var requestBody = {
        "cmd": "open_conf_svc",
        "sub_cmd": "cos_user_returncode",
        "conf_id": 10001,
        "cos_url": previewUrl + '1'
      }
      this.$http.post(proxyUrl, requestBody, {
        headers: {
          'content-type': 'application/json'
        }
      }).then(function (res) {
        var page = res.body.user_returncode;
        if (page) {
          self.$toast.center('文件上传成功~');
          // 根据页数发消息
          var time = +new Date();
          for (var i = 0; i < page; i++) {
            (function (index) {
              setTimeout(function () {
                self.paint.addBackgroundPic(previewUrl + (index + 1), true);
              }, index * 100);
            })(i);
          }
        } else {
          self.$toast.center('文件上传失败，请重试~');
          // alert('文件只有0页');
        }
      }, function (r) {
        console.log('ProxyUrlEror ', JSON.stringify(r))
      })

    },

    chooseFile: function () {
      console.log("chooseFileClick");
      document.getElementById("inputElement").click();
    },

    onChooseFile: function (e) {
      var self = this;
      var file = e.target.files[0];
      console.log("onChooseFile: ", file.name);
      if (!file) {
        console.log("未选择上传文件");
        return;
      }
      file && this.upload(file, function (result, key) {
        // 上传完成后，将Input的值清空
        document.getElementById('inputElement').value = '';
        self.proxyPreviewFile(result, key);
      })
    },

    restorePageData: function (key, size) {
      if (size < 0) return;
      var url = "http://" + this.cos.bucket + "-" + this.cos.appid + ".file.preview.myqcloud.com/" + key + "?cmd=doc_preview&page=";
      this.page = {
        cur: 0,
        count: size,
        value: []
      }
      for (var i = 0; i < size; i++) {
        var urlTemp = url + i.toString();
        this.page.value.push({
          image: urlTemp,
        })
      }
      console.log('restorePageData - ', '当前Page： ', JSON.stringify(this.page))
    },

    /**
     * 增加一页
     */
    addPage: function () {
      this.paint.switchBoard();
    },

    /**
     * 删除当前页
     */
    delPage: function () {
      this.paint.deleteBoard(this.paintPageList[this.paintCurrentPage]);
    },

    /**
     * 下一页
     */
    nextPage: function () {
      if (this.paintCurrentPage == (this.paintPageList.length - 1))
        return;
      var boardId = this.paintPageList[this.paintCurrentPage + 1];
      this.paint.switchBoard(boardId);
    },

    /**
     * 上一页
     */
    frontPage: function () {
      if (this.paintCurrentPage == 0)
        return;
      var boardId = this.paintPageList[this.paintCurrentPage - 1];
      this.paint.switchBoard(boardId);
    },

    /**
     * 展开/关闭工具
     */
    toggleTool: function (name) {
      if (this.toggleToolName === name) this.toggleToolName = null;
      else this.toggleToolName = name;
    },

    /**
     * 是否展开工具
     */
    isToggleTool: function (name) {
      return this.toggleToolName === name;
    },

    goBoard: function () {
      // this.paint.switchBoard(this.page.cur)
      // if (this.page.value.length > 0 && this.page.value.length > this.page.cur) {
      //   var imageUrl = this.page.value[this.page.cur].image
      //   if (imageUrl)
      //     this.paint.setBackgroundPic(imageUrl)
      // }
    },

    computePage: function (data) {
      this.paintCurrentPage = data.list.indexOf(data.current);
      this.paintPageList = data.list;
    },

    initCosInfo() {
      var self = this;
      var cosURL = "//sxb.qcloud.com/conf_svr_sdk/conference_server/public/api/conference?sdkappid=1400042982";
      this.$http
        .post(
          cosURL, {
            cmd: "open_cos_svc",
            sub_cmd: "get_cos_sign",
            type: 1
          }, {
            "content-type": "application/json"
          }
        )
        .then(function (response) {
            console.log("response: ", typeof response, JSON.stringify(response));
            var ret = response.body;
            self.cos.bucket = ret.bucket;
            self.cos.region = ret.region;
            self.cos.sign = ret.sign;
            console.log("---> cos info: ", JSON.stringify(self.cos));
          },
          function (response) {
            self.$toast.center('心跳包超时，请重试~');
            console.error("获取cos配置失败: ", JSON.stringify(response));
          }
        );
    },

    /**
     * 初始化白板
     */
    initWhiteBoard() {
      var self = this;
      this.paint = new Sketch({
        id: "sketchpad",
        user: this.userAuthData.userID,
        canDraw: this.canDraw,
        tlsData: {
          identifier: this.userAuthData.userID,
          userSig: this.userAuthData.userSig,
          sdkAppId: this.userAuthData.sdkAppID
        },
        color: self.colorPad.values[self.colorPad.chooseIndex],
        thin: self.linePad.lines[self.linePad.chooseIndex] * 12,
        sendMsg: function (data) {
          console.log("SketchPad.vue 上抛白板数据");
          self.$emit("sketchpadData", JSON.stringify(data));
        },

        infoAddBoard: function (data) {
          self.computePage(data);
        },
        infoSwitchBoard: function (data) {
          self.computePage(data);
        },
        infoDeleteBoard: function (data) {
          self.computePage(data);
        },

        event: [{
          type: 'mousedown',
          fn: function (event) {
            self.toggleToolName = null;
          }
        }]
      });
    },

    getCurrentBoard() {
      return this.paint.getCurrentBoard();
    },

    // 获取当前白板的背景图片
    getBoardBg() {
      return this.paint.board.backgroundPic;
    },

    getSeq() {
      return this.paint.getSeq();
    }
  },

  mounted: function () {
    var self = this;
    this.initCosInfo();
    this.initWhiteBoard();
    window.onresize = function() {
      self.paint.board.resize();
      self.paint.board.el.setAttribute('width', self.paint.board.width);
      self.paint.board.el.setAttribute('height', self.paint.board.height);
      self.paint.board.img.setAttribute('width', self.paint.board.width);
      self.paint.board.img.setAttribute('height', self.paint.board.height);
      self.paint.board.draw();
    }
  },
  watch: {
    inputData: function (newVal, oldVal) {
      this.paint.addData(JSON.parse(newVal));
    },
    page: {
      handler: function (newPage, oldPage) {
        console.log('watch.page.handler -', 'called', JSON.stringify(this.page))
        if (newPage.count < oldPage.count) {
          this.paint.deleteBoard(oldPage.cur)
          this.paint.cancelBackgroundPic()
        }
        this.goBoard();
      },
      deep: true
    },
    toggleSketchPage: {
      handler: function (newData, oldData) {
        console.log('----> toggleSketchPage changed: ', newData)
        if (newData != 0)
          this.goBoard();
      }
    },
    toggleToolName: function (newVal, oldVal) {
      console.log('watch - toggleToolName: ', oldVal, ' ==> ', newVal);
      switch (newVal) {
        case 'tool-eraser':
          {
            this.paint.setType('eraser')
            break;
          }
        case 'line':
          {
            break;
          }
      }
    }
  }
};