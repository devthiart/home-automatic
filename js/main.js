/*******************************************************************************
 * CANAL INTERNET E COISAS                                                     *
 * Arduino Mega ESP8266 - Review                                               *
 * Exemplo Master - ESP8266 - Arquivo JavaScript                               *
 * 03/2020 - Andre Michelon                                                    *
 * andremichelon@internetecoisas.com.br                                        *
 * https://internetecoisas.com.br                                              *
 ******************************************************************************/

// Tratamento Requisições DW ----------------------------
// Variáveis
var dwRef, dwVal;

// Processa retorno
function changeDW() {
  if (this.readyState == 4) {
    if (this.status == 200 && this.responseText != null) {
      var resp = this.responseText;
      if (resp == "") {
        console.log("dw - Sem retorno.");
      } else {
        // Status
        setStatus(dwRef, dwVal);
        // Último evento
        setEvent(dwRef, "Equipamento " +
                        (resp == 0 ? "foi " : "já estava ") +
                        (dwVal == 0 ? "desligado" : "ligado"));
      }
    } else {
      console.log("Falha na equisição DW.");
    }
  }
}

// Objeto HTTPRequest
var reqDW = new XMLHttpRequest();
reqDW.onreadystatechange = changeDW;

// Função de disparo
function dw(ref, val) {
  dwRef = ref;
  dwVal = val;
  reqDW.open("GET", "/dw?ref=" + ref + "&val=" + val, true);
  reqDW.send(null);
}

// Tratamento Requisições DT ----------------------------
// Variáveis
var dtRef;

// Processa retorno
function changeDT() {
  if (this.readyState == 4) {
    if (this.status == 200 && this.responseText != null) {
      var resp = this.responseText;
      if (resp == "") {
        console.log("dt - Sem retorno.");
      } else {
        // Status
        setStatus(dtRef, resp);
        // Último evento
        setEvent(dtRef, "Equipamento " +
                        (resp == 0 ? "desligado" : "ligado"));
      }
    } else {
      console.log("Falha na equisição DT.");
    }
  }
}

// Objeto HTTPRequest
var reqDT = new XMLHttpRequest();
reqDT.onreadystatechange = changeDT;

// Função de disparo
function dt(ref) {
  dtRef = ref;
  reqDT.open("GET", "/dt?ref=" + ref, true);
  reqDT.send(null);
}

// Tratamento Requisições AW ----------------------------
// Variáveis
var awRef;
var awVal;

// Processa retorno
function changeAW() {
  if (this.readyState == 4) {
    if (this.status == 200 && this.responseText != null) {
      var resp = this.responseText;
      if (resp == "") {
        console.log("aw - Sem retorno.");
      } else {
        // Status
        st = document.getElementById("stGPIO44");
        st.innerText = "PWM " + awVal;
        st.style.background = "rgb(128, 128, 255)";
        // Último evento
        setEvent(awRef, "LED foi alterado para PWM " + awVal);
      }
    } else {
      console.log("Falha na equisição AW.");
    }
  }
}

// Objeto HTTPRequest
var reqAW = new XMLHttpRequest();
reqAW.onreadystatechange = changeAW;

// Função de disparo
function aw(ref, val) {
  awRef = ref;
  awVal = val;
  reqAW.open("GET", "/aw?ref=" + ref + "&val=" + val, true);
  reqAW.send(null);
}

// Tratamento Requisições DR ----------------------------
// Variáveis
var drRef;

// Processa retorno
function changeDR() {
  if (this.readyState == 4) {
    if (this.status == 200 && this.responseText != null) {
      var resp = this.responseText;
      // Status
      setStatus(drRef, (resp == 1 ? 0 : 1));
    } else {
      console.log("Falha na equisição DR.");
    }
  }
}

// Objeto HTTPRequest
var reqDR = new XMLHttpRequest();
reqDR.onreadystatechange = changeDR;

// Tratamento Requisições AR ----------------------------
// Variáveis
var arRef;

// Processa retorno
function changeAR() {
  if (this.readyState == 4) {
    if (this.status == 200 && this.responseText != null) {
      var resp = parseInt(this.responseText);
      if (isNaN(resp)) {
        resp = 0;
      }
      // Status
      document.getElementById("GPIO62").value = resp;
      document.getElementById("stGPIO62").innerText = resp.toString() + " (" + Math.round(resp * 100 / 1023) + "%)";
    } else {
      console.log("Falha na equisição AR.");
    }
  }
}

// Objeto HTTPRequest
var reqAR = new XMLHttpRequest();
reqAR.onreadystatechange = changeAR;

// Funções auxiliares -----------------------------------
function getStatus() {
  // Processa atualização de status para Interruptor e Potenciômetro
  if (reqDR.readyState == 0 || reqDR.readyState == 4) {
    drRef = 51;
    reqDR.open("GET", "/dr?ref=" + drRef, true);
    reqDR.send(null);
  }

  if (reqAR.readyState == 0 || reqAR.readyState == 4) {
    arRef = 62;
    reqAR.open("GET", "/ar?ref=" + arRef, true);
    reqAR.send(null);
  }

  window.setTimeout(getStatus, 1000);
}

// Tratamento Requisições VV ----------------------------
// Variáveis
var vvRef;

// Processa retorno
function changeVV() {
  if (this.readyState == 4) {
    if (this.status == 200 && this.responseText != null) {
      var resp = parseFloat(this.responseText);
      if (isNaN(resp)) {
        resp = 0;
      }
      // Status
      document.getElementById("GPIO62").value = resp;
      document.getElementById("stGPIO62").innerText = resp.toString() + ")";
    } else {
      console.log("Falha na equisição VV.");
    }
  }
}

// Objeto HTTPRequest
var reqVV = new XMLHttpRequest();
reqVV.onreadystatechange = changeVV;

// Funções auxiliares -----------------------------------
function getStatusString() {
  // Processa atualização de status para Interruptor e Potenciômetro
  if (reqVV.readyState == 0 || reqVV.readyState == 4) {
    vvRef = 0;
    reqVV.open("GET", "/vv?ref=" + vvRef, true);
    reqVV.send(null);
  }

  if (reqVV.readyState == 0 || reqVV.readyState == 4) {
    arRef = 0;
    reqVV.open("GET", "/vv?ref=" + vvRef, true);
    reqVV.send(null);
  }

  window.setTimeout(getStatusString, 1000);
}

function pwmChange() {
  // Atualiza exibição do valor de PWM selecionado
  document.getElementById("pwmBtn").innerText = "PWM " + document.getElementById("pwm").value;
}

function setStatus(ref, b) {
  // Atualiza indicador de status
  st = document.getElementById("stGPIO" + ref);
  if (b == 1) {
    st.innerText = "Ligado";
    st.style.background = "rgb(170, 236, 83)";
  } else {
    st.innerText = "Desligado";
    st.style.background = "rgb(227, 0, 14)";
  }
}

function setEvent(ref, s) {
  // Atualiza último evento
  document.getElementById("evGPIO" + ref).innerText = s;
}
