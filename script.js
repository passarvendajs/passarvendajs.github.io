let contadorCartas = 1; // Começa com 1 carta já existente

function adicionarCarta() {
    contadorCartas++; // Incrementa o contador de cartas

    // Cria a nova div para a carta
    const novaCarta = document.createElement('div');
    novaCarta.className = 'credito-item';
    novaCarta.innerHTML = `
        <label>Carta ${contadorCartas}:</label>
        <select id="credito${contadorCartas}" onchange="toggleCustomInput(this, 'creditoCustom${contadorCartas}')">
            <option value="">Selecione um valor</option>
            <option value="R$ 49.605,07">R$ 49.605,07</option>
            <option value="R$ 58.624,07">R$ 58.624,07</option>
            <option value="R$ 67.643,07">R$ 67.643,07</option>
            <option value="random">Valor Aleatório</option>
        </select>
        <input type="text" id="creditoCustom${contadorCartas}" placeholder="Valor" oninput="formatarValor(event, 'credito${contadorCartas}')" style="display:none;">
        <select id="quantidadeCredito${contadorCartas}" class="quantidade" required>
            <option value="">Quantidade</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
        </select>
        <button id="button1" type="button" onclick="excluirCarta(this)">Excluir</button>
    `;
    
    // Adiciona a nova carta ao campo existente
    const fieldset = document.querySelector('fieldset:last-of-type');
    fieldset.appendChild(novaCarta);
}

function excluirCarta(botao) {
    // Remove a carta correspondente
    const carta = botao.parentElement;
    carta.remove();
    contadorCartas--; // Decrementa o contador de cartas

    // Atualiza os números das cartas restantes
    const cartas = document.querySelectorAll('.credito-item');
    cartas.forEach((carta, index) => {
        const numeroCarta = index + 1; // Ajusta o número da carta
        const label = carta.querySelector('label');
        if (label) {
            label.textContent = `Carta ${numeroCarta}:`;
        }
        // Atualiza os IDs dos selects e inputs
        const selectCredito = carta.querySelector('select[id^="credito"]');
        const selectQuantidade = carta.querySelector('select[id^="quantidadeCredito"]');
        if (selectCredito) {
            selectCredito.id = `credito${numeroCarta}`;
        }
        if (selectQuantidade) {
            selectQuantidade.id = `quantidadeCredito${numeroCarta}`;
        }
        const inputCustom = carta.querySelector('input[id^="creditoCustom"]');
        if (inputCustom) {
            inputCustom.id = `creditoCustom${numeroCarta}`;
        }
    });
}

function enviarWhatsApp(event) {
    event.preventDefault();

    const formaPagamento = [...document.querySelectorAll('input[name="formaPagamento"]:checked')]
        .map(el => el.nextSibling.textContent.trim()).join(", ");
    const tipoPessoa = [...document.querySelectorAll('input[name="tipoPessoa"]:checked')]
        .map(el => el.nextSibling.textContent.trim()).join(", ");
    const tipoVenda = [...document.querySelectorAll('input[name="tipoVenda"]:checked')]
        .map(el => el.nextSibling.textContent.trim()).join(", ");
    const tipoPlano = [...document.querySelectorAll('input[name="tipoPlano"]:checked')]
        .map(el => el.nextSibling.textContent.trim()).join(", ");
    const grupo = document.getElementById('grupo').value;

    let mensagemCartas = '';
    for (let i = 1; i <= contadorCartas; i++) {
        const credito = document.getElementById(`credito${i}`).value === 'random' 
            ? document.getElementById(`creditoCustom${i}`).value 
            : document.getElementById(`credito${i}`).value;
        const quantidade = document.getElementById(`quantidadeCredito${i}`).value;

        mensagemCartas += `*Carta ${i}:* ${quantidade}x de ${credito}\n`; // Modificação aqui
    }

    const lance = document.getElementById('lance').value === 'random' 
        ? document.getElementById('lanceCustom').value 
        : document.getElementById('lance').value === "30" 
            ? "30%" 
            : document.getElementById('lance').value;

    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
    const cpf = document.getElementById('cpf').value;

    const mensagem = `Oiii,
Você passa essa venda pra mim, fazendo favor?

*Forma de pagamento:* ${formaPagamento}
*Tipo de pessoa:* ${tipoPessoa}
*Tipo de venda:* ${tipoVenda}
*Tipo de plano:* ${tipoPlano}
*Grupo:* ${grupo}
${mensagemCartas}*Lance:* ${lance}
*Telefone:* ${telefone}
*E-mail:* ${email}
*Meu CPF:* ${cpf}`;

    const encodedMensagem = encodeURIComponent(mensagem);
    const numeroWhatsApp = '17997424076';
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodedMensagem}`;
    window.open(urlWhatsApp, '_blank');
}

function toggleCustomInput(select, customInputId) {
    const customInput = document.getElementById(customInputId);
    if (select.value === 'random') {
        customInput.style.display = 'block';
    } else {
        customInput.style.display = 'none';
        customInput.value = ''; // Limpa o valor do input customizado
    }
}

function formatarLance(event) {
    let valor = event.target.value.replace(/[^0-9]/g, '');
    event.target.value = valor ? `${valor}%` : '';
}

function formatarTelefone(event) {
    let valor = event.target.value.replace(/\D/g, ''); // Remove qualquer caractere que não seja número
    valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2'); // Coloca parênteses no DDD
    valor = valor.replace(/(\d{5})(\d)/, '$1-$2'); // Coloca hífen no meio
    event.target.value = valor;
}

function formatarCPF(event) {
    let valor = event.target.value.replace(/\D/g, ''); // Remove qualquer caractere que não seja número
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2'); // Coloca ponto entre os blocos
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2'); // Coloca outro ponto
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Coloca hífen antes dos dois últimos dígitos
    event.target.value = valor;
}

function formatarValor(event, creditoId) {
    let valor = event.target.value.replace(/\D/g, ''); // Remove tudo que não for número
    if (valor) {
        valor = (parseFloat(valor) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        event.target.value = valor;
        document.getElementById(creditoId).value = 'random'; // Define o select como 'random'
    }
}
