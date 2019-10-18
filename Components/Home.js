class Home {
  render(data) {
    if (data) {
      console.log(data);
    }

    return `
        <body>
        <div class="container">
            <h3 class=" text-center" id="login_title">Chat Central</h3>
            <div class="dash" id="login_form"> 
                <div class="container-login">
                    
                    <div class="form">
                        <input type="text" name="username" id="username" autocomplete="off" required>
                        <label for="username" class="label-name">
                            <span class="content-name">Username</span>
                        </label>
                    </div>
                    <div class="form">
                        <input type="password" name="password" id="password" required>
                        <label for="password" class="label-name">
                            <span class="content-name">Password</span>
                        </label>
                    </div>
                    
                    <button onclick="home()">LOGIN</button>    
                </div>
            </div>
            <div class="messaging" id="messaging" hidden>
                <div class="inbox_msg">
                    <div class="inbox_people">
                    <div class="headind_srch">
                        <div class="recent_heading">
                        <h4>Channels</h4>
                        </div>
                        <div class="srch_bar">
                        <div class="stylish-input-group">
                            <input type="text" class="search-bar"  placeholder="Search" >
                            <span class="input-group-addon">
                            <button type="button"> <i class="fa fa-search" aria-hidden="true"></i> </button>
                            </span> </div>
                        </div>
                    </div>
                    <div class="inbox_chat">
                    <div class="chat_list" onclick="activeN('world')">
                    <div class="chat_people">
                        <div class="chat_ib">
                        <h5>#world</h5>
                        </div>
                    </div>
                    </div>
                    </div>
                    </div>
                    <div class="mesgs" >
                    <div class="chan-mesgs" id="world" >
                    <h4>World</h4>
                    
                    <div id="myModal" class="modal">
                        <span class="close" >&times;</span>
                        <img class="modal-content" id="img01">
                    </div>
                    <div class="msg_history">
                        
                    </div>
                    <form>
                    <div class="row upload">
                    
                    <i class="fa fa-upload fa-lg" aria-hidden="true" onclick="upload()"></i>
                    </div>
                    <div class="type_msg">
                        <div class="input_msg_write">
                        <textarea class="write_msg" id="world_msg" placeholder="Type a message"> </textarea>
                        <button class="msg_send_btn" id="world_btn" type="button"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></button>
                        </div>
                    </div>
                    </form>
                    </div>
                    </div>
                    <div class="chat_users">
                        <div class="headind_srch">
                            <div class="recent_heading">
                            <h4>Users</h4>
                            </div>
                            <div class="srch_bar">
                            <div class="stylish-input-group">
                                <input type="text" class="search-bar" placeholder="Search" />
                                <span class="input-group-addon">
                                <button type="button">
                                    <i class="fa fa-search" aria-hidden="true"></i>
                                </button>
                                </span>
                            </div>
                            </div>
                        </div>
                        <div class="inbox_users">
                        </div>
                    </div>

                </div>
                
                </div>
            </div>
        </body>`;
  }
}

module.exports = Home;
