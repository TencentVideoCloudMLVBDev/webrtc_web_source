var CreateCourse = {
	template: '\
<div class="edu-index-body">                                                                     \
	<div class="edu-index-pop-ups" style="margin: 0 auto;">                                      \
		<div class="edu-index-logo" style="display: flex;justify-content: center;">                                                             \
			<img  src="./assets/webrtc-logo-min.png" alt="" />                                     \
		</div>                                                                                   \
		<!-- 输入直播房间 s -->                                                                  \
		<div class="edu-index-class-input">                                                      \
			<ul>                                                                                 \
				<li><input type="text" placeholder="请输入房间名称" v-model="courseName" /></li> \
				<li><input type="text" placeholder="请输入你的昵称" v-model="nickName" /></li> \
			</ul>	                                                                             \
		</div>                                                                       			 \
		<!-- 输入直播房间 e -->                                                                  \
                                                                                                 \
		<!-- 按钮 s -->                                                                          \
		<div class="edu-index-button">                                                           \
			<!-- 加入教室的按钮 s -->                                                            \
			<div class="tc-15-rich-dialog-ft">                                                   \
				<div class="tc-15-rich-dialog-ft-btn-wrap">                                      \
					<button v-on:click="onClickCreate" class="tc-15-btn">创建</button>           \
					<button v-on:click="onClickCancel" class="tc-15-btn weak">取消</button>      \
				</div>                                                                           \
			</div>                                                                               \
			<!-- 加入教室的按钮 e -->                                                            \
		</div>                                                                                   \
		<!-- 按钮 e -->                                                                          \
	</div>                                                                                       \
	</div>',

	name: 'CreateCourse',
	data: function () {
		return {
			courseName: null,
			nickName: null,
		};
	},
	mounted: function () {},
	methods: {
		onClickCreate: function () {
			var self = this;
			console.log('create course: ', self.courseName, ' by ', self.nickName)
			if (!self.courseName || !self.nickName) {
				alert('课程名字和昵称不能为空!')
				return;
			} else if (self.courseName.length > 15) {
				alert('课程名字太长');
				self.courseName = null;
				return;
			} else {
				console.log(self.nickName + "创建课程:" + self.courseName);
				var name = this.nickName;
				var course = this.courseName;
				this.courseName = null;
				this.$router.push({
					path: 'main',
					query: {
						cmd: 'create',
						creator: name,
						courseName: course
					}
				})
			}
		},
		onClickCancel: function () {
			//this.$router.go(-1);
			this.$router.push({
				path: '/'
			});
		}
	},
	created: function () {
		console.log('创建课程 created: query=', JSON.stringify(this.$route.query))
		this.nickName = this.$route.query.name
	},

};