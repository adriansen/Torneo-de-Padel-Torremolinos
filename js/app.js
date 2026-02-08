/*********************************
 * DATOS BASE
 *********************************/
const equiposA = [
  "C.P. Torremolinos - A",
  "Sitges/Cierzo Zaragoza",
  "Dracs Valencia - A",
  "GMadrid - A",
  "Chicota Sevilla - A"
];

const equiposB = [
  "C.P. Torremolinos - B",
  "Diversport Torremolinos",
  "Dracs Valencia - B",
  "GMadrid - B",
  "Chicota Sevilla - B"
];

const enfrentamientos = [
  { id: 1,  hora: "Viernes 17:00",     e1: "C.P. Torremolinos - B", e2: "Diversport Torremolinos", liga: "B" },
  { id: 2,  hora: "Viernes 18:00",     e1: "Dracs Valencia - A",    e2: "Sitges/Cierzo Zaragoza", liga: "A" },
  { id: 3,  hora: "Viernes 19:00",     e1: "C.P. Torremolinos - A", e2: "GMadrid - A",            liga: "A" },
  { id: 4,  hora: "Viernes 20:00",     e1: "GMadrid - B",           e2: "Chicota Sevilla - B",    liga: "B" },
  { id: 5,  hora: "Sábado 10:00",      e1: "Dracs Valencia - B",    e2: "Diversport Torremolinos", liga: "B" },
  { id: 6,  hora: "Sábado 11:00",      e1: "Dracs Valencia - A",    e2: "Chicota Sevilla - A",     liga: "A" },
  { id: 7,  hora: "Sábado 12:00",      e1: "C.P. Torremolinos - B", e2: "Chicota Sevilla - B",     liga: "B" },
  { id: 8,  hora: "Sábado 13:00 - 1",  e1: "C.P. Torremolinos - A", e2: "Sitges/Cierzo Zaragoza",  liga: "A" },
  { id: 9,  hora: "Sábado 13:00 - 2",  e1: "GMadrid - B",           e2: "Dracs Valencia - B",      liga: "B" },
  { id: 10, hora: "Sábado 14:00 - 1",  e1: "GMadrid - A",           e2: "Chicota Sevilla - A",     liga: "A" },
  { id: 11, hora: "Sábado 14:00 - 2",  e1: "Chicota Sevilla - B",   e2: "Diversport Torremolinos", liga: "B" },
  { id: 12, hora: "Sábado 15:00 - 1",  e1: "GMadrid - A",           e2: "Sitges/Cierzo Zaragoza",  liga: "A" },
  { id: 13, hora: "Sábado 15:00 - 2",  e1: "C.P. Torremolinos - B", e2: "Dracs Valencia - B",      liga: "B" },
  { id: 14, hora: "Sábado 16:00 - 1",  e1: "C.P. Torremolinos - A", e2: "Chicota Sevilla - A",     liga: "A" },
  { id: 15, hora: "Sábado 16:00 - 2",  e1: "GMadrid - B",           e2: "Diversport Torremolinos", liga: "B" },
  { id: 16, hora: "Sábado 17:00 - 1",  e1: "GMadrid - A",           e2: "Dracs Valencia - A",      liga: "A" },
  { id: 17, hora: "Sábado 17:00 - 2",  e1: "Dracs Valencia - B",    e2: "Chicota Sevilla - B",     liga: "B" },
  { id: 18, hora: "Sábado 18:00 - 1",  e1: "Sitges/Cierzo Zaragoza", e2: "Chicota Sevilla - A",    liga: "A" },
  { id: 19, hora: "Sábado 18:00 - 2",  e1: "C.P. Torremolinos - B",  e2: "Dracs Valencia - B",     liga: "B" },
  { id: 20, hora: "Sábado 19:00 - 1",  e1: "C.P. Torremolinos - A", e2: "Dracs Valencia - A",      liga: "A" }
];

/*********************************
 * ESTADO
 *********************************/
let resultados = {};
let enfrentamientoActivo = null;
let tablaA, tablaB;

/*********************************
 * TABLAS
 *********************************/
function crearTabla(equipos) {
  const t = {};
  equipos.forEach(e => {
    t[e] = {
      PJ: 0, PG: 0, PP: 0, PTS: 0,
      SG: 0, SP: 0,
      JG: 0, JP: 0
    };
  });
  return t;
}

/*********************************
 * RENDER ENFRENTAMIENTOS
 *********************************/
