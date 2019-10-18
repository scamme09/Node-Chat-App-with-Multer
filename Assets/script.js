const socket = io.connect();
const date = new Date();
const ms = $("#messaging");
const im = $(".inbox_msg");
const lf = $("#login_form");
const ic = $(".inbox_chat");
const iu = $(".inbox_users");
const ci = $(".chat_ib");
const mesgs = $(".mesgs");
let file = "";
let user = "";
const modal = $("#myModal");
const modalImg = $("#img01");
const captionText = $("#caption");
let currentRoom = "world";
let mh = $("#" + currentRoom + " .msg_history");
let message = $("#" + currentRoom + "_msg");
this.onload = function() {
  $("#password").keyup(e => {
    if (e.which == 13) {
      home();
    }
  });

  bindTextArea();
  getChannels();

  socket.on("open room", data => {
    let elem = `<div class="chan-mesgs" id="${data}">
        <h4>${data}</h4>
        <div class="msg_history">
            
        </div>
        <form>
        <div class="row upload">
        
        <i class="fa fa-upload fa-lg" aria-hidden="true" onclick="upload()"></i>
        </div>
        <div class="type_msg">
            <div class="input_msg_write">
            <textarea class="write_msg" id="${data}_msg" placeholder="Type a message"> </textarea>
            <button class="msg_send_btn" id="${data}_btn" type="button"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></button>
            </div>
        </div>
        </form>
        </div>`;
    mesgs.append(elem);
    activeN(data);

    $(function() {
      bindTextArea();
      getChannels();
    });
  });

  socket.on("pm", data => {
    let room = data.room;
    let recipient = data.user;
    let elem = `<div class="chan-mesgs" id="${room}">
        <h4>${recipient}</h4>
        <div class="msg_history">
            
        </div>
        <form>
        <div class="row upload">
        
        <i class="fa fa-upload fa-lg" aria-hidden="true" onclick="upload()"></i>
        </div>
        <div class="type_msg">
            <div class="input_msg_write">
            <textarea class="write_msg" id="${room}_msg" placeholder="Type a message"> </textarea>
            <button class="msg_send_btn" id="${room}_btn" type="button"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></button>
            </div>
        </div>
        </form>
        </div>`;
    mesgs.append(elem);
      let elem2 = "";
      const element = recipient;
      elem2 +=
        `<div class="chat_list" onclick="activeN('${room}')">
          <div class="chat_people">
              <div class="chat_ib">
              <h5>#` +
        element +
        ` </h5>
              </div>
          </div>
          </div>`;
      ic.append(elem2);
      $(function() {
        bindTextArea();
        getChannels();
      });
        
     if(user == data.origin){
       this.activeN(room)
     }else{
       
     }

  });

  socket.on("users connected", datas => {
    let elem = "";
    datas.forEach(data => {
      const element = data;
      elem +=
        `<div class="chat_list" onclick="privateM('${element}')">
          <div class="chat_people">
              <div class="chat_ib">
              <h5>#` +
        element +
        ` </h5>
              </div>
          </div>
          </div>`;
    });

    iu.html(elem);
    getChannels();
  });

  socket.on("access denied", function(data) {
    // console.log(data);
    $("#login_title").html(`User not found`);
  });

  socket.on("Already Connected", function(data) {
    // console.log(data);
    $("#login_title").html(data);
  });

  socket.on("receive msg", function(datas) {
    let data = datas;
    let room = data.room;
    mh = $("#" + room + " .msg_history");
    let msg = data.message;
    msg = msg.replace(/(?:\r\n|\r|\n)/g, "<br>");
    let elem =
      `<div class="incoming_msg">
        <div class="received_msg">
            <div class="received_withd_msg">
            <span class="time_date">` +
      data.sender +
      `</span>
            <span class="time_date">: ` +
      date.toLocaleString("en-US", {
        hour: "numeric",
        hour12: true,
        minute: "numeric"
      }) +
      `</span>
            <p>` +
      msg +
      `</p>
            </div>
        </div>
        </div>`;
    if (isImage(msg) === true) {
      mh.append(
        `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`
      );
      setTimeout(function() {
        $(".lds-ellipsis").remove();
        mh.append(elem);
        mh.animate(
          {
            scrollTop: 20000000
          },
          1000
        );
      }, 3000);
    } else {
      mh.append(elem);
    }

    mh.animate(
      {
        scrollTop: 20000000
      },
      1000
    );
  });

  socket.on("server message", data => {
    let elem =
      `<div class="incoming_msg">
            <center><div class="received_msg">
                <div class="received_withd_msg">
                    <span class="time_date">` +
      data +
      `</span>
                    <span class="time_date">: ` +
      date.toLocaleString("en-US", {
        hour: "numeric",
        hour12: true,
        minute: "numeric"
      }) +
      `</span>
                </div>
            </div>
        </div>`;
    mh = $("#" + currentRoom + " .msg_history");
    mh.append(elem);
    mh.animate(
      {
        scrollTop: 20000000
      },
      1000
    );
  });
};

