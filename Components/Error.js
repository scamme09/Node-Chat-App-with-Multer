class Error {
  render(data) {
    if (data) {
      console.log(data);
    }

    return `
        <body>
        <div class="container-error">
            <h1>Page not found!</h1>
        </div>
           
        </body>`;
  }
}

module.exports = Error;