function renderEnfrentamientos() {
  const cont = document.getElementById("partidos-list");
  cont.innerHTML = "";

  enfrentamientos.forEach(e => {
    const r = resultados[e.id];
    let resumen = "";
    let tablaPartidos = "";
    let detalle = "";

    if (r) {
      let ganadosE1 = 0;
      let ganadosE2 = 0;

      r.parejas.forEach(p => {
        if (!p || !p.sets) return;

        let s1 = 0, s2 = 0;

        p.sets.forEach(s => {
          if (!s) return;
          if (s.j1 > s.j2) s1++;
          else if (s.j2 > s.j1) s2++;
        });

        if (s1 > s2) ganadosE1++;
        else if (s2 > s1) ganadosE2++;
      });

      resumen = `
        <div class="resumen-enfrentamiento">
          <strong>${ganadosE1} - ${ganadosE2}</strong>
        </div>
      `;

      tablaPartidos = `
        <table class="tabla-partidos-mini">
          <tr>
            <th>P1</th><th>P2</th><th>P3</th><th>P4</th><th>P5</th>
          </tr>
          <tr>
            ${r.parejas.map(p => {
              if (!p || !p.sets) return `<td>-</td>`;
              const texto = p.sets.map(s => s ? `${s.j1}/${s.j2}` : "NJ").join(" · ");
              return `<td>${texto}</td>`;
            }).join("")}
          </tr>
        </table>
      `;

      detalle = `
        <div class="detalle-toggle" onclick="toggleDetalle(${e.id})">
          Ver detalle ▼
        </div>

        <div id="detalle-${e.id}" class="detalle-partidos">
          <table class="tabla-detalle">
            <tr>
              <th>Partido</th>
              <th>Ganador</th>
              <th>Sets</th>
            </tr>
            ${r.parejas.map((p, i) => {
              if (!p || !p.sets) return "";

              let s1 = 0, s2 = 0;
              const setsTexto = p.sets.map(s => {
                if (!s) return "NJ";
                if (s.j1 > s.j2) s1++;
                else if (s.j2 > s.j1) s2++;
                return `${s.j1}/${s.j2}`;
              }).join(" · ");

              let ganador = "-";
              if (s1 > s2) ganador = e.e1;
              else if (s2 > s1) ganador = e.e2;

              return `
                <tr>
                  <td>P${i+1}</td>
                  <td>${ganador}</td>
                  <td>${setsTexto}</td>
                </tr>
              `;
            }).join("")}
          </table>
        </div>
      `;
    }

    cont.innerHTML += `
      <div class="partido card">
        <strong>${e.hora}</strong><br>
        ${e.e1} vs ${e.e2}
        ${resumen}
        ${tablaPartidos}
        ${detalle}
        ${modoCapitan ? `<button onclick="abrirFormulario(${e.id})">Editar resultado</button>` : ""}
      </div>
    `;
  });
}

/*********************************
 * FORMULARIO
 *********************************/
