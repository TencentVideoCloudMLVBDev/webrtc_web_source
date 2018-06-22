var Banner = {
	template:'\
  <div class="edu-header clearfix">                                                               \
  <h1>                                                                                         \
    <a href="javascript:return false;" onclick="return false;" title="WebRTC互通">                                                         \
      <img src="./assets/webrtc-logo-min.png" style="width:154px; height:26px" alt="WebRTC互通"></a> \
  </h1>                                                                                        \
  <div class="edu-class-title">{{courseName}}（ID:{{courseId}})</div>                          \
  <div class="edu-header-login">                                                               \
    <a href="javascript:return false;" onclick="return false;">{{teacher}}</a>                                                                 \
    <a v-on:click="logout">退出</a>                                                            \
    <a href="https://support.qq.com/products/31450" target="_blank">问题反馈</a>                                                            \
  </div>                                                                                       \
	</div>',	
	name: 'Banner',
    props: {
      teacher: String,
      courseName: String,
      courseId: String
    },
    methods: {
      logout:function () {
        this.$emit('logout')
      },
    }
};