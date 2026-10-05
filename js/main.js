(function () {
  var WHATSAPP = "5551981793671";
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("menu");
  var label = toggle ? toggle.querySelector("[data-label]") : null;

  function setMenu(open) {
    if (!toggle || !menu) return;
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("menu-open", open);
    if (label) label.textContent = open ? "Fechar menu" : "Abrir menu";
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      setMenu(open);
      if (open) {
        var first = menu.querySelector("a");
        if (first) first.focus();
      }
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenu(false);
    });
  }

  var form = document.getElementById("form-cotacao");
  if (!form) return;

  var status = document.getElementById("form-status");
  var servico = form.elements.servico;
  var destinoLabel = document.getElementById("destino-label");
  var detalheLabel = document.getElementById("detalhe-label");
  var phone = form.elements.telefone;

  phone.addEventListener("input", function () {
    var digits = phone.value.replace(/\D/g, "").slice(0, 11);
    var masked = digits;
    if (digits.length > 2 && digits.length <= 6) {
      masked = "(" + digits.slice(0, 2) + ") " + digits.slice(2);
    } else if (digits.length > 6 && digits.length <= 10) {
      masked = "(" + digits.slice(0, 2) + ") " + digits.slice(2, 6) + "-" + digits.slice(6);
    } else if (digits.length > 10) {
      masked = "(" + digits.slice(0, 2) + ") " + digits.slice(2, 7) + "-" + digits.slice(7);
    }
    phone.value = masked;
  });

  servico.addEventListener("change", function () {
    var locacao = servico.value.indexOf("Locação") === 0;
    destinoLabel.querySelector("[data-copy]").textContent = locacao
      ? "Cidade onde o veículo vai rodar *"
      : "Cidade de destino *";
    detalheLabel.querySelector("[data-copy]").textContent = locacao
      ? "Qual veículo e por quanto tempo *"
      : "O que vai na carga *";
    form.elements.detalhe.placeholder = locacao
      ? "Tipo de veículo, por quantos dias e para qual uso."
      : "Peso ou volume, tipo de mercadoria e a data em que precisa sair.";
  });

  function clearErrors() {
    form.querySelectorAll(".field-error").forEach(function (field) {
      field.classList.remove("field-error");
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();
    status.textContent = "";
    status.className = "form-status";

    var nome = form.elements.nome.value.trim();
    var fone = phone.value.replace(/\D/g, "");
    var tipo = servico.value;
    var origem = form.elements.origem.value.trim();
    var destino = form.elements.destino.value.trim();
    var detalhe = form.elements.detalhe.value.trim();
    var missing = [];

    if (nome.length < 3) missing.push(form.elements.nome);
    if (fone.length < 10) missing.push(phone);
    if (!tipo) missing.push(servico);
    if (origem.length < 2) missing.push(form.elements.origem);
    if (destino.length < 2) missing.push(form.elements.destino);
    if (detalhe.length < 8) missing.push(form.elements.detalhe);

    if (missing.length) {
      missing.forEach(function (field) {
        field.classList.add("field-error");
      });
      status.classList.add("is-error");
      status.textContent = "Falta completar os campos marcados. Telefone com DDD e uma descrição de pelo menos uma linha.";
      missing[0].focus();
      return;
    }

    var locacao = tipo.indexOf("Locação") === 0;
    var linhas = [
      "Olá, RD Transportes. Quero uma cotação.",
      "Nome: " + nome,
      "Telefone: " + phone.value.trim(),
      "Serviço: " + tipo,
      "Origem: " + origem,
      (locacao ? "Cidade de uso: " : "Destino: ") + destino,
      "Detalhe: " + detalhe
    ];

    var url = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(linhas.join("\n"));
    var opened = window.open(url, "_blank", "noopener");
    status.classList.add("is-ok");
    if (opened) {
      status.textContent = "Abrimos o WhatsApp com o seu pedido.";
    } else {
      var link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "Abrir WhatsApp";
      status.append("O navegador segurou a nova aba. ", link);
    }
  });
})();