function abrirFormulario(id) {
  enfrentamientoActivo = enfrentamientos.find(p => p.id === id);
  document.getElementById("modal").style.display = "block";
  document.body.classList.add("modal-open");

  document.getElementById("form-equipos").innerHTML =
    `<strong>${enfrentamientoActivo.e1}</strong> vs <strong>${enfrentamientoActivo.e2}</strong>`;

  if (!resultados[id]) {
    resultados[id] = {
      parejas: [
        { sets: [undefined, undefined, undefined] },
        { sets: [undefined, undefined, undefined] },
        { sets: [undefined, undefined, undefined] },
        { sets: [undefined, undefined, undefined] },
        { sets: [undefined, undefined, undefined] }
      ]
    };
  }

  const cont = document.getElementById("sets");
  cont.innerHTML = "";

  resultados[id].parejas.forEach((pareja, index) => {
    cont.innerHTML += `
      <div class="pareja-block">
        <h3>Pareja ${index + 1}</h3>
        <div class="sets-pareja" data-pareja="${index}">
          ${[0,1,2].map(i => `
            <div class="set-row">
              Set ${i+1}:
              <input type="number" min="0" max="7" class="j1">
              -
              <input type="number" min="0" max="7" class="j2">
              <label>
                <input type="checkbox" class="no-jugado"> No jugado
              </label>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  });

  // Rellenar datos + lógica No Jugado
  document.querySelectorAll(".sets-pareja").forEach((parejaDiv, pIndex) => {
    const pareja = resultados[id].parejas[pIndex];

    parejaDiv.querySelectorAll(".set-row").forEach((row, sIndex) => {
      const savedSet = pareja.sets[sIndex];

      const inputJ1 = row.querySelector(".j1");
      const inputJ2 = row.querySelector(".j2");
      const chkNJ = row.querySelector(".no-jugado");

      inputJ1.classList.remove("set-win", "set-lose");
      inputJ2.classList.remove("set-win", "set-lose");

      if (savedSet === null) {
        // 1. Guardado como no jugado
        chkNJ.checked = true;
        inputJ1.disabled = true;
        inputJ2.disabled = true;
        inputJ1.value = "";
        inputJ2.value = "";
      } else if (savedSet === undefined) {
        // 2. No existe aún → no marcar
        chkNJ.checked = false;
        inputJ1.disabled = false;
        inputJ2.disabled = false;
        inputJ1.value = "";
        inputJ2.value = "";
      } else if (savedSet.j1 === "" || savedSet.j2 === "") {
        // 3. Vacío → no jugado
        chkNJ.checked = true;
        inputJ1.disabled = true;
        inputJ2.disabled = true;
        inputJ1.value = "";
        inputJ2.value = "";
      } else {
        // 4. Con valores → rellenar
        chkNJ.checked = false;
        inputJ1.disabled = false;
        inputJ2.disabled = false;

        inputJ1.value = savedSet.j1;
        inputJ2.value = savedSet.j2;

        if (savedSet.j1 > savedSet.j2) {
          inputJ1.classList.add("set-win");
          inputJ2.classList.add("set-lose");
        } else if (savedSet.j2 > savedSet.j1) {
          inputJ1.classList.add("set-lose");
          inputJ2.classList.add("set-win");
        }
      }

      function recolor() {
        if (inputJ1.value === "" && inputJ2.value === "") {
          chkNJ.checked = true;
          inputJ1.disabled = true;
          inputJ2.disabled = true;
          inputJ1.classList.remove("set-win", "set-lose");
          inputJ2.classList.remove("set-win", "set-lose");
          return;
        }

        chkNJ.checked = false;
        inputJ1.disabled = false;
        inputJ2.disabled = false;

        inputJ1.classList.remove("set-win", "set-lose");
        inputJ2.classList.remove("set-win", "set-lose");

        const v1 = Number(inputJ1.value);
        const v2 = Number(inputJ2.value);

        if (!isNaN(v1) && !isNaN(v2)) {
          if (v1 > v2) {
            inputJ1.classList.add("set-win");
            inputJ2.classList.add("set-lose");
          } else if (v2 > v1) {
            inputJ1.classList.add("set-lose");
            inputJ2.classList.add("set-win");
          }
        }
      }

      inputJ1.addEventListener("input", recolor);
      inputJ2.addEventListener("input", recolor);
    });
  });
}

/*********************************
 * GUARDAR RESULTADOS
 *********************************/
document.getElementById("form-resultados").onsubmit = e => {
  e.preventDefault();

  if (!confirm("¿Confirmas guardar este resultado?\nPodrá modificarse más adelante.")) return;

  const parejas = [];

  document.querySelectorAll(".sets-pareja").forEach(parejaDiv => {
    const sets = [];

    parejaDiv.querySelectorAll(".set-row").forEach(row => {
      const noJugado = row.querySelector(".no-jugado").checked;

      if (noJugado) {
        sets.push(null);
      } else {
        const j1 = Number(row.querySelector(".j1").value);
        const j2 = Number(row.querySelector(".j2").value);
        sets.push({ j1, j2 });
      }
    });

    parejas.push({ sets });
  });

  resultados[enfrentamientoActivo.id] = { parejas };

  db.collection("resultados")
    .doc(String(enfrentamientoActivo.id))
    .set(resultados[enfrentamientoActivo.id])
    .then(() => {
      console.log("Resultado guardado en Firestore");
    })
    .catch(err => {
      console.error("Error guardando en Firestore", err);
      alert("Ha habido un error guardando en la nube.");
    });

  recalcularTablas();
  renderEnfrentamientos();
  cerrarModal();
};

/*********************************
 * TABLAS HTML
 *********************************/
