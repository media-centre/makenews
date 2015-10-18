<login>
  <form id="login" onsubmit={ login }>
    <input name="input" id="user_name">
    <input name="input" type="password" id="password">
    <button>submit</button>
    <span id="error_message"></span>
  </form>
  <script>
    login() {
        if(!opts.login_model.valid(this.user_name.value, this.password.value)) {
          this.error_message.innerHTML = 'user name and password can not be blank';
        }else{
          this.error_message.innerHTML = '';
        }
    }
  </script>
</login>
