const mainContainer = document.querySelector("#main-container");
const generarPDF = document.querySelector("#generar-pdf");
const editarCeldas = document.querySelector("#edit-celdas");
let numero = 0;
let nombre;

//Funcion para crear saltos de pagina
function ajustarContenedor() {
  const articulo = document.querySelectorAll(".articulo");
  //Verificamos que la altura del contenido no sea mayor que la del contenedor
  if (mainContainer.offsetHeight > 1035) {
    articulo[articulo.length - 1].classList.add("html2pdf__page-break");
  }
}

//Funcion para crear pdf al hacer click
generarPDF.addEventListener("click", () => {
  ajustarContenedor();
  const opt = {
    margin: [15, 20, 15, 20],
    filename: nombre,
    pagebreak: {
      mode: ["avoid-all", "css"],
      before: ".html2pdf__page-break",
    },
    image: {
      type: "jpeg",
      quality: 0.98,
    },
    html2canvas: {
      scale: 2,
      letterRendering: true,
      dpi: 192,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
  };

  const btns_control = document.querySelectorAll(".btn-control");
  btns_control.forEach((btn) => {
    btn.style.display = "none";
  });

  setTimeout(() => {
    html2pdf()
      .set(opt)
      .from(mainContainer)
      .save()
      .catch((err) => console.log("Entramos en el error:" + err));
  }, 1000);
  if (document.querySelector(".html2pdf__page-break")) {
    const el = document.querySelector(".html2pdf__page-break");
    el.classList.remove("html2pdf__page-break");
  }
});

// editarCeldas.addEventListener("click", () => {
//   const tablas = document.querySelectorAll(".articulo table tr td");
//   tablas.forEach((td) => {
//     console.log(td.textContent);
//     td.setAttribute("contentEditable", "true");
//   });
// });

//Escuchamos el submit del formulario para ingresar los datos
document.addEventListener("submit", (e) => {
  //-----------------------------------
  //Inicio form cargarDatos
  //-----------------------------------
  if (e.submitter.id === "cargarDatos") {
    e.preventDefault();

    //Inputs de formulario
    const prodForm = document.querySelector("#producto"),
      precioForm = document.querySelector("#precio"),
      unidadesForm = document.querySelector("#unidades"),
      categoriaForm = document.querySelector("#categoria"),
      envioForm = document.querySelector("#envio"),
      seniaForm = document.querySelector("#senia");
    nombre = document.querySelector("#cliente").value;

    //Obtenemos los valores de los input ingresados
    const $prodValue = prodForm.value,
      $precioValue = parseFloat(precioForm.value),
      $unidadesValue = parseFloat(unidadesForm.value),
      $categoriaValue = categoriaForm.value,
      $envioValue = parseFloat(envioForm.value),
      $seniaValue = parseFloat(seniaForm.value);

    //Comprobamos que los input no esten vacios
    if (
      !$prodValue &&
      !$precioValue &&
      !$unidadesValue &&
      !$categoriaValue &&
      !$envioValue &&
      !$seniaValue
    ) {
      console.log("Valores vacios");
      return;
    }

    //Elementos del dom para cargar los datos

    const $sumaSubtotal = document.querySelector(".suma-subtotal");
    const $senia = document.querySelector(".senia");
    const $total = document.querySelector(".total");
    const $costoEnvio = document.querySelector(".envio");

    //Asigno valor a la etiqueta senia
    $senia.setAttribute("value", `${$seniaValue || 0}`);
    $costoEnvio.setAttribute("value", `${$envioValue || 0}`);

    //Crear fragmento html
    const fragment = document.createDocumentFragment();

    //Agregamos nombre de cliente al encabezado
    if (!document.querySelector("#header > h2")) {
      const nombreCliente = document.createElement("h2");
      const clienteForm = document.querySelector("#cliente");

      nombreCliente.textContent = clienteForm.value;
      fragment.appendChild(nombreCliente);

      document.querySelector("#header").appendChild(fragment);

      clienteForm.setAttribute("value", clienteForm.value); //Asignamos el nombre en input cliente
      clienteForm.setAttribute("disabled", true); // desactiva input nombre cliente
      clienteForm.style.display = "none";
      //Seleccionamos etiqueta label para cliente
      document.querySelector("label[for=cliente]").style.display = "none";

      // envioForm.setAttribute("value", $envioValue);
      // envioForm.setAttribute("disabled", true); // desactiva input costo envio
      // envioForm.style.display = "none";
      //Seleccionamos etiqueta label para envio
      // document.querySelector("label[for=envio]").style.display = "none";

      // seniaForm.setAttribute("value", $seniaValue); // Asigna el valor de la senia
      // seniaForm.setAttribute("disabled", true); // desactiva input senia
      // seniaForm.style.display = "none";
      //Seleccionamos etiqueta label para senia
      // document.querySelector("label[for=senia]").style.display = "none";
    }

    //Creamos tabla de categoria introducida si no existe y es distinta de envio
    if (
      !document.querySelector(`#${$categoriaValue}`) &&
      $categoriaValue != "envio"
    ) {
      const section = document.querySelector("#productos");
      //Creamos el elemento article
      const element = document.createElement("article");
      //Asignamos el atributo id con el valor de $categoriaValue
      element.setAttribute("id", $categoriaValue);
      element.classList.add("articulo");

      //Busca la primer letra del string, con una callback comprueba que la coincidencia la transforme en uppercase
      const str = new String($categoriaValue);
      const title = str.replace(/^[a-z]/, (match) => match.toUpperCase());

      //Creamos una porcion de codigo html
      const table = `
          <h3>${title}</h3>
          <table class="tabla">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Unidades</th>
                <th>Precio</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>`;

      //Agregamos porcion de codigo html al elemento section
      element.innerHTML = table;

      //Introducimos el elemento dentro de la seccion correspondiente
      section.appendChild(element);
    }

    //Cargamos datos a la tabla introducida en categoria

    if ($categoriaValue && $categoriaValue != "envio") {
      if (!$prodValue || !$unidadesValue || !$precioValue || !$costoEnvio) {
        alert("Valores introducidos invalidos.");
        return;
      } else {
        /* Creamos fila de datos */
        const row = document.createElement("tr");
        let num = numero;
        row.setAttribute("id", `row${num}`);
        row.innerHTML = `
          <td>${$prodValue}</td>
          <td>${$unidadesValue} u.</td>
          <td>$ ${$precioValue}</td>
          <td class="subtotal" value= "${$unidadesValue * $precioValue}" >$ ${
          $unidadesValue * $precioValue
        }</td>
          <td class="btn-control">
            <button class="edit-fila" value="row${num}">✏️</button>
            <button class="eliminar-fila" value="row${num}">❌</button>
          </td>
        `;

        //Agrergamos fragmento a la tabla
        const tabla = document.querySelector(
          `#${$categoriaValue} > table>tbody`
        );
        tabla.appendChild(row);
        numero++; //Incrementamos numero para el id de la fila

        //Seleccionamos las tablas del html

        const tablas = document.querySelectorAll(".tabla");
        const editbtn = document.querySelectorAll(".edit-fila");
        const deletebtn = document.querySelectorAll(".eliminar-fila");
        const fila = document.querySelectorAll("tbody tr");

        tablas.forEach((tabla) => {});

        editbtn.forEach((btn) => {
          //Compruebo si existe un listener click previo
          if (btn.getAttribute("click-listener") !== "true") {
            btn.addEventListener("click", (e) => {
              console.log("valor de boton edit");
              console.log(e.target.value);
              console.log(row);

              const container = document.querySelector("#container");
              const modal = document.querySelector("#modal");
              const editProducto = document.querySelector("#editProducto");
              const editUnidades = document.querySelector("#editUnidades");
              const editPrecio = document.querySelector("#editPrecio");
              const inputHiddenId = document.querySelector("#input-hidden-id");

              // Abre el modal al hacer clic en el botón "Editar" de una fila
              if (e.target && e.target.classList.contains("edit-fila")) {
                // const fila = e.target.closest("tr");
                const celdas = row.querySelectorAll("td");
                // Obtén los datos de la fila seleccionada
                const producto = celdas[0].textContent;
                const unidades = parseInt(celdas[1].textContent);
                const precio = parseFloat(
                  celdas[2].textContent.replace(/[^\d.]/g, "")
                );
                inputHiddenId.value = e.target.value; //Asignamos el id de la fila

                // Llena el formulario en el modal con los datos de la fila
                editProducto.value = producto;
                editUnidades.value = unidades;
                editPrecio.value = precio;

                // Abre el modal
                container.classList.add("modal-container");
                modal.classList.remove("hidden");
                modal.classList.add("show");
              }
            });
            btn.setAttribute("click-listener", "true"); //Actualizo el listener a true
          }
        });
        deletebtn.forEach((btn) => {
          //Compruebo si existe un listener previo
          if (btn.getAttribute("click-listener") !== "true") {
            btn.addEventListener("click", (e) => {
              console.log("valor de boton delete");
              console.log(e.target.value);
              console.log(row);

              alert("Desea eliminar la fila?");

              // document.querySelector(`#${e.target.value}`)
              row.parentNode.removeChild(row);
            });
            btn.setAttribute("click-listener", "true"); //Actualizo listener a true
          }
        });
      }
    }

    //Verificamos si existen elementos con la clase subtotal
    //Sumamos todos los valores de subtotal
    // Y lo agregamos a la tabla
    const datos = document.querySelectorAll(".subtotal");
    if (datos) {
      const values = [];
      datos.forEach((dato) => {
        values.push(parseFloat(dato.getAttribute("value")));
      });
      const sumaSubtotal = parseFloat(
        values.reduce((acumulador, valorActual) => acumulador + valorActual)
      );

      //-------------------------------------------
      //Agregamos el valor al contenido
      //-------------------------------------------
      $sumaSubtotal.textContent = `$ ${sumaSubtotal.toFixed(2)}`;
      $senia.textContent = `$ ${($seniaValue || 0).toFixed(2)}`;
      $total.textContent = `$ ${(
        sumaSubtotal +
        ($envioValue || 0) -
        ($seniaValue || 0)
      ).toFixed(2)}`;
      $costoEnvio.textContent = `$ ${($envioValue || 0).toFixed(2)}`;

      //-------------------------------------------------
      //Asignamos el calculo al valor del elemento
      //-------------------------------------------------
      $sumaSubtotal.setAttribute("value", sumaSubtotal.toFixed(2));
      if (!$senia.hasAttribute("value")) {
        $senia.setAttribute("value", ($seniaValue || 0).toFixed(2));
      } else {
        $senia.setAttribute("value", $seniaValue.toFixed(2));
      }
      $total.setAttribute(
        "value",
        (sumaSubtotal + ($envioValue || 0) - ($seniaValue || 0)).toFixed(2)
      );
      $costoEnvio.setAttribute("value", ($envioValue || 0).toFixed(2));
      // $sumaSubtotal.value = `${sumaSubtotal.toFixed(2)}`;
      // $total.value = `${(
      //   sumaSubtotal +
      //   ($envioValue || 0) -
      //   ($seniaValue || 0)
      // ).toFixed(2)}`;
      // $senia.value = `${($seniaValue || 0).toFixed(2)}`;
      // $costoEnvio.value = `${$envioValue}`;
    }

    // Limpiamos datos de formulario y enfocamos en unidades
    document.querySelector("#form-datos").reset();
    document.querySelector("#unidades").focus();
  }
  //------------------------------------------------------------
  // fin submit form cargarDatos
  //------------------------------------------------------------

  //------------------------------------------------------------
  //Escuchamos el submit del formulario para editar los valores
  //------------------------------------------------------------

  //-----------------------------------
  //Inicio form editar celdas
  //-----------------------------------
  if (e.submitter.id === "editForm") {
    e.preventDefault();
    const idrow = document.querySelector("#input-hidden-id").value;
    const row = document.querySelector(`#${idrow}`);
    const producto = document.querySelector("#editProducto").value;
    const precio = parseFloat(document.querySelector("#editPrecio").value);
    const unidades = parseFloat(document.querySelector("#editUnidades").value);

    let celdas = row.querySelectorAll("td");

    celdas[0].innerHTML = `${producto}`;
    celdas[1].innerHTML = `${unidades} u.`;
    celdas[2].innerHTML = `$ ${precio}`;
    celdas[3].setAttribute("value", `${unidades * precio}`); //subtotal
    celdas[3].innerHTML = `$ ${unidades * precio}`; //subtotal

    //Verificamos si existen elementos con la clase subtotal
    //Sumamos todos los valores de subtotal
    // Y lo agregamos a la tabla

    const $sumaSubtotal = document.querySelector(".suma-subtotal");
    const $senia = document.querySelector(".senia");
    const $total = document.querySelector(".total");
    const $costoEnvio = document.querySelector(".envio");

    const datosSubTotal = document.querySelectorAll(".subtotal"); //recorro todos los elementos con la clase subtotal
    if (datosSubTotal) {
      const values = [];
      datosSubTotal.forEach((dato) => {
        values.push(parseFloat(dato.getAttribute("value")));
      });
      const sumaSubtotal = parseFloat(
        values.reduce((acumulador, valorActual) => acumulador + valorActual)
      );
      //----------------------------------------
      //Actualizamos el texcontent de los elementos
      //----------------------------------------
      $sumaSubtotal.textContent = `$ ${sumaSubtotal.toFixed(2)}`;
      // console.log($senia.value);
      $senia.textContent = `$ ${$senia.value}`;
      $total.textContent = `$ ${(
        sumaSubtotal +
        ($costoEnvio.value || 0) -
        $senia.value
      ).toFixed(2)}`;
      $costoEnvio.textContent = `$ ${($costoEnvio.value || 0).toFixed(2)}`;

      //----------------------------------------
      //Actualizamos el value de los elementos
      //----------------------------------------
      $sumaSubtotal.value = sumaSubtotal.toFixed(2);
      // $senia.value = `${$senia.value || 0}`;
      $total.value = (
        sumaSubtotal +
        ($costoEnvio.value || 0) -
        $senia.value
      ).toFixed(2);
    }

    const modal = document.querySelector("#modal");
    const container = document.querySelector("#container");

    container.classList.remove("modal-container");
    modal.classList.remove("show");
    modal.classList.add("hidden");
    return;
  }
  //-----------------------------------
  //fin form editar celdas
  //-----------------------------------
});

const btnClose = document.querySelector(".close");

//Cierra el modal
btnClose.addEventListener("click", () => {
  const modal = document.querySelector("#modal");
  const container = document.querySelector("#container");

  container.classList.remove("modal-container");
  modal.classList.remove("show");
  modal.classList.add("hidden");
});

const editForm = document.querySelector("#editForm");

editForm.addEventListener("submit", (e) => {});