function renderTabla(liga, tabla) {
  const div = document.getElementById(`tabla-liga${liga}`);
  div.innerHTML = `
    <h2>Liga ${liga}</h2>
    <table>
      <tr>
        <th>Equipo</th><th>PJ</th><th>PG</th><th>PP</th><th>PTS</th>
        <th>SG</th><th>SP</th><th>Dif S</th>
        <th>JG</th><th>JP</th><th>Dif J</th>
      </tr>
      ${Object.entries(tabla)
        .sort((a,b)=>
          b[1].PTS - a[1].PTS ||
          (b[1].SG - b[1].SP) - (a[1].SG - a[1].SP) ||
          (b[1].JG - b[1].JP) - (a[1].JG - a[1].JP)
        )
        .map(([k,v])=>`
          <tr>
            <td>${k}</td>
            <td>${v.PJ}</td>
            <td>${v.PG}</td>
            <td>${v.PP}</td>
            <td>${v.PTS}</td>
            <td>${v.SG}</td>
            <td>${v.SP}</td>
            <td>${v.SG - v.SP}</td>
            <td>${v.JG}</td>
            <td>${v.JP}</td>
            <td>${v.JG - v.JP}</td>
          </tr>`).join("")}
    </table>
  `;
}

/*********************************
 * RECÁLCULO TOTAL
 *********************************/
function recalcularTablas() {
  tablaA = crearTabla(equiposA);
  tablaB = crearTabla(equiposB);

  Object.entries(resultados).forEach(([id, r]) => {
    const enf = enfrentamientos.find(x => x.id == id);
    if (!enf) return;

    const t = enf.liga === "A" ? tablaA : tablaB;

    const e1 = t[enf.e1];
    const e2 = t[enf.e2];
    if (!e1 || !e2) return;

    let partidosE1 = 0;
    let partidosE2 = 0;

    let setsE1 = 0;
    let setsE2 = 0;

    let juegosE1 = 0;
    let juegosE2 = 0;

    r.parejas.forEach(p => {
      if (!p || !p.sets) return;

      let s1 = 0, s2 = 0;

      p.sets.forEach(s => {
        if (!s) return;

        juegosE1 += s.j1;
        juegosE2 += s.j2;

        if (s.j1 > s.j2) s1++;
        else if (s.j2 > s.j1) s2++;
      });

      setsE1 += s1;
      setsE2 += s2;

      if (s1 > s2) partidosE1++;
      else if (s2 > s1) partidosE2++;
    });

    e1.SG += setsE1;
    e1.SP += setsE2;
    e2.SG += setsE2;
    e2.SP += setsE1;

    e1.JG += juegosE1;
    e1.JP += juegosE2;
    e2.JG += juegosE2;
    e2.JP += juegosE1;

    e1.PJ++;
    e2.PJ++;

    let ptsE1 = 0, ptsE2 = 0;

    if (partidosE1 > partidosE2) {
      e1.PG++;
      e2.PP++;

      // Asignación de puntos ampliada
      if (partidosE1 === 5) { ptsE1 = 5; ptsE2 = 0; }
      else if (partidosE1 === 4) { ptsE1 = 4; ptsE2 = 1; }
      else if (partidosE1 === 3) { ptsE1 = 3; ptsE2 = 2; }
      else if (partidosE1 === 2) { ptsE1 = 2; ptsE2 = 0; }
      else if (partidosE1 === 1) { ptsE1 = 1; ptsE2 = 0; }

    } else if (partidosE2 > partidosE1) {
      e2.PG++;
      e1.PP++;

      if (partidosE2 === 5) { ptsE2 = 5; ptsE1 = 0; }
      else if (partidosE2 === 4) { ptsE2 = 4; ptsE1 = 1; }
      else if (partidosE2 === 3) { ptsE2 = 3; ptsE1 = 2; }
      else if (partidosE2 === 2) { ptsE2 = 2; ptsE1 = 0; }
      else if (partidosE2 === 1) { ptsE2 = 1; ptsE1 = 0; }
    }


    e1.PTS += ptsE1;
    e2.PTS += ptsE2;
  });

  renderTabla("A", tablaA);
  renderTabla("B", tablaB);
}

/*********************************
 * MODAL Y DETALLE
 *********************************/
function cerrarModal() {
  document.getElementById("modal").style.display = "none";
  document.body.classList.remove("modal-open");
}

function toggleDetalle(id) {
  const div = document.getElementById(`detalle-${id}`);
  div.classList.toggle("open");
}

/*********************************
 * SUSCRIBIR RESULTADOS DESDE DB
 *********************************/
function suscribirResultados() {
  db.collection("resultados").onSnapshot(snap => {
    resultados = {};
    snap.forEach(doc => {
      resultados[doc.id] = doc.data();
    });

    recalcularTablas();
    renderEnfrentamientos();
  });
}

/*********************************
 * INICIO
 *********************************/
document.addEventListener("DOMContentLoaded", () => {
  suscribirResultados();
});
