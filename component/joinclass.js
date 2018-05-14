var JoinClass = {
	template:'\
	<div class="edu-index-body">                                                                               \
				<div class="edu-index-pop-ups" style="margin: 0 auto;">                                    \
					<div class="edu-index-logo" style="display: flex;justify-content: center;">                                                           \
						<img  src="./assets/webrtc-logo-min.png" alt="" />                                   \
					</div>                                                                                 \
					<!-- 输入直播课堂 s -->                                                                \
					<div class="edu-index-class-input">                                                    \
						<ul>                                                                               \
							<li><input type="text" placeholder="请输入房间名称" v-model="courseName"/></li>\
							<li><input type="text" placeholder="请输入你的昵称" v-model="nickName"/></li>  \
						</ul>	                                                                           \
					</div>                                                                                 \
					<!-- 输入直播课堂 e -->                                                                \
                                                                                                           \
					<!-- 按钮 s -->                                                                        \
					<div class="edu-index-button">                                                         \
						<!-- 加入教室的按钮 s -->                                                          \
						<div class="tc-15-rich-dialog-ft">                                                 \
			                <div class="tc-15-rich-dialog-ft-btn-wrap">                                    \
			                    <button class="tc-15-btn" v-on:click="onjoinClick">加入</button>           \
			                    <button class="tc-15-btn weak" v-on:click="onCancelClick">取消</button>    \
			                </div>                                                                         \
			            </div>                                                                             \
			            <!-- 加入教室的按钮 e -->                                                          \
		            </div>                                                                                 \
		            <!-- 按钮 e -->                                                                        \
				</div>                                                                                     \
	</div>',	
	name: 'JoinClass',
	data: function () {
	  return {
			  courseName: null,
			  nickName: null
	  }
	  },
	  mounted: function() {
		if(hasReLoginRoom == true){
			this.onCancelClick();
		}
	},
	  methods: {
		  onjoinClick: function() {
			  var self = this;
			  if (!self.nickName || !self.courseName){
				  alert('昵称和课程不能为空');
			  }else {
				  alert(self.nickName + "加入课程" + self.courseName);
			  }
		  },
		  onCancelClick: function() {
			  //this.$router.go(-1);
			  this.$router.push({path: '/'})
		}
	}
};