
function getRandomName(){
    var randomNames = ['曹操', '刘备', '李白', '诸葛亮', '赵子龙', '孙权', '张飞']
    var index = Math.ceil(Math.random()*100)%randomNames.length;
    return randomNames[index];
}
function randomUserId(){
    var userid = "userid_web_" + Date.now().toString();
    return userid;
}

var CourseList = {
  template:'\
  <div class="edu-index-body">                                                                       \
  <div class="edu-index-pop-ups" style="margin: 0 auto;">                                          \
        <div class="edu-index-logo" style="display: flex;justify-content: center;">                                                               \
            <img src="./assets/webrtc-logo-min.png" alt="">                                          \
        </div>                                                                                     \
        <!-- 创建课堂 s -->                                                                        \
        <div v-if="!joinFlag"  class="edu-index-class-middle">                                                       \
            <div class="edu-index-class-middle" v-if="courseItems.length > 0">                     \
                <div class="edu-index-class-list">                                                 \
                    <ul>                                                                           \
                        <li v-for="(item, index) in courseItems">                                  \
							<span>{{ item.roomInfo ? item.roomInfo : item.roomID }}</span>         \
							<button class="joinButton" v-on:click="join(index)">加入</button>      \
						</li>                                                                      \
                    </ul>                                                                          \
                </div>                                                                             \
			</div>                                                                                 \
            <div class="edu-index-class-prompt" v-if="courseItems.length === 0">                   \
                <p>暂时没有直播，请创建音视频房间</p>                                                    \
            </div>                                                                                 \
        </div>                                                                                     \
        <!-- 创建课堂 e -->                                                                        \
		<!-- 输入直播课堂 s -->                                                                  \
		<div v-if="joinFlag"  class="edu-index-class-input" >                                                      \
			<ul>                                                                                 \
				<li><input type="text" placeholder="请输入你的昵称" v-model="loginInfo.userName" /></li> \
			</ul>	                                                                             \
		</div>                                                                       			 \
		<!-- 输入直播课堂 e -->                                                                                  \
        <!-- 按钮 s -->                                                                            \
        <div class="edu-index-button">                                                             \
            <!-- 创建和加入课堂 s -->                                                              \
            <div class="tc-15-rich-dialog-ft">                                                     \
                <div class="tc-15-rich-dialog-ft-btn-wrap">                                        \
                    <button  v-if="!joinFlag" class="tc-15-btn" v-on:click="onCreateButtonClick">创建房间</button>   \
                    <button  v-if="joinFlag" class="tc-15-btn" v-on:click="onjoinButtonClick">进入房间</button>   \
                    <!--<button class="tc-15-btn weak" v-on:click="onjoinButtonClick">加入房间</button> -->\
                </div>                                                                             \
            </div>                                                                                 \
            <!-- 创建和加入课堂 e -->                                                              \
        </div>                                                                                     \
        <!-- 按钮 e -->                                                                            \
    </div>                                                                                         \
    </div>',

    name: "CourseList",
    data: function() {
        return{
            loginInfo: {
                userID: '',
                userName: '',
            },
            room:null,
            joinFlag:false,
            nickName:null,
            hasClass: false,
            courseItems: [],
        };
    },
    mounted: function() {
      this.loginInfo.userName = null;
      this.loginInfo.userID = randomUserId();
      this.updateCourseList();
      localStorage.removeItem('course_info');
    },
    beforeDestroy: function(){
        clearTimeout( this.courseListSto )
    },
    methods: {
      join: function(idx){
          this.room = this.courseItems[idx];
          this.joinFlag = true;
          return;
      },
      onCreateButtonClick: function(){
          var self = this;          
          console.log('onCreateButtonClick: self.loginInfo.userName = ', self.loginInfo.userName)
          this.$router.push({path: 'create', query:{name: self.loginInfo.userName}})
      },
      onjoinButtonClick: function(){
        //   this.$router.push({path: '/join'})
        var self = this;
        if( !self.loginInfo.userName ){
            alert('昵称不能为空!')
            return;
        }
        console.log("跳转加入",JSON.stringify(self.room))          
          this.$router.push({
              path: 'main',
              query: {
                  cmd: 'enter',
                  roomID: self.room.roomID,
                  roomInfo: self.room.roomInfo,
                  userName: self.loginInfo.userName,
                  userId: self.loginInfo.userID
              }
          })
      },
      updateCourseList: function(){
        console.log('updateCourseList() called');
        var self = this;
        WebRTCRoom.getRoomList(0, 20,
            function(res) {
                self.courseItems = []
                if (res.data && res.data.rooms) {
                    var rooms = res.data.rooms;
                    rooms.forEach(function (room) {
                        self.courseItems.push(room)
                    });
                    
                   console.log('courseItems: ', JSON.stringify(self.courseItems)); 
                   clearTimeout( self.courseListSto )
                   self.courseListSto = setTimeout( function(){
                    self.updateCourseList();
                   },2000);
                }
            },
            function(res) {
                self.courseItems = []
                console.warn('获取房间列表失败', JSON.stringify(res))
            });
      }
  },

};