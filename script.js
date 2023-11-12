let dados = []

async function enviarParaServidor(dados) {
  for (const i of dados) {
    
    var modalTexto = document.querySelector("#modal-loading > div > div > div > div:nth-child(2)");
    modalTexto.innerHTML = `Bloqueando o cliente: ${i}`;
    
    await fetch("http://54.233.229.72:3000/receber-dados", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dados: i }),
    })
      .then((response) => response.json())
      .then((data) => {
        processarDados(data);
      })
      .catch((error) => {
        console.error("Erro ao enviar dados para o servidor:", error);
      });
    try {
      var tabela = document.querySelector("body > table:nth-child(7)");
document.body.removeChild(tabela)
    } catch{}
    criarTabela();
  }
  esconderModal();
}

function processarDados(data) {
  console.log(data.mensagem);
  dados.push(data.dados);
}

function mostrarModal() {
  document.querySelector("#modal-loading").style.visibility = "visible";
}

function esconderModal() {
  document.querySelector("#modal-loading").style.visibility = "hidden";
}

function criarTabela() {
  var tabela = document.createElement("table");

  for (var i = 0; i < dados.length; i++) {
    var linha = document.createElement("tr");

    var celulaClient = document.createElement("td");
    celulaClient.textContent = dados[i].client;
    linha.appendChild(celulaClient);

    var celulaStatus = document.createElement("td");
    celulaStatus.textContent = dados[i].status;
    linha.appendChild(celulaStatus);

    tabela.appendChild(linha);
  }

  document.body.appendChild(tabela);
}

document
  .getElementById("uploadForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    mostrarModal();

    const arquivo = document.getElementById("arquivoInput").files[0];
    const leitor = new FileReader();
    const colunaDados = [];

    leitor.onload = function (e) {
      const arrayBuffer = e.target.result;
      const workbook = new ExcelJS.Workbook();

      workbook.xlsx.load(arrayBuffer).then(function () {
        const worksheet = workbook.getWorksheet(1);

        worksheet
          .getColumn("D")
          .eachCell({ includeEmpty: false }, function (cell) {
            colunaDados.push(cell.value);
          });
        enviarParaServidor(colunaDados);
        console.log(colunaDados);
      });
    };

    leitor.readAsArrayBuffer(arquivo);
  });
