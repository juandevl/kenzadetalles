const mainContainer = document.querySelector("#main-container");
const generarPDF = document.querySelector("#generar-pdf");
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

//Escuchamos el submit del formulario para ingresar los datos
document.addEventListener("submit", (e) => {
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

    //Comprobamos que los input no esten vacios
    if (
      !prodForm &&
      !precioForm &&
      !unidadesForm &&
      !categoriaForm &&
      !envioForm &&
      !seniaForm
    ) {
      console.log("Valores vacios");
      return;
    }

    //Obtenemos los valores de los input ingresados
    const $prodValue = prodForm.value,
      $precioValue = parseFloat(precioForm.value),
      $unidadesValue = parseFloat(unidadesForm.value),
      $categoriaValue = categoriaForm.value,
      $envioValue = parseFloat(envioForm.value),
      $seniaValue = parseFloat(seniaForm.value);

    //Valores de salida

    const $sumaSubtotal = document.querySelector(".suma-subtotal > span");
    const $senia = document.querySelector(".senia > span");
    const $total = document.querySelector(".total > span");
    const $costoEnvio = document.querySelector(".envio > span");

    //Crear fragmento html
    const fragment = document.createDocumentFragment();

    //Creamos tabla de categoria introducida si no existe
    if (!document.querySelector(`#${$categoriaValue}`)) {
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
      const fragment = `
          <h3>${title}</h3>
          <table>
            <tr>
              <th>Producto</th>
              <th>Unidades</th>
              <th>Precio</th>
              <th>Subtotal</th>
            </tr>
          </table>`;

      //Agregamos porcion de codigo html al elemento section
      element.innerHTML = fragment;

      //Introducimos el elemento dentro de la seccion correspondiente
      section.appendChild(element);
    }

    // Crear fila de datos

    const dataRow = document.createElement("tr"),
      dataProducto = document.createElement("td"),
      dataUnidades = document.createElement("td"),
      dataPrecio = document.createElement("td"),
      dataSubtotal = document.createElement("td");

    dataProducto.textContent = $prodValue; //Datos de producto ingresado en el form
    dataUnidades.textContent = `${$unidadesValue} u.`; //Datos de unidades ingresados en el form
    dataPrecio.textContent = `$ ${$precioValue}`; //Precio ingresado en el form
    dataSubtotal.textContent = `$ ${$unidadesValue * $precioValue}.-`; // Calculo de subtotal para ingresarlo en la tabla

    //Agrego atributos para buscarlos facilmente
    dataSubtotal.setAttribute("value", $unidadesValue * $precioValue);
    dataSubtotal.setAttribute("class", "subtotal");

    //Agregamos los datos a la fila de la tabla

    dataRow.appendChild(dataProducto);
    dataRow.appendChild(dataUnidades);
    dataRow.appendChild(dataPrecio);
    dataRow.appendChild(dataSubtotal);

    //Agregamos la fila al fragmento
    fragment.appendChild(dataRow);

    //Agrergamos fragmento a la tabla
    const tabla = document.querySelector(`#${$categoriaValue} > table`);
    tabla.appendChild(fragment);

    //Agregamos nombre de cliente al encabezado
    if (!document.querySelector("#header > h2")) {
      const fragment = document.createDocumentFragment();
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
      envioForm.setAttribute("value", $envioValue);
      envioForm.setAttribute("disabled", true); // desactiva input costo envio
      envioForm.style.display = "none";
      //Seleccionamos etiqueta label para envio
      document.querySelector("label[for=envio]").style.display = "none";
      seniaForm.setAttribute("value", $seniaValue); // Asigna el valor de la senia
      seniaForm.setAttribute("disabled", true); // desactiva input senia
      seniaForm.style.display = "none";
      //Seleccionamos etiqueta label para senia
      document.querySelector("label[for=senia]").style.display = "none";
    }

    //Sumamos todos los valores de subtotal
    // Y lo agregamos a la tabla

    if (dataSubtotal.classList.contains("subtotal")) {
      const datos = document.querySelectorAll(".subtotal");
      const values = [];
      datos.forEach((dato) => {
        values.push(parseFloat(dato.getAttribute("value")));
      });
      const sumaSubtotal = parseFloat(
        values.reduce((acumulador, valorActual) => acumulador + valorActual)
      );

      $sumaSubtotal.textContent = `$ ${sumaSubtotal.toFixed(2)}`;
      $senia.textContent = `$ ${$seniaValue.toFixed(2)}`;
      $total.textContent = `$ ${(
        sumaSubtotal +
        ($envioValue || 0) -
        $seniaValue
      ).toFixed(2)}`;
      $costoEnvio.textContent = `$ ${($envioValue || 0).toFixed(2)}`;
    }

    // Limpiamos datos de formulario y enfocamos en unidades
    document.querySelector("#form-datos").reset();
    document.querySelector("#unidades").focus();
  }
});
