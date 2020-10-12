/*Objeto Político tem: nome, partido, imagem e url */
class Politico {
  constructor(nome, partido, imagem, uri) {
    this.nome = nome;
    this.partido = partido;
    this.imagem = imagem;
    this.uri = uri;
  }
}
/**função assíncrona para formar a lista ou array
 *  com o nome digitado pelo usuário no input */
async function buscaPoliticosNome() {
  /**criei um array vazio */
  var politicos = [];

  /**encontrei o input digitado pelo usuario */
  let userInput = document.getElementById("userInput");

  /* let retorna todos os políticos com o nome digitado no input */
  let url = "https://dadosabertos.camara.leg.br/api/v2/deputados?nome=" + userInput.value;

  const retorno = await fetch(url);

  /*passei a url em xml, para o formato json */
  const json = await retorno.json();

  /*criei variável para checar se #listaConsultada existe */
  var lista = document.getElementById("listaConsultada");

  /*aqui estou limpando o input após a exibição da lista */
  userInput.value = "";

  /*Se #listaConsultada existe(true) aqui estou limpando a lista
   após a pesquisa, impedindo que sejam feitos blocos de lista, um embaixo do outro*/
  if (lista) {
    lista.parentNode.removeChild(lista);
  }
  /*Se #caixaPesquisa existe(true) aqui estou limpando
  impedindo que sejam feitos blocos de lista, embaixo do
  politico detalhado*/
  let boxPesquisa = document.getElementById("caixaPesquisa");
  if (boxPesquisa) {
    boxPesquisa.parentNode.removeChild(boxPesquisa);
  }

  /**contador para atribuir id à imagem */
  var imgId = 0;
  /**estou selecionando a div inicio */
  let inicio = document.querySelector("#inicio");

  /**estou criando ul */
  let ul = document.createElement("ul");
  ul.setAttribute("id", "listaConsultada");
  /**estou garantindo que ul começa vazia */
  ul.innerHTML = "";

  /**estou adicionando ul à div inicio */
  inicio.appendChild(ul);

  /**comecei a percorrer o json */
  for (let item of json.dados) {
    /**criei os elementos html que serão necessário */
    if (item.idLegislatura == 56) {
      let li = document.createElement("li");
      let a = document.createElement("a");
      let figure = document.createElement("figure");
      let figureCaption = document.createElement("figcaption");
      let imagem = document.createElement("img");

      /**agrupei nome, partido e uf à minha figureCaption */
      figureCaption.innerText = `${item.nome} (${item.siglaPartido}/${item.siglaUf})`;

      /**mudei o id da imagem, para conseguir identificá-la por número */
      imagem.setAttribute("id", imgId);

      /*adicionei uma classe a imagem para estilizar */
      imagem.classList.add("imgPolitico");

      /**direicionei a imagem para a url correta na API */
      imagem.src = item.urlFoto;

      /**adicionei as tags no HTML */
      ul.appendChild(li);
      li.appendChild(a);
      a.appendChild(figure);
      figure.appendChild(imagem);
      figure.appendChild(figureCaption);

      /**instanciei um novo Objeto */
      var politico = new Politico(item.nome, item.siglaPartido, item.urlFoto, item.uri);
      politicos.push(politico);

      /**passei para a próxima imagem de político */
      imgId++;
    }
  }
  return politicos;
}



/*segundo cenário, com dados detalhados do político escolhido */
function buscaDetalhada() {
  /**chamei a função buscaPoliticosNome */
  buscaPoliticosNome().then(politicos => {
    /**estou percorrendo o array, e cada item está relacionado a uma imagem de político
     * que será incrementada no final
     * ao clicar nessa imagem usuário visualiza informações detalhadas do politico
     */
    for (let i = 0; i < politicos.length; i++) {
      var img = document.getElementById(i);
      async function resultado() {
        var uri = politicos[i].uri;
        const retorno = await fetch(uri);
        const json = await retorno.json();


        /**estou removendo a lista consultada com o array
         * para exibir apenas o político detalhado
         */
        var capturaUl = document.getElementById("listaConsultada");
        capturaUl.parentNode.removeChild(capturaUl);


        /**tag imagem para exibir a imagem da uri do politico escolhido
         * estilizei com classes imgPolitico e transition
         */
        let imagemSelec = document.createElement("img");
        imagemSelec.classList.add("imgPolitico");
        imagemSelec.classList.add("transition");


        /**criei tag span para agrupar os dados detalhados */
        let span1 = document.createElement("span");
        let span2 = document.createElement("span");
        let span3 = document.createElement("span");
        let span4 = document.createElement("span");
        let span5 = document.createElement("span");

        /**crie div para receber dados da pesquisa detalhada */
        let caixaPesquisa = document.createElement("div");
        caixaPesquisa.setAttribute("id", "caixaPesquisa");

        /**chamei a div inicio em uma nova variavel */
        let inicioDetalhado = document.getElementById("inicio");


        /**aqui estou atribuindo valor as tags criadas
         * indicando url da api detalhada
         */
        imagemSelec.src = json.dados.ultimoStatus.urlFoto;
        span1.innerHTML = "<strong>Nome: </strong>" + json.dados.nomeCivil;
        span1.classList.add("overAuto");/*para aplicar o overFlow no texto */

        span2.innerHTML = "<strong>UF: </strong>" + json.dados.ultimoStatus.siglaUf;
        span3.innerHTML = "<strong>Partido: </strong>" + json.dados.ultimoStatus.siglaPartido;
        span4.innerHTML = "<strong>CPF: </strong>" + json.dados.cpf;

        span5.innerHTML = "<strong>Email: </strong>" + json.dados.ultimoStatus.email;
        span5.classList.add("overAuto");/*para aplicar o overFlow no texto */


        /**aqui estou adicionando as tags ao HTML */
        inicioDetalhado.appendChild(caixaPesquisa);
        caixaPesquisa.appendChild(imagemSelec);
        caixaPesquisa.appendChild(span1);
        caixaPesquisa.appendChild(span2);
        caixaPesquisa.appendChild(span3);
        caixaPesquisa.appendChild(span4);
        caixaPesquisa.appendChild(span5);

      }
      /**ao clicar na imagem usuário chama a função resultado
       * que fará a pesquisa detalhada
       */
      img.addEventListener("click", resultado);
    }
  })

}
/**lógica para div fantasmas: inicio e assessment */
function exibirInicio() {
  document.getElementById("inicio").style.display = "block";
  document.getElementById("assessment").style.display = "none";/*div se torna fantasma */
}

function exibirAssessment() {
  document.getElementById("inicio").style.display = "none"; /*div se torna fantasma */
  document.getElementById("assessment").style.display = "block";

}