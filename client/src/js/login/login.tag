<login>
  <form id="login" onsubmit={ loginabc }>
    <input name="input" id="user_name">
    <input name="input" type="password" id="password">
    <button>submit</button>
    <span id="error_message">
        {error}
    </span>
  </form>
  <script>
    login() {
        if(!opts.login_model.valid(this.user_name.value, this.password.value)) {
          this.error_message.innerHTML = 'user name and password can not be blank';
        }else{
          this.error_message.innerHTML = '';
        }
    }

    loginabc(evt) {
        evt.preventDefault();
        var that = this;
        opts.session_model.Session.login(this.user_name.value, this.password.value).fail(function(msg){
          that.error = msg;
        });
    }

  </script>
</login>