function home() {
  let uname = document.getElementById("username").value;
  let pass = document.getElementById("password").value;
  let data = {
    username: uname,
    password: pass
  };

  socket.emit("user login", data, function(data) {
    // console.log(data);
  });

  socket.on("return home", function(data) {
    user = data;
    // console.log(user);
    ms.removeAttr("hidden");
    lf.hide();
    $("#login_title").html(`Welcome to Chat Central`);
    bindTextArea();
  });
}

function upload() {
  // console.log('clicked!');
  $(".upload").prepend(`<div class="preview" hidden>
    <i class="fa fa-close"></i>
    <img src="#" alt="image" class="img_preview">
    <input type="file" name="avatar" class="avatar" hidden onchange="readURL(this)" />
    </div>`);
  $(function() {
    $(".avatar").click();
    $(".fa-close").bind("click", function() {
      close($(this));
    });
  });
}

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $(".img_preview").attr("src", e.target.result);
    };

    reader.readAsDataURL(input.files[0]);
    $(".img_preview").removeAttr("hidden");
    $(".preview").removeAttr("hidden");
  }
}

function isImage(msg) {
  str = "<img";
  if (msg.indexOf(str) != -1) {
    return true;
  } else {
    return false;
  }
}

function close(elem) {
  elem.parent().remove();
}

function sendFile() {
  mh = $("#" + currentRoom + " .msg_history");
  let room = currentRoom;
  file = $(".avatar");
  if (typeof file.val() !== "undefined" && file.val().length > 0) {
    let filedata = file.val().replace(/C:\\fakepath\\/i, "");
    submitForm();
    let msg = `<img class="img-fluid img-thumbnail" src="/uploads/${filedata}" alt="image" onclick="img_prev(this)" >`;
    socket.emit("send msg", { message: msg, room: room });
    let elem =
      `<div class="outgoing_msg">
            <div class="sent_msg">
            <span class="time_date">Me</span>
            <span class="time_date">: ` +
      date.toLocaleString("en-US", {
        hour: "numeric",
        hour12: true,
        minute: "numeric"
      }) +
      `</span>
            <p>` +
      msg +
      `</p> 
            </div>
        </div>`;
    mh.append(
      `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`
    );
    mh.animate(
      {
        scrollTop: 20000000
      },
      1000
    );
    $("#" + user).html(
      `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`
    );
    setTimeout(function() {
      $(".lds-ellipsis").remove();
      mh.append(elem);
      mh.animate(
        {
          scrollTop: 20000000
        },
        1000
      );
      message.focus();
      str = "<img";
      if (msg.indexOf(str) != -1) {
        $("#" + user).html("<p>image</p>");
      } else {
        $("#" + user).html(msg);
      }
    }, 3000);
    $(".upload").empty();
    $(".upload").append(
      `<i class="fa fa-upload fa-lg" aria-hidden="true" onclick="upload()"></i>`
    );
  } else {
  }
}

