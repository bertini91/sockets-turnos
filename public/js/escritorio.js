//Referencias HTML
const lblEscritorio = document.querySelector("h1"); //1er h1
const btnAtender = document.querySelector("button"); //1er button
const lblTicket = document.querySelector("small");
const divAlerta = document.querySelector(".alert");
const lblPendientes = document.querySelector("#lblPendientes");

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has("escritorio")) {
  window.location = "index.html";
  throw new Error("El escritorio es obligatorio");
}

const escritorio = searchParams.get("escritorio");
lblEscritorio.innerHTML = escritorio;

divAlerta.style.display = "none";

const socket = io();

socket.on("connect", () => {
  // console.log('Conectado');
  btnAtender.disabled = false;
});

socket.on("disconnect", () => {
  // console.log('Desconectado del servidor');
  btnAtender.disabled = true;
});

socket.on("tickets-pendientes", (pendientes) => {
  if (pendientes === 0) {
    lblPendientes.style.display = "none";
  } else {
    lblPendientes.style.display = "";
    lblPendientes.innerHTML = pendientes;
  }
});

btnAtender.addEventListener("click", () => {
  socket.emit("atender-ticket", { escritorio }, ({ ok, ticket, msg }) => {
    if (!ok) {
      lblTicket.innerHTML = "Nadie";
      return (divAlerta.style.display = "");
    }
    lblTicket.innerHTML = `Ticket ${ticket.numero}`;
  });
  /* socket.emit("siguiente-ticket", null, (ticket) => {
    console.log(ticket);
    lblNuevoTicket.innerHTML = ticket;
  }); */
});
