
const leitorNomeInput = document.getElementById('nome-leitor');
const salvarLeitorBtn = document.getElementById('salvar-leitor');
const nomesDisponiveisUL = document.getElementById('leitores-disponiveis');
const sorteioDataInput = document.getElementById('sorteio-data');
const sorteioLeituraInput = document.getElementById('sorteio-leitura');
const excetoNomeInputs = document.querySelectorAll('.exceto-nome');
const btnSortear = document.getElementById('btn-sortear');
const resultadoDataSpan = document.getElementById('resultado-data');
const resultado1LeituraSpan = document.getElementById('resultado-1leitura');
const resultado2LeituraSpan = document.getElementById('resultado-2leitura');
const resultadoPrecesSpan = document.getElementById('resultado-preces');
const historicoSorteiosDiv = document.getElementById('historico-de-sorteios');


let leitoresDisponiveis = JSON.parse(localStorage.getItem('leitores')) || [];
let historicoSorteios = JSON.parse(localStorage.getItem('historico')) || [];




function adicionarLeitor() {
    const nome = leitorNomeInput.value.trim();

    if (!nome) {
        alert("Digite um nome antes de salvar.");
        return;
    }

    if (leitoresDisponiveis.includes(nome)) {
        alert("Este nome já foi adicionado.");
        return;
    }

    leitoresDisponiveis.push(nome);
    salvarLeitores();
    renderizarLeitores();
    leitorNomeInput.value = '';
}


function removerLeitor(nomeParaRemover) {
    leitoresDisponiveis = leitoresDisponiveis.filter(nome => nome !== nomeParaRemover);
    salvarLeitores();
    renderizarLeitores();
}


function renderizarLeitores() {
    nomesDisponiveisUL.innerHTML = '';

    leitoresDisponiveis.forEach(nome => {
        const li = document.createElement('li');
        li.textContent = nome;

        const removerBtn = document.createElement('button');
        removerBtn.textContent = 'X';
        removerBtn.classList.add('remover-nome');
        removerBtn.onclick = () => removerLeitor(nome);

        li.appendChild(removerBtn);
        nomesDisponiveisUL.appendChild(li);
    });
}


function salvarLeitores() {
    localStorage.setItem('leitores', JSON.stringify(leitoresDisponiveis));
}


function sortearLeitores() {
    if (leitoresDisponiveis.length < 3) {
        alert("Adicione pelo menos 3 leitores para realizar o sorteio.");
        return;
    }

    const data = sorteioDataInput.value;
    if (!data) {
        alert("Escolha uma data para o sorteio.");
        return;
    }

   
    let nomesParaSortear = [...leitoresDisponiveis];
    excetoNomeInputs.forEach(input => {
        const nomeExceto = input.value.trim();
        if (nomeExceto) {
            nomesParaSortear = nomesParaSortear.filter(nome => nome !== nomeExceto);
        }
    });

    if (nomesParaSortear.length < 3) {
        alert("Não há leitores suficientes após as exclusões.");
        return;
    }


    nomesParaSortear.sort(() => Math.random() - 0.5);

    
    const leitura1 = nomesParaSortear[0];
    const leitura2 = nomesParaSortear[1];
    const preces = nomesParaSortear[2];

 
    resultadoDataSpan.textContent = data;
    resultado1LeituraSpan.textContent = leitura1;
    resultado2LeituraSpan.textContent = leitura2;
    resultadoPrecesSpan.textContent = preces;

   
    const sorteio = {
        data,
        leitura1,
        leitura2,
        preces
    };
    historicoSorteios.push(sorteio);
    localStorage.setItem('historico', JSON.stringify(historicoSorteios));

    renderizarHistorico();
}


function renderizarHistorico() {
    if (historicoSorteios.length === 0) {
        historicoSorteiosDiv.innerHTML = "<p>Nenhum sorteio registrado ainda.</p>";
        return;
    }

    historicoSorteiosDiv.innerHTML = "";
    historicoSorteios.forEach(s => {
        const p = document.createElement('p');
        p.textContent = `${s.data} - 1ª: ${s.leitura1} | 2ª: ${s.leitura2} | Preces: ${s.preces}`;
        historicoSorteiosDiv.appendChild(p);
    });
}


salvarLeitorBtn.addEventListener('click', adicionarLeitor);
btnSortear.addEventListener('click', sortearLeitores);


renderizarLeitores();
renderizarHistorico();
