var WebRTCRoom = (function () {
    
    var serverDomain = 'https://xzb.qcloud.com/webrtc/weapp/webrtc_room',
    requestNum = 0,
    heart = '',				// 判断心跳变量
    heartBeatReq = null,
    requestSeq = 0,			// 请求id
    requestTask = [];		// 请求task

    /***********************************************************************************
    * http请求
    * 
    * [request 封装request请求]
    * @param {object}
    *   url: 请求接口url
    *   data: 请求参数
    *   success: 成功回调
    *   fail: 失败回调
    *   complete: 完成回调
    *
    ************************************************************************************/
   function request(object) {
        if (!serverDomain)  {
            console.error('请设置serverDomain');
            object.fail && object.fail({errCode:-1, errMsg:"serverDomain为空, 请调用init接口进行设置"});
            return;
        }
        httpRequest({
            url: serverDomain + object.url,
            data: object.data || {},
            method: "POST",
            success: function(res) {
                if (res.data.code) {
                    console.error("请求失败, req=" + JSON.stringify(object) + ", resp=" + JSON.stringify(res.data));
                    object.fail && object.fail({
                        errCode: res.data.code,
                        errMsg: res.data.message
                    });
                    return;
                }
                object.success && object.success(res);
            },
            fail: object.fail || function () {},
            complete: object.complete || function () {}
        })
    }

    function httpRequest(object) {
        /*
        if (isIE9Version() == true) {
        httpXDRRequest(object);
        return;
        }*/
        object= object|| {};
        object.method = (object.method|| "GET").toUpperCase();
        object.dataType = "json";
        var params = formatParams(object.data);

        //创建 - 非IE6 - 第一步
        if (window.XMLHttpRequest) {
            var xhr = new XMLHttpRequest();
        } else { //IE6及其以下版本浏览器
            var xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }

        var timeout_time = typeof(object.timeout) == "undefined" ? 10000 : object.timeout;
        var timeout = false;
        var timer = setTimeout(function () {
            timeout = true;
            xhr.abort();
        }, timeout_time);
        //接收 - 第三步
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (timeout) {
                    object.fail && object.fail({code: -1, msg:"请求超时"});
                }
                var status = xhr.status;
                clearTimeout(timer);
                if (status >= 200 && status < 300) {
                    var jsonObj = JSON.parse(xhr.responseText);
                    object.success && object.success({status: status, data:jsonObj});
                } else {
                    object.fail && object.fail({code:status, msg:xhr.message});
                }

                object.complete && object.complete();
            }
        }

        //连接 和 发送 - 第二步
        if (object.method == "GET") {
            xhr.open("GET", object.url + "?" + params, true);
            xhr.send(null);
        } else if (object.method == "POST") {
            xhr.open("POST", object.url, true);
            //设置表单提交时的内容类型
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(params);
        }
    }

    //格式化参数
    function formatParams(data) {
        var jsonStr = JSON.stringify(data);
        return jsonStr;
        // var arr = [];
        // for (var name in data) {
        //     arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
        // }
        // arr.push(("v=" + Math.random()).replace(".",""));
        // return arr.join("&");
    }

    
    function getLoginInfo(userID, success, fail) {
        var data = {};
        if (userID) {
            data.userID = userID;
        }
        request({
            url: '/get_login_info',
            data: data,
            success: success,
            fail: fail
        })
    }

    function getRoomList(index, count, success, fail) {
        request({
            url: '/get_room_list',
            data: {
                index: index,
                count: count
            },
            success: success,
            fail: fail
        })
    }

    function createRoom(userID, nickName, roomInfo, success, fail) {
        console.warn('创建房间:' + userID + ", " + roomInfo);
        request({
            url: '/create_room',
            data: {
                userID: userID,
                nickName: nickName,
                roomInfo: roomInfo
            },
            success: function(res) {
                console.warn("创建房间成功:", res);
                startHeartBeat(userID, res.data.roomID);
                success && success(res);
            },
            fail: fail
        })
    }

    function enterRoom(userID,nickName, roomID, success, fail) {
        request({
            url: '/enter_room',
            data: {
                userID: userID,
                roomID: roomID,
                nickName:nickName
            },
            success: function(res) {
                startHeartBeat(userID, res.data.roomID);
                success && success(res);
            },
            fail: fail
        })
    }

    function quitRoom(userID, roomID, success, fail) {
        request({
            url: '/quit_room',
            data: {
                userID: userID,
                roomID: roomID
            },
            success: success,
            fail: fail
        });
        stopHeartBeat();
    }
    

    function get_room_members( roomID, success, fail) {
        request({
            url: '/get_room_members',
            data: {
                roomID: roomID
            },
            success: success,
            fail: fail
        });
    }
    
    function startHeartBeat(userID, roomID) {
        heart = '1';
        heartBeat(userID, roomID);
    }

    function stopHeartBeat() {
        heart = '';
        if (heartBeatReq) {
            heartBeatReq.abort();
            heartBeatReq = null;
        }
    }

    function heartBeat(userID, roomID) {
        if (!heart) {
            return;
        }
        heartBeatReq = request({
            url: '/heartbeat',
            data: {
                userID: userID,
                roomID: roomID
            },
            success: function(res) {
                console.log("心跳成功",{
                    userID: userID,
                    roomID: roomID
                } );
                if (heart) {
                    setTimeout(() => {
                        heartBeat(userID, roomID);
                    }, 7000);
                }
            },
            fail: function (res) {
                if (heart) {
                    setTimeout(() => {
                        heartBeat(userID, roomID);
                    }, 7000);
                }
            }
        })
    }

    return {
        stopHeartBeat: stopHeartBeat,
        startHeartBeat: startHeartBeat,
        getLoginInfo: getLoginInfo,
        getRoomList: getRoomList,
        createRoom: createRoom,
        enterRoom: enterRoom,
        quitRoom: quitRoom,
        get_room_members: get_room_members
    }
})();