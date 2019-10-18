class Login {
  render() {
    return `
        <body>
        <div class="container-login">
            <h3 id="login_title">User Login</h3>
            <div class="form-group login">
                <input type="text" class="form-control" name="username" id="username" placeholder="Username">
                <input type="password" class="form-control" name="password" id="password" placeholder="Password">
                <button class="btn btn-primary" onclick="home()">LOGIN</button>
            </div>
        </div>
           
        </body>`;
  }
}

module.exports = Login;
