var IM = (function () {

  function login(loginInfo, listeners, succ, fail) {
    webim.login(
      loginInfo, listeners, {
        isLogOn: false
      },
      function () {
        //设置昵称
        webim.setProfilePortrait({
            'ProfileItem': [{
              "Tag": "Tag_Profile_IM_Nick",
              "Value": loginInfo.identifierNick
            }]
          },
          function (resp) {
            succ();
          },
          function (err) {
            alert(err.ErrorInfo);
          }
        );
      }, fail
    );
  }

  function logout() {
    webim.logout();
  }

  function createGroup(groupId, userID, succ, fail) {
    var options = {
      'GroupId': String(groupId),
      'Owner_Account': String(userID),
      'Type': "AVChatRoom", //Private/Public/ChatRoom/AVChatRoom
      'ApplyJoinOption': 'FreeAccess',
      'Name': String(groupId),
      'Notification': "",
      'Introduction': "",
      'MemberList': [],
    };
    webim.createGroup(
      options,
      function (resp) {
        if (succ) succ();
      },
      function (err) {
        if (err.ErrorCode == 10025 || err.ErrorCode == 10021) {
          if (succ) succ();
        } else {
          sdkLog.error(err.ErrorInfo);
          if (fail) fail(err.ErrorCode);
        }
      }
    );
  }


  function joinGroup(groupId, identifier) {
    createGroup(groupId, identifier, function () {
      var options = {
        'GroupId': groupId //群id
      };
      webim.applyJoinBigGroup(
        options,
        function (resp) {
          //JoinedSuccess:加入成功; WaitAdminApproval:等待管理员审批
          if (resp.JoinedStatus && resp.JoinedStatus == 'JoinedSuccess') {
            webim.Log.info('进群成功');
          } else {
            alert('进群失败');
          }
        },
        function (err) {
          if (err.ErrorCode == 10013) {
            console.warn('applyJoinGroupSucc', groupId)
            return;
          }
          alert(err.ErrorInfo);
        }
      );
    }, function () {
      alert('进群失败');
    })

  }


  function parseMsgs(newMsgList) {
    var textMsgs = [];
    var whiteBoardMsgs = [];
    for (var i in newMsgList) { //遍历新消息
      var msg = parseMsg(newMsgList[i]);
      if (msg && msg.type === 'TXWhiteBoardExt') {
        whiteBoardMsgs.push(msg.data);
      } else {
        textMsgs.push(msg)
      }
    }
    return {
      textMsgs: textMsgs,
      whiteBoardMsgs: whiteBoardMsgs
    };
  }

  function parseMsg(newMsg) {
    var msgItem = newMsg.getElems()[0];
    var type = msgItem.getType();
    var who = newMsg.getFromAccount();
    if (type === 'TIMCustomElem') {
      var content = msgItem.getContent(); //获取元素对象
      var ext = content.getExt(); //'白板标签'
      var data = content.getData(); //数据
      if (ext === 'TXWhiteBoardExt') {
        return {
          type: 'TXWhiteBoardExt',
          data: data
        };
      } else if (ext === 'TEXT') {
        var desc = JSON.parse(content.getDesc())
        if (desc && desc.nickName) {
          who = desc.nickName
        }
      }
    }
    return {
      type: 'TEXT',
      who: who,
      content: newMsg.toHtml(),
      isSelfSend: newMsg.getIsSend(),
      isSystem: newMsg.getFromAccount() === "@TIM#SYSTEM" || false
    };
  }


  function sendMsg(identifier, groupId, msgContent) {
    var self = this;
    msgContent = msgContent.trim();
    if (!msgContent) {
      return;
    }
    var selType = webim.SESSION_TYPE.GROUP; //当前聊天类型
    var selToID = String(groupId); //当前选中聊天id（当聊天类型为私聊时，该值为好友帐号，否则为群号）
    var selSess = null; //当前聊天会话对象
    var recentSessMap = {}; //保存最近会话列表
    if (!selSess) {
      var selSess = new webim.Session(selType, selToID, selToID, null, Math.round(new Date().getTime() / 1000));
    }
    var isSend = true; //是否为自己发送
    var seq = -1; //消息序列，-1表示sdk自动生成，用于去重
    var random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重
    var msgTime = Math.round(new Date().getTime() / 1000); //消息时间戳
    var subType = webim.GROUP_MSG_SUB_TYPE.COMMON;
    var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, identifier, subType, null);
    msg.addText(new webim.Msg.Elem.Text(msgContent));
    msg.originContent = msgContent;
    webim.sendMsg(msg, function (resp) {}, function (err) {});
  }


  // 发送普通消息
  function sendRoomTextMsg(options, success, fail) {
    if (!options || !options.msg || !options.msg.trim()) {
      console.log('sendRoomTextMsg参数错误', options);
      fail && fail({
        errCode: -9,
        errMsg: 'sendRoomTextMsg参数错误'
      });
      return;
    }
    sendCustomMsg({
      groupId: options.groupId,
      data: options.msg,
      desc: '{"nickName":"' + options.nickName + '"}',
      ext: 'TEXT',
      identifier: options.identifier,
      nickName: options.nickName
    }, function () {
      success && success();
    });
  }

  // 发送白板消息
  function sendBoardMsg(options, success, fail) {
    if (!options || !options.msg || !options.msg.trim()) {
      console.log('sendRoomTextMsg参数错误', options);
      fail && fail({
        errCode: -9,
        errMsg: 'sendRoomTextMsg参数错误'
      });
      return;
    }
    sendCustomMsg({
      groupId: options.groupId,
      data: options.msg,
      ext: 'TXWhiteBoardExt',
      desc: '{"nickName":"' + options.nickName + '"}',
      identifier: options.identifier,
      nickName: options.nickName
    }, function () {
      success && success();
    });
  }

  // 发送自定义消息
  function sendCustomMsg(msgInfo, callback) {
    if (!msgInfo.groupId) {
      console.error("您还没有进入房间，暂不能聊天");
      return;
    }
    // custom消息
    var data = msgInfo.data || '';
    var desc = msgInfo.desc || '';
    var ext = msgInfo.ext || '';

    var msgLen = webim.Tool.getStrBytes(data);
    if (data.length < 1) {
      alert("发送的消息不能为空!");
      return;
    }
    var
      maxLen = webim.MSG_MAX_LENGTH.GROUP,
      errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";

    if (msgLen > maxLen) {
      alert(errInfo);
      return;
    }

    var selSess = new webim.Session(webim.SESSION_TYPE.GROUP, msgInfo.groupId, msgInfo.groupId, null, Math.round(new Date().getTime() / 1000));
    var isSend = true; //是否为自己发送
    var seq = -1; //消息序列，-1表示sdk自动生成，用于去重
    var random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重
    var msgTime = Math.round(new Date().getTime() / 1000); //消息时间戳
    var subType = webim.GROUP_MSG_SUB_TYPE.COMMON;
    var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, msgInfo.identifier, subType, msgInfo.nickName);
    var custom_obj = new webim.Msg.Elem.Custom(data, desc, ext);
    msg.addCustom(custom_obj);

    //调用发送消息接口
    webim.sendMsg(msg, (resp) => {
      webim.Log.info("发自定义消息成功");
      console.log('发自定义消息成功');
      callback && callback();
    }, function (err) {
      webim.Log.info(err.ErrorInfo);
      console.log('发自定义消息失败:', err);
    });
  }

  return {
    login: login,
    logout,
    sendRoomTextMsg: sendRoomTextMsg,
    createGroup: createGroup,
    joinGroup: joinGroup,
    parseMsg: parseMsg,
    parseMsgs: parseMsgs,
    sendMsg: sendMsg,
    sendBoardMsg: sendBoardMsg
  }
})();