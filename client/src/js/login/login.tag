<login>
  <form id="login" onsubmit={ login }>
    <input name="input" id="user_name">
    <input name="input" type="password" id="password">
    <button>submit</button>
    <span id="error_message">
        {error}
    </span>
  </form>
  <script>
    login(evt) {
        evt.preventDefault();
        var that = this;
        opts.session_model.Session.login(this.user_name.value, this.password.value).then(function(){
          that.unmount();
        }).fail(function(msg){
          that.error = msg;
        });
    }
  </script>
</login>
