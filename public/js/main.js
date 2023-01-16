const socket = io.connect();

// Recepciono los productos enviados por el servidor
socket.on("products", function (data) {
    console.log(data);
    renderProductList(data)
});

function renderProductList(data) {
    fetch(`http://localhost:8080/productList.handlebars`)
        .then((res) => res.text())
        .then((res) => {
            const template = Handlebars.compile(res)
            const html = template({ products: data })
            document.getElementById("productsContainer").innerHTML = html
        })
}

function addProducts(e) {
    let producto = {
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        image: document.getElementById("image").value
    }
    socket.emit("newProduct", producto)
    document.getElementById("title").value = ""
    document.getElementById("price").value = ""
    document.getElementById("image").value = ""
    return false;
}

//Web Chat
// Escucho los mensajes enviados por el servidor
socket.on("messages", function (data) {
    console.log(data)
    renderizar(data)
});

function renderizar(data) {
    if (data) {
        let html = data.map(function (elem, index) {
            return (`<div>
        <strong style="color:blue">${elem.author}</strong>
        <em style="color:brown">[${elem.dateMsg}]:</em>
        <em style="color:green;font-style:italic">${elem.text}</em>    
        </div>
        `)
        }).join(" ");
        document.getElementById("messages").innerHTML = html
    }
}

function addMessage(e) {
    let mensaje = {
        author: document.getElementById("author").value,
        text: document.getElementById("text").value,
        dateMsg: new Date().toLocaleString()
    }
    socket.emit("newMessage", mensaje)
    document.getElementById("author").value = ""
    document.getElementById("text").value = ""
    return false;
}