function sendMessage() {
  mh = $("#" + currentRoom + " .msg_history");
  let room = currentRoom;
  //   room = room.replace('_id', '');
  let text = $("#" + room + "_msg");
  let msg_text = $.trim(text.val());
  if (typeof msg_text !== "undefined" && msg_text.length > 0) {
    socket.emit("send msg", { message: msg_text, room: room });
    let msg = msg_text;
    msg = msg.replace(/(?:\r\n|\r|\n)/g, "<br>");
    message.val("");
    let elem =
      `<div class="outgoing_msg">
            <div class="sent_msg">
            <span class="time_date">Me</span>
            <span class="time_date">: ` +
      date.toLocaleString("en-US", {
        hour: "numeric",
        hour12: true,
        minute: "numeric"
      }) +
      `</span>
            <p>` +
      msg +
      `</p> 
            </div>
        </div>`;
    $(".lds-ellipsis").remove();
    mh.append(elem);
    mh.animate(
      {
        scrollTop: 20000000
      },
      1000
    );
    mh.stop();
    message.focus();
    $("#" + user).html(msg);
  } else {
    message.focus();
  }
}

function img_prev(elem) {
  // console.log(elem);
  let img = elem;
  let src = img.src;
  modal.css("display", "block");
  modalImg.attr("src", src);
  captionText.innerHTML = img.alt;
  $(function() {
    $(".close").bind("click", function() {
      modal.css("display", "none");
    });
  });
}

function joinRoom(data) {
  let elem = "";
  const element = data;
  elem +=
    `<div class="chat_list" onclick="activeN('${element}')">
        <div class="chat_people">
            <div class="chat_ib">
            <h5>#` +
    element +
    ` </h5>
            </div>
        </div>
        </div>`;
  ic.append(elem);
  socket.emit("join room", element, data => {
    console.log(data);
  });
}

function bindTextArea() {
  message = $("#" + currentRoom + "_msg");
  message.focus();
  $("#" + currentRoom + "_btn").on("click", () => {
    if (typeof message.val() !== "undefined" && message.val().length > 0) {
      sendMessage();
      sendFile();
    } else {
      sendFile();
    }
  });
  message.on("keyup", function(e) {
    let text = $(this).val();
    if ($.trim(text) === "/join") {
      $(this).css({ color: "teal" });
    }

    let isRoom = false;
    let str = "/join";
    if (text.indexOf(str) != -1) {
      isRoom = true;
    } else {
      isRoom = false;
    }

    if (e.which === 13) {
      if (e.shiftKey) {
      } else {
        if (isRoom == true) {
          isRoom = false;
          text = message.val();
          let room = text.replace("/join ", "");
          e.preventDefault();
          room = $.trim(room);
          joinRoom(room);
          message.removeAttr("style");
          message.val("");
        } else {
          $("#" + currentRoom + "_btn").click();
        }
      }
    }
  });
}

function submitForm() {
  file = $(".avatar");
  $(document).ready(function() {
    $("form").submit(function(e) {
      let data = new FormData(jQuery("form")[0]);
      e.preventDefault();
      $.ajax({
        url: "http://localhost:8000/profile",
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        method: "POST",
        type: "POST",
        success: function(data) {
          // console.log(data);
        },
        error: function(x, y, z) {
          console.log(x);
          console.log(y);
          console.log(z);
        }
      });
      $(".img_preview").attr("hidden", "true");
      file.val(null);
    });
  });
}

function activeN(room) {
  $("#" + currentRoom).hide();
  $(".chan-mesgs").hide();
  currentRoom = room;
  $("#" + room).show();
  bindTextArea();
}

function getChannels() {
  let channels = {};
  let initials = [];
  for (i = 0; i < ci.length; i++) {
    const element = ci[i];
    name = element.children[0].innerHTML;
    channels[name] = name.charAt(1).toUpperCase();
  }
  initials = Object.values(channels);

  $(".chat_ib h5").each(function() {
    $(this).attr(
      "data-letters",
      $(this)[0]
        .innerText.charAt(1)
        .toUpperCase()
    );
  });
}

function privateM(data) {
  if (data === user) {
    alert("Nah...");
  } else {
    socket.emit("open pm", { room: data, user: user });
  }
  console.log(user + " started a chat with " + data);
}